// Truth Engine — Query engine for /api/query endpoint
import { getDb } from './db';

export interface QueryParams {
    skill?: string;
    org?: string;
    title?: string;
    location?: string;
    updatedAfter?: string;
    limit?: number;
    cursor?: string;
}

export interface QueryResult {
    handle: string;
    name: string;
    headline: string | null;
    location: string | null;
    lastUpdated: string;
}

export interface QueryResponse {
    results: QueryResult[];
    nextCursor: string | null;
}

/**
 * Search published profiles using substring/contains matching (MVP).
 * Returns only public data from the search index.
 */
export async function queryProfiles(params: QueryParams): Promise<QueryResponse> {
    const db = getDb();
    const conditions: string[] = [];
    const args: any[] = [];
    const limit = Math.min(params.limit || 20, 100);

    if (params.skill) {
        conditions.push('skills LIKE ?');
        args.push(`%${params.skill}%`);
    }

    if (params.org) {
        conditions.push('organizations LIKE ?');
        args.push(`%${params.org}%`);
    }

    if (params.title) {
        conditions.push('titles LIKE ?');
        args.push(`%${params.title}%`);
    }

    if (params.location) {
        conditions.push('location LIKE ?');
        args.push(`%${params.location}%`);
    }

    if (params.updatedAfter) {
        conditions.push('updated_at > ?');
        args.push(params.updatedAfter);
    }

    if (params.cursor) {
        conditions.push('handle > ?');
        args.push(params.cursor);
    }

    const where = conditions.length > 0
        ? `WHERE ${conditions.join(' AND ')}`
        : '';

    const sql = `
    SELECT handle, name, headline, location, updated_at as lastUpdated
    FROM search_index
    ${where}
    ORDER BY handle ASC
    LIMIT ?
  `;
    args.push(limit + 1); // Fetch one extra to determine if there's a next page

    const result = await db.execute({
        sql,
        args
    });

    const rows = result.rows as unknown as (QueryResult & { lastUpdated: string })[];

    const hasMore = rows.length > limit;
    const results = hasMore ? rows.slice(0, limit) : rows;
    const nextCursor = hasMore ? results[results.length - 1].handle : null;

    return { results, nextCursor };
}
