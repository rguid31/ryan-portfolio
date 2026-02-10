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
    DEFAULT_VISIBILITY,
} from './types';
import { hashSync, compareSync } from 'bcryptjs';
import { randomUUID } from 'crypto';

// ─── Users ───────────────────────────────────────────────────────

export function createUser(email: string, password: string): UserRow {
    const db = getDb();
    const passwordHash = hashSync(password, 10);
    const stmt = db.prepare(
        'INSERT INTO users (email, password_hash) VALUES (?, ?)'
    );
    const result = stmt.run(email, passwordHash);
    return db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid) as UserRow;
}

export function getUserByEmail(email: string): UserRow | undefined {
    const db = getDb();
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email) as UserRow | undefined;
}

export function getUserById(id: number): UserRow | undefined {
    const db = getDb();
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id) as UserRow | undefined;
}

export function verifyPassword(user: UserRow, password: string): boolean {
    return compareSync(password, user.password_hash);
}

// ─── Handles ─────────────────────────────────────────────────────

export function claimHandle(userId: number, handle: string): HandleRow {
    const db = getDb();
    const stmt = db.prepare(
        'INSERT INTO handles (user_id, handle) VALUES (?, ?)'
    );
    const result = stmt.run(userId, handle);
    return db.prepare('SELECT * FROM handles WHERE id = ?').get(result.lastInsertRowid) as HandleRow;
}

export function getHandleByUserId(userId: number): HandleRow | undefined {
    const db = getDb();
    return db.prepare(
        "SELECT * FROM handles WHERE user_id = ? AND status = 'active'"
    ).get(userId) as HandleRow | undefined;
}

export function getHandleByName(handle: string): HandleRow | undefined {
    const db = getDb();
    return db.prepare(
        "SELECT * FROM handles WHERE handle = ? AND status = 'active'"
    ).get(handle) as HandleRow | undefined;
}

// ─── Profile Drafts ──────────────────────────────────────────────

export function saveDraft(
    userId: number,
    canonical: CanonicalProfile,
    visibility: VisibilitySettings,
): ProfileDraftRow {
    const db = getDb();
    const canonicalJson = JSON.stringify(canonical);
    const visibilityJson = JSON.stringify(visibility);
    const now = new Date().toISOString();

    const existing = db.prepare('SELECT id FROM profile_drafts WHERE user_id = ?').get(userId);

    if (existing) {
        db.prepare(
            'UPDATE profile_drafts SET canonical_json = ?, visibility_json = ?, updated_at = ? WHERE user_id = ?'
        ).run(canonicalJson, visibilityJson, now, userId);
    } else {
        db.prepare(
            'INSERT INTO profile_drafts (user_id, canonical_json, visibility_json, updated_at) VALUES (?, ?, ?, ?)'
        ).run(userId, canonicalJson, visibilityJson, now);
    }

    return db.prepare('SELECT * FROM profile_drafts WHERE user_id = ?').get(userId) as ProfileDraftRow;
}

export function getDraft(userId: number): ProfileDraftRow | undefined {
    const db = getDb();
    return db.prepare('SELECT * FROM profile_drafts WHERE user_id = ?').get(userId) as ProfileDraftRow | undefined;
}

export function deleteDraft(userId: number): void {
    const db = getDb();
    db.prepare('DELETE FROM profile_drafts WHERE user_id = ?').run(userId);
}

// ─── Profile Snapshots ───────────────────────────────────────────

export function saveSnapshot(
    handle: string,
    versionId: string,
    publicProfile: PublicProfile,
    jsonLd: object,
    contentHash: string,
): ProfileSnapshotRow {
    const db = getDb();
    const publicJson = JSON.stringify(publicProfile);
    const jsonldJson = JSON.stringify(jsonLd);

    db.prepare(
        `INSERT INTO profile_snapshots (handle, version_id, public_json, jsonld_json, content_hash, schema_version)
     VALUES (?, ?, ?, ?, ?, ?)`
    ).run(handle, versionId, publicJson, jsonldJson, contentHash, publicProfile.schemaVersion);

    return db.prepare(
        'SELECT * FROM profile_snapshots WHERE version_id = ?'
    ).get(versionId) as ProfileSnapshotRow;
}

export function getLatestSnapshot(handle: string): ProfileSnapshotRow | undefined {
    const db = getDb();
    return db.prepare(
        `SELECT * FROM profile_snapshots
     WHERE handle = ? AND is_published = 1
     ORDER BY created_at DESC LIMIT 1`
    ).get(handle) as ProfileSnapshotRow | undefined;
}

export function getAllSnapshots(handle: string): ProfileSnapshotRow[] {
    const db = getDb();
    return db.prepare(
        'SELECT * FROM profile_snapshots WHERE handle = ? ORDER BY created_at DESC'
    ).all(handle) as ProfileSnapshotRow[];
}

export function unpublishSnapshots(handle: string): void {
    const db = getDb();
    db.prepare('UPDATE profile_snapshots SET is_published = 0 WHERE handle = ?').run(handle);
}

export function deleteAllSnapshots(handle: string): void {
    const db = getDb();
    db.prepare('DELETE FROM profile_snapshots WHERE handle = ?').run(handle);
}

// ─── Search Index ────────────────────────────────────────────────

export function updateSearchIndex(handle: string, publicProfile: PublicProfile): void {
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

    const existing = db.prepare('SELECT handle FROM search_index WHERE handle = ?').get(handle);

    if (existing) {
        db.prepare(
            `UPDATE search_index
       SET name = ?, headline = ?, skills = ?, location = ?, organizations = ?, titles = ?, updated_at = ?
       WHERE handle = ?`
        ).run(
            publicProfile.identity.name,
            publicProfile.identity.headline || null,
            skills, location, organizations, titles, now, handle,
        );
    } else {
        db.prepare(
            `INSERT INTO search_index (handle, name, headline, skills, location, organizations, titles, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        ).run(
            handle,
            publicProfile.identity.name,
            publicProfile.identity.headline || null,
            skills, location, organizations, titles, now,
        );
    }
}

export function deleteSearchIndex(handle: string): void {
    const db = getDb();
    db.prepare('DELETE FROM search_index WHERE handle = ?').run(handle);
}

// ─── Sessions ────────────────────────────────────────────────────

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function createSession(userId: number): string {
    const db = getDb();
    const sessionId = randomUUID();
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString();
    db.prepare(
        'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)'
    ).run(sessionId, userId, expiresAt);
    return sessionId;
}

export function getSession(sessionId: string): { userId: number } | null {
    const db = getDb();
    const row = db.prepare(
        "SELECT user_id FROM sessions WHERE id = ? AND expires_at > datetime('now')"
    ).get(sessionId) as { user_id: number } | undefined;
    return row ? { userId: row.user_id } : null;
}

export function deleteSession(sessionId: string): void {
    const db = getDb();
    db.prepare('DELETE FROM sessions WHERE id = ?').run(sessionId);
}

export function deleteUserSessions(userId: number): void {
    const db = getDb();
    db.prepare('DELETE FROM sessions WHERE user_id = ?').run(userId);
}

// ─── Full Profile Delete ─────────────────────────────────────────

export function deleteProfile(userId: number): void {
    const db = getDb();
    const handle = getHandleByUserId(userId);

    const deleteAll = db.transaction(() => {
        if (handle) {
            deleteSearchIndex(handle.handle);
            deleteAllSnapshots(handle.handle);
            db.prepare("UPDATE handles SET status = 'deleted' WHERE user_id = ?").run(userId);
        }
        deleteDraft(userId);
        deleteUserSessions(userId);
        db.prepare('DELETE FROM users WHERE id = ?').run(userId);
    });

    deleteAll();
}
