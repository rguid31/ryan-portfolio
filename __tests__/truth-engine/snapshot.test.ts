// Tests: Snapshot utilities — versioning, hashing, UUIDs

import { generateVersionId, computeContentHash, now } from '../../lib/truth-engine/snapshot';
import type { PublicProfile } from '../../lib/truth-engine/types';

describe('Snapshot Utilities', () => {
    describe('generateVersionId', () => {
        it('should generate a valid UUID', () => {
            const id = generateVersionId();
            expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
        });

        it('should generate unique IDs', () => {
            const ids = new Set(Array.from({ length: 100 }, () => generateVersionId()));
            expect(ids.size).toBe(100);
        });
    });

    describe('computeContentHash', () => {
        const profile: PublicProfile = {
            schemaVersion: '1.0.0',
            handle: 'test',
            versionId: 'test-id',
            lastUpdated: '2025-01-01T00:00:00.000Z',
            contentHash: '',
            identity: { name: 'Test' },
        };

        it('should return a 64-char hex string (SHA-256)', () => {
            const hash = computeContentHash(profile);
            expect(hash).toMatch(/^[a-f0-9]{64}$/);
        });

        it('should be deterministic (same input → same hash)', () => {
            const hash1 = computeContentHash(profile);
            const hash2 = computeContentHash(profile);
            expect(hash1).toBe(hash2);
        });

        it('should change when content changes', () => {
            const hash1 = computeContentHash(profile);
            const modified = { ...profile, identity: { name: 'Different' } };
            const hash2 = computeContentHash(modified);
            expect(hash1).not.toBe(hash2);
        });
    });

    describe('now', () => {
        it('should return a valid ISO-8601 timestamp', () => {
            const ts = now();
            expect(new Date(ts).toISOString()).toBe(ts);
        });
    });
});
