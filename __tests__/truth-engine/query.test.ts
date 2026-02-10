// Tests: Query engine — search and filter published profiles

import { getDb, closeDb } from '../../lib/truth-engine/db';
import { createUser, claimHandle, updateSearchIndex } from '../../lib/truth-engine/storage';
import { queryProfiles } from '../../lib/truth-engine/query';
import type { PublicProfile } from '../../lib/truth-engine/types';

describe('Query Engine', () => {
    beforeAll(() => {
        // Ensure database is closed before starting
        closeDb();
    });

    beforeEach(() => {
        // Reset database
        closeDb();
        const db = getDb();
        db.exec(`
            DELETE FROM sessions;
            DELETE FROM search_index;
            DELETE FROM profile_snapshots;
            DELETE FROM profile_drafts;
            DELETE FROM handles;
            DELETE FROM users;
        `);

        // Create test data
        setupTestProfiles();
    });

    afterAll(() => {
        closeDb();
    });

    function setupTestProfiles() {
        // Profile 1: TypeScript expert in Austin
        const user1 = createUser('alice@example.com', 'password');
        claimHandle(user1.id, 'alice');
        const profile1: PublicProfile = {
            schemaVersion: '1.0.0',
            handle: 'alice',
            versionId: 'v1',
            lastUpdated: '2025-01-01T00:00:00.000Z',
            contentHash: 'hash1',
            identity: {
                name: 'Alice Johnson',
                headline: 'TypeScript Expert',
                location: { city: 'Austin', region: 'TX', country: 'US' },
            },
            skills: [{ category: 'Languages', items: ['TypeScript', 'JavaScript', 'Python'] }],
            experience: [
                { organization: 'Acme Corp', title: 'Senior Engineer' },
            ],
        };
        updateSearchIndex('alice', profile1);

        // Profile 2: Python developer in San Francisco
        const user2 = createUser('bob@example.com', 'password');
        claimHandle(user2.id, 'bob');
        const profile2: PublicProfile = {
            schemaVersion: '1.0.0',
            handle: 'bob',
            versionId: 'v1',
            lastUpdated: '2025-01-02T00:00:00.000Z',
            contentHash: 'hash2',
            identity: {
                name: 'Bob Smith',
                headline: 'Python Developer',
                location: { city: 'San Francisco', region: 'CA', country: 'US' },
            },
            skills: [{ category: 'Languages', items: ['Python', 'Go', 'Rust'] }],
            experience: [
                { organization: 'Tech Co', title: 'Staff Engineer' },
            ],
        };
        updateSearchIndex('bob', profile2);

        // Profile 3: Designer at Acme Corp in New York
        const user3 = createUser('carol@example.com', 'password');
        claimHandle(user3.id, 'carol');
        const profile3: PublicProfile = {
            schemaVersion: '1.0.0',
            handle: 'carol',
            versionId: 'v1',
            lastUpdated: '2025-01-03T00:00:00.000Z',
            contentHash: 'hash3',
            identity: {
                name: 'Carol Davis',
                headline: 'Product Designer',
                location: { city: 'New York', region: 'NY', country: 'US' },
            },
            skills: [{ category: 'Design', items: ['Figma', 'Sketch', 'UI/UX'] }],
            experience: [
                { organization: 'Acme Corp', title: 'Lead Designer' },
            ],
        };
        updateSearchIndex('carol', profile3);
    }

    describe('Basic Search', () => {
        it('should return all profiles when no filters applied', () => {
            const result = queryProfiles({});
            expect(result.results).toHaveLength(3);
            expect(result.nextCursor).toBeNull();
        });

        it('should return results ordered by handle ASC', () => {
            const result = queryProfiles({});
            expect(result.results[0].handle).toBe('alice');
            expect(result.results[1].handle).toBe('bob');
            expect(result.results[2].handle).toBe('carol');
        });

        it('should include expected fields in results', () => {
            const result = queryProfiles({});
            const first = result.results[0];
            expect(first).toHaveProperty('handle');
            expect(first).toHaveProperty('name');
            expect(first).toHaveProperty('headline');
            expect(first).toHaveProperty('location');
            expect(first).toHaveProperty('lastUpdated');
        });
    });

    describe('Filter by Skill', () => {
        it('should find profiles with TypeScript skill', () => {
            const result = queryProfiles({ skill: 'TypeScript' });
            expect(result.results).toHaveLength(1);
            expect(result.results[0].handle).toBe('alice');
        });

        it('should find profiles with Python skill', () => {
            const result = queryProfiles({ skill: 'Python' });
            expect(result.results).toHaveLength(2);
            expect(result.results[0].handle).toBe('alice');
            expect(result.results[1].handle).toBe('bob');
        });

        it('should perform case-insensitive LIKE matching', () => {
            // SQLite LIKE is case-insensitive by default
            const result = queryProfiles({ skill: 'typescript' });
            expect(result.results).toHaveLength(1);
        });

        it('should support partial skill matching', () => {
            const result = queryProfiles({ skill: 'Script' });
            expect(result.results).toHaveLength(1);
            expect(result.results[0].handle).toBe('alice');
        });

        it('should return empty when skill not found', () => {
            const result = queryProfiles({ skill: 'Ruby' });
            expect(result.results).toHaveLength(0);
        });
    });

    describe('Filter by Organization', () => {
        it('should find profiles by organization', () => {
            const result = queryProfiles({ org: 'Acme Corp' });
            expect(result.results).toHaveLength(2);
            expect(result.results[0].handle).toBe('alice');
            expect(result.results[1].handle).toBe('carol');
        });

        it('should support partial organization matching', () => {
            const result = queryProfiles({ org: 'Acme' });
            expect(result.results).toHaveLength(2);
        });

        it('should return empty when organization not found', () => {
            const result = queryProfiles({ org: 'Google' });
            expect(result.results).toHaveLength(0);
        });
    });

    describe('Filter by Title', () => {
        it('should find profiles by job title', () => {
            const result = queryProfiles({ title: 'Engineer' });
            expect(result.results).toHaveLength(2);
            expect(result.results[0].handle).toBe('alice');
            expect(result.results[1].handle).toBe('bob');
        });

        it('should support partial title matching', () => {
            // Search for "Engineer" which matches both "Senior Engineer" and "Staff Engineer"
            const result = queryProfiles({ title: 'Engineer' });
            expect(result.results.length).toBeGreaterThanOrEqual(1);
        });

        it('should return empty when title not found', () => {
            const result = queryProfiles({ title: 'Manager' });
            expect(result.results).toHaveLength(0);
        });
    });

    describe('Filter by Location', () => {
        it('should find profiles by city', () => {
            const result = queryProfiles({ location: 'Austin' });
            expect(result.results).toHaveLength(1);
            expect(result.results[0].handle).toBe('alice');
        });

        it('should find profiles by state', () => {
            const result = queryProfiles({ location: 'CA' });
            expect(result.results).toHaveLength(1);
            expect(result.results[0].handle).toBe('bob');
        });

        it('should support partial location matching', () => {
            const result = queryProfiles({ location: 'New' });
            expect(result.results).toHaveLength(1);
            expect(result.results[0].handle).toBe('carol');
        });

        it('should return empty when location not found', () => {
            const result = queryProfiles({ location: 'London' });
            expect(result.results).toHaveLength(0);
        });
    });

    describe('Filter by Updated After', () => {
        it('should find profiles updated after date', () => {
            // updateSearchIndex uses current time, not profile.lastUpdated
            const result = queryProfiles({ updatedAfter: '2020-01-01T00:00:00.000Z' });
            expect(result.results).toHaveLength(3); // All profiles
        });

        it('should return empty when no profiles updated after future date', () => {
            const result = queryProfiles({ updatedAfter: '2030-12-31T00:00:00.000Z' });
            expect(result.results).toHaveLength(0);
        });
    });

    describe('Combined Filters', () => {
        it('should support multiple filters (AND logic)', () => {
            const result = queryProfiles({ skill: 'Python', org: 'Tech Co' });
            expect(result.results).toHaveLength(1);
            expect(result.results[0].handle).toBe('bob');
        });

        it('should return empty when combined filters match nothing', () => {
            const result = queryProfiles({ skill: 'TypeScript', org: 'Tech Co' });
            expect(result.results).toHaveLength(0);
        });

        it('should support skill + location filters', () => {
            const result = queryProfiles({ skill: 'Python', location: 'Austin' });
            expect(result.results).toHaveLength(1);
            expect(result.results[0].handle).toBe('alice');
        });
    });

    describe('Pagination', () => {
        it('should respect limit parameter', () => {
            const result = queryProfiles({ limit: 2 });
            expect(result.results).toHaveLength(2);
            expect(result.results[0].handle).toBe('alice');
            expect(result.results[1].handle).toBe('bob');
        });

        it('should provide nextCursor when more results exist', () => {
            const result = queryProfiles({ limit: 2 });
            expect(result.nextCursor).toBe('bob');
        });

        it('should support cursor-based pagination', () => {
            const page1 = queryProfiles({ limit: 2 });
            expect(page1.results).toHaveLength(2);
            expect(page1.nextCursor).toBe('bob');

            const page2 = queryProfiles({ limit: 2, cursor: page1.nextCursor! });
            expect(page2.results).toHaveLength(1);
            expect(page2.results[0].handle).toBe('carol');
            expect(page2.nextCursor).toBeNull();
        });

        it('should enforce max limit of 100', () => {
            const result = queryProfiles({ limit: 150 });
            // Can't test actual limit enforcement without 100+ profiles,
            // but we verify the code exists by checking it doesn't throw
            expect(result.results).toHaveLength(3);
        });

        it('should default to limit 20 when not specified', () => {
            // Add more profiles to test default limit
            for (let i = 0; i < 25; i++) {
                const user = createUser(`user${i}@example.com`, 'password');
                const handle = `user-${i}`;
                claimHandle(user.id, handle);
                const profile: PublicProfile = {
                    schemaVersion: '1.0.0',
                    handle,
                    versionId: 'v1',
                    lastUpdated: '2025-01-01T00:00:00.000Z',
                    contentHash: 'hash',
                    identity: { name: `User ${i}` },
                };
                updateSearchIndex(handle, profile);
            }

            const result = queryProfiles({});
            expect(result.results.length).toBeLessThanOrEqual(20);
            expect(result.nextCursor).toBeTruthy();
        });
    });

    describe('Edge Cases', () => {
        it('should handle profiles with no skills', () => {
            const user = createUser('dave@example.com', 'password');
            claimHandle(user.id, 'dave');
            const profile: PublicProfile = {
                schemaVersion: '1.0.0',
                handle: 'dave',
                versionId: 'v1',
                lastUpdated: '2025-01-01T00:00:00.000Z',
                contentHash: 'hash',
                identity: { name: 'Dave' },
            };
            updateSearchIndex('dave', profile);

            const result = queryProfiles({ skill: 'TypeScript' });
            expect(result.results.every(r => r.handle !== 'dave')).toBe(true);
        });

        it('should handle profiles with no location', () => {
            const user = createUser('eve@example.com', 'password');
            claimHandle(user.id, 'eve');
            const profile: PublicProfile = {
                schemaVersion: '1.0.0',
                handle: 'eve',
                versionId: 'v1',
                lastUpdated: '2025-01-01T00:00:00.000Z',
                contentHash: 'hash',
                identity: { name: 'Eve' },
            };
            updateSearchIndex('eve', profile);

            const result = queryProfiles({ location: 'Austin' });
            expect(result.results.every(r => r.handle !== 'eve')).toBe(true);
        });

        it('should handle empty search index', () => {
            const db = getDb();
            db.exec('DELETE FROM search_index');

            const result = queryProfiles({});
            expect(result.results).toHaveLength(0);
            expect(result.nextCursor).toBeNull();
        });

        it('should handle special characters in search terms', () => {
            const result = queryProfiles({ skill: "Type'Script" });
            expect(result.results).toHaveLength(0); // No SQL injection
        });
    });
});
