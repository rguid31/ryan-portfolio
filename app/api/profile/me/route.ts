// GET /api/profile/me — Get canonical draft + visibility settings
import { NextRequest, NextResponse } from 'next/server';
import {
    requireAuth,
    getDraft,
    getHandleByUserId,
    getLatestSnapshot,
    safeLogError,
    checkRateLimit,
    DEFAULT_RATE_LIMIT,
} from '@/lib/truth-engine';
import type { ApiError } from '@/lib/truth-engine';

export async function GET(request: NextRequest) {
    // Rate limiting: 100 requests per minute
    const rateLimitResponse = checkRateLimit(request, DEFAULT_RATE_LIMIT);
    if (rateLimitResponse) return rateLimitResponse;

    // Auto-migrate (Ensure Turso tables exist)
    try {
        const { migrate } = await import('@/lib/truth-engine/db');
        await migrate();
    } catch (migErr) {
        safeLogError('Migration', migErr);
    }

    try {
        const user = await requireAuth();

        const handle = await getHandleByUserId(user.id);
        const draftRow = await getDraft(user.id);

        const latestSnapshot = handle
            ? await getLatestSnapshot(handle.handle)
            : null;

        return NextResponse.json({
            handle: handle?.handle || null,
            published: !!latestSnapshot,
            draft: draftRow ? JSON.parse(draftRow.canonical_json) : null,
            visibility: draftRow ? JSON.parse(draftRow.visibility_json) : null,
            latestPublished: latestSnapshot
                ? {
                    versionId: latestSnapshot.version_id,
                    publishedAt: latestSnapshot.created_at,
                }
                : null,
        });
    } catch (err) {
        if ((err as ApiError).code === 'UNAUTHORIZED') {
            return NextResponse.json(err, { status: 401 });
        }
        safeLogError('GET /api/profile/me', err);
        return NextResponse.json(
            { code: 'INTERNAL', message: 'Internal server error.' } satisfies ApiError,
            { status: 500 },
        );
    }
}
