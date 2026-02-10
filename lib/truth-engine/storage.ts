// Truth Engine — Storage layer: CRUD for users, drafts, snapshots, and search index
import { getDb } from './db';
import type {
    CanonicalProfile,
    VisibilitySettings,
    PublicProfile,
    UserRow,
    HandleRow,
    ProfileDraftRow,
    ProfileSnapshotRow,
    SearchIndexRow,
} from './types';
import { hashSync, compareSync } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// ─── Users ───────────────────────────────────────────────────────

export async function createUser(email: string, password: string): Promise<UserRow> {
    const db = getDb();
    const passwordHash = hashSync(password, 10);
    const result = await db.execute({
        sql: 'INSERT INTO users (email, password_hash) VALUES (?, ?)',
        args: [email, passwordHash]
    });

    const id = Number(result.lastInsertRowid);
    const userResult = await db.execute({
        sql: 'SELECT * FROM users WHERE id = ?',
        args: [id]
    });
    return userResult.rows[0] as unknown as UserRow;
}

export async function getUserByEmail(email: string): Promise<UserRow | undefined> {
    const db = getDb();
    const result = await db.execute({
        sql: 'SELECT * FROM users WHERE email = ?',
        args: [email]
    });
    return result.rows[0] as unknown as UserRow | undefined;
}

export async function getUserById(id: number | string): Promise<UserRow | undefined> {
    const db = getDb();
    const result = await db.execute({
        sql: 'SELECT * FROM users WHERE id = ?',
        args: [id]
    });
    return result.rows[0] as unknown as UserRow | undefined;
}

export function verifyPassword(user: UserRow, password: string): boolean {
    return compareSync(password, user.password_hash);
}

// ─── Handles ─────────────────────────────────────────────────────

export async function claimHandle(userId: number, handle: string): Promise<HandleRow> {
    const db = getDb();
    const result = await db.execute({
        sql: 'INSERT INTO handles (user_id, handle) VALUES (?, ?)',
        args: [userId, handle]
    });
    const id = Number(result.lastInsertRowid);
    const handleResult = await db.execute({
        sql: 'SELECT * FROM handles WHERE id = ?',
        args: [id]
    });
    return handleResult.rows[0] as unknown as HandleRow;
}

export async function getHandleByUserId(userId: number): Promise<HandleRow | undefined> {
    const db = getDb();
    const result = await db.execute({
        sql: "SELECT * FROM handles WHERE user_id = ? AND status = 'active'",
        args: [userId]
    });
    return result.rows[0] as unknown as HandleRow | undefined;
}

export async function getHandleByName(handle: string): Promise<HandleRow | undefined> {
    const db = getDb();
    const result = await db.execute({
        sql: "SELECT * FROM handles WHERE handle = ? AND status = 'active'",
        args: [handle]
    });
    return result.rows[0] as unknown as HandleRow | undefined;
}

// ─── Profile Drafts ──────────────────────────────────────────────

export async function saveDraft(
    userId: number,
    canonical: CanonicalProfile,
    visibility: VisibilitySettings,
): Promise<ProfileDraftRow> {
    const db = getDb();
    const canonicalJson = JSON.stringify(canonical);
    const visibilityJson = JSON.stringify(visibility);
    const now = new Date().toISOString();

    const existing = await db.execute({
        sql: 'SELECT id FROM profile_drafts WHERE user_id = ?',
        args: [userId]
    });

    if (existing.rows.length > 0) {
        await db.execute({
            sql: 'UPDATE profile_drafts SET canonical_json = ?, visibility_json = ?, updated_at = ? WHERE user_id = ?',
            args: [canonicalJson, visibilityJson, now, userId]
        });
    } else {
        await db.execute({
            sql: 'INSERT INTO profile_drafts (user_id, canonical_json, visibility_json, updated_at) VALUES (?, ?, ?, ?)',
            args: [userId, canonicalJson, visibilityJson, now]
        });
    }

    const finalDraft = await db.execute({
        sql: 'SELECT * FROM profile_drafts WHERE user_id = ?',
        args: [userId]
    });
    return finalDraft.rows[0] as unknown as ProfileDraftRow;
}

export async function getDraft(userId: number): Promise<ProfileDraftRow | undefined> {
    const db = getDb();
    const result = await db.execute({
        sql: 'SELECT * FROM profile_drafts WHERE user_id = ?',
        args: [userId]
    });
    return result.rows[0] as unknown as ProfileDraftRow | undefined;
}

export async function deleteDraft(userId: number): Promise<void> {
    const db = getDb();
    await db.execute({
        sql: 'DELETE FROM profile_drafts WHERE user_id = ?',
        args: [userId]
    });
}

// ─── Profile Snapshots ───────────────────────────────────────────

export async function saveSnapshot(
    handle: string,
    versionId: string,
    publicProfile: PublicProfile,
    jsonLd: object,
    contentHash: string,
): Promise<ProfileSnapshotRow> {
    const db = getDb();
    const publicJson = JSON.stringify(publicProfile);
    const jsonldJson = JSON.stringify(jsonLd);

    await db.execute({
        sql: `INSERT INTO profile_snapshots (handle, version_id, public_json, jsonld_json, content_hash, schema_version)
     VALUES (?, ?, ?, ?, ?, ?)`,
        args: [handle, versionId, publicJson, jsonldJson, contentHash, publicProfile.schemaVersion]
    });

    const result = await db.execute({
        sql: 'SELECT * FROM profile_snapshots WHERE version_id = ?',
        args: [versionId]
    });
    return result.rows[0] as unknown as ProfileSnapshotRow;
}

export async function getLatestSnapshot(handle: string): Promise<ProfileSnapshotRow | undefined> {
    const db = getDb();
    const result = await db.execute({
        sql: `SELECT * FROM profile_snapshots
     WHERE handle = ? AND is_published = 1
     ORDER BY created_at DESC LIMIT 1`,
        args: [handle]
    });
    return result.rows[0] as unknown as ProfileSnapshotRow | undefined;
}

export async function getAllSnapshots(handle: string): Promise<ProfileSnapshotRow[]> {
    const db = getDb();
    const result = await db.execute({
        sql: 'SELECT * FROM profile_snapshots WHERE handle = ? ORDER BY created_at DESC',
        args: [handle]
    });
    return result.rows as unknown as ProfileSnapshotRow[];
}

export async function unpublishSnapshots(handle: string): Promise<void> {
    const db = getDb();
    await db.execute({
        sql: 'UPDATE profile_snapshots SET is_published = 0 WHERE handle = ?',
        args: [handle]
    });
}

export async function deleteAllSnapshots(handle: string): Promise<void> {
    const db = getDb();
    await db.execute({
        sql: 'DELETE FROM profile_snapshots WHERE handle = ?',
        args: [handle]
    });
}

// ─── Search Index ────────────────────────────────────────────────

export async function updateSearchIndex(handle: string, publicProfile: PublicProfile): Promise<void> {
    const db = getDb();
    const now = new Date().toISOString();

    const skills = publicProfile.skills
        ?.flatMap(cat => cat.items)
        .join(',') || null;

    const location = publicProfile.identity.location
        ? [publicProfile.identity.location.city, publicProfile.identity.location.region, publicProfile.identity.location.country]
            .filter(Boolean)
            .join(', ')
        : null;

    const organizations = publicProfile.experience
        ?.map(exp => exp.organization)
        .join(',') || null;

    const titles = publicProfile.experience
        ?.map(exp => exp.title)
        .join(',') || null;

    const existing = await db.execute({
        sql: 'SELECT handle FROM search_index WHERE handle = ?',
        args: [handle]
    });

    if (existing.rows.length > 0) {
        await db.execute({
            sql: `UPDATE search_index
       SET name = ?, headline = ?, skills = ?, location = ?, organizations = ?, titles = ?, updated_at = ?
       WHERE handle = ?`,
            args: [
                publicProfile.identity.name,
                publicProfile.identity.headline || null,
                skills, location, organizations, titles, now, handle,
            ]
        });
    } else {
        await db.execute({
            sql: `INSERT INTO search_index (handle, name, headline, skills, location, organizations, titles, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
                handle,
                publicProfile.identity.name,
                publicProfile.identity.headline || null,
                skills, location, organizations, titles, now,
            ]
        });
    }
}

export async function deleteSearchIndex(handle: string): Promise<void> {
    const db = getDb();
    await db.execute({
        sql: 'DELETE FROM search_index WHERE handle = ?',
        args: [handle]
    });
}

// ─── Sessions ────────────────────────────────────────────────────

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function createSession(userId: number): Promise<string> {
    const db = getDb();
    const sessionId = uuidv4();
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString();
    await db.execute({
        sql: 'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)',
        args: [sessionId, userId, expiresAt]
    });
    return sessionId;
}

export async function getSession(sessionId: string): Promise<{ userId: number } | null> {
    const db = getDb();
    const result = await db.execute({
        sql: "SELECT user_id FROM sessions WHERE id = ? AND expires_at > datetime('now')",
        args: [sessionId]
    });
    const row = result.rows[0];
    return row ? { userId: row.user_id as number } : null;
}

export async function deleteSession(sessionId: string): Promise<void> {
    const db = getDb();
    await db.execute({
        sql: 'DELETE FROM sessions WHERE id = ?',
        args: [sessionId]
    });
}

export async function deleteUserSessions(userId: number): Promise<void> {
    const db = getDb();
    await db.execute({
        sql: 'DELETE FROM sessions WHERE user_id = ?',
        args: [userId]
    });
}

// ─── Full Profile Delete ─────────────────────────────────────────

export async function deleteProfile(userId: number): Promise<void> {
    const db = getDb();
    const handle = await getHandleByUserId(userId);

    if (handle) {
        await deleteSearchIndex(handle.handle);
        await deleteAllSnapshots(handle.handle);
        await db.execute({
            sql: "UPDATE handles SET status = 'deleted' WHERE user_id = ?",
            args: [userId]
        });
    }
    await deleteDraft(userId);
    await deleteUserSessions(userId);
    await db.execute({
        sql: 'DELETE FROM users WHERE id = ?',
        args: [userId]
    });
}
