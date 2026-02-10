// Truth Engine — Snapshot utilities: versioning, hashing, UUID
import { createHash, randomUUID } from 'crypto';
import type { PublicProfile, SnapshotHeader } from './types';

/**
 * Generate a new UUID v4 for a snapshot version.
 */
export function generateVersionId(): string {
    return randomUUID();
}

/**
 * Compute a SHA-256 content hash from a public profile.
 * Uses stable JSON serialization (deep key sorting) for deterministic hashing.
 */
export function computeContentHash(publicProfile: PublicProfile): string {
    const canonical = JSON.stringify(sortDeep(publicProfile));
    return createHash('sha256').update(canonical, 'utf8').digest('hex');
}

/**
 * Recursively sort object keys for canonical JSON.
 */
function sortDeep(obj: unknown): unknown {
    if (Array.isArray(obj)) return obj.map(sortDeep);
    if (obj !== null && typeof obj === 'object') {
        const sorted: Record<string, unknown> = {};
        for (const key of Object.keys(obj as Record<string, unknown>).sort()) {
            sorted[key] = sortDeep((obj as Record<string, unknown>)[key]);
        }
        return sorted;
    }
    return obj;
}

/**
 * Get the current ISO-8601 timestamp.
 */
export function now(): string {
    return new Date().toISOString();
}

/**
 * Build a snapshot header from profile metadata.
 */
export function buildSnapshotHeader(
    versionId: string,
    publishedAt: string,
    contentHash: string,
): SnapshotHeader {
    return { versionId, publishedAt, contentHash };
}
