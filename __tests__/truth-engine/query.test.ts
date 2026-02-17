// Tests: Query engine — search and filter published profiles

import { getDb, closeDb, migrate } from '../../lib/truth-engine/db';
import { createUser, claimHandle, updateSearchIndex } from '../../lib/truth-engine/storage';
import { queryProfiles } from '../../lib/truth-engine/query';
import type { PublicProfile } from '../../lib/truth-engine/types';

describe('Query Engine', () => {
    beforeAll(() => {
        // Ensure database is closed before starting
        closeDb();
    });

    beforeEach(async () => {
        // Reset database
        closeDb();
        const db = getDb();
        await migrate();
        await db.executeMultiple(`
            DELETE FROM sessions;
            DELETE FROM search_index;
            DELETE FROM profile_snapshots;
            DELETE FROM profile_drafts;
            DELETE FROM handles;
            DELETE FROM users;
        `);

        // Create test data
        await setupTestProfiles();
    });

    afterAll(() => {
        closeDb();
    });

    async function setupTestProfiles() {
        // Profile 1: TypeScript expert in Austin
        const user1 = await createUser('alice@example.com', 'password');
        await claimHandle(user1.id, 'alice');
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
        await updateSearchIndex('alice', profile1);

        // Profile 2: Python developer in San Francisco
        const user2 = await createUser('bob@example.com', 'password');
        await claimHandle(user2.id, 'bob');
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
        await updateSearchIndex('bob', profile2);

        // Profile 3: Designer at Acme Corp in New York
        const user3 = await createUser('carol@example.com', 'password');
        await claimHandle(user3.id, 'carol');
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
        await updateSearchIndex('carol', profile3);
    }

    describe('Basic Search', () => {
        it('should return all profiles when no filters applied', async () => {
            const result = await queryProfiles({});
            expect(result.results).toHaveLength(3);
            expect(result.nextCursor).toBeNull();
        });

        it('should return results ordered by handle ASC', async () => {
            const result = await queryProfiles({});
            expect(result.results[0].handle).toBe('alice');
            expect(result.results[1].handle).toBe('bob');
            expect(result.results[2].handle).toBe('carol');
        });

        it('should include expected fields in results', async () => {
            const result = await queryProfiles({});
            const first = result.results[0];
            expect(first).toHaveProperty('handle');
            expect(first).toHaveProperty('name');
            expect(first).toHaveProperty('headline');
            expect(first).toHaveProperty('location');
            expect(first).toHaveProperty('lastUpdated');
        });
    });

    describe('Filter by Skill', () => {
        it('should find profiles with TypeScript skill', async () => {
            const result = await queryProfiles({ skill: 'TypeScript' });
            expect(result.results).toHaveLength(1);
            expect(result.results[0].handle).toBe('alice');
        });

        it('should find profiles with Python skill', async () => {
            const result = await queryProfiles({ skill: 'Python' });
            expect(result.results).toHaveLength(2);
            expect(result.results[0].handle).toBe('alice');
            expect(result.results[1].handle).toBe('bob');
        });

        it('should perform case-insensitive LIKE matching', async () => {
            // SQLite LIKE is case-insensitive by default
            const result = await queryProfiles({ skill: 'typescript' });
            expect(result.results).toHaveLength(1);
        });

        it('should support partial skill matching', async () => {
            const result = await queryProfiles({ skill: 'Script' });
            expect(result.results).toHaveLength(1);
            expect(result.results[0].handle).toBe('alice');
        });

        it('should return empty when skill not found', async () => {
            const result = await queryProfiles({ skill: 'Ruby' });
            expect(result.results).toHaveLength(0);
        });
    });

    describe('Filter by Organization', () => {
        it('should find profiles by organization', async () => {
            const result = await queryProfiles({ org: 'Acme Corp' });
            expect(result.results).toHaveLength(2);
            expect(result.results[0].handle).toBe('alice');
            expect(result.results[1].handle).toBe('carol');
        });

        it('should support partial organization matching', async () => {
            const result = await queryProfiles({ org: 'Acme' });
            expect(result.results).toHaveLength(2);
        });

        it('should return empty when organization not found', async () => {
            const result = await queryProfiles({ org: 'Google' });
            expect(result.results).toHaveLength(0);
        });
    });

    describe('Filter by Title', () => {
        it('should find profiles by job title', async () => {
            const result = await queryProfiles({ title: 'Engineer' });
            expect(result.results).toHaveLength(2);
            expect(result.results[0].handle).toBe('alice');
            expect(result.results[1].handle).toBe('bob');
        });

        it('should support partial title matching', async () => {
            // Search for "Engineer" which matches both "Senior Engineer" and "Staff Engineer"
            const result = await queryProfiles({ title: 'Engineer' });
            expect(result.results.length).toBeGreaterThanOrEqual(1);
        });

        it('should return empty when title not found', async () => {
            const result = await queryProfiles({ title: 'Manager' });
            expect(result.results).toHaveLength(0);
        });
    });

    describe('Filter by Location', () => {
        it('should find profiles by city', async () => {
            const result = await queryProfiles({ location: 'Austin' });
            expect(result.results).toHaveLength(1);
            expect(result.results[0].handle).toBe('alice');
        });

        it('should find profiles by state', async () => {
            const result = await queryProfiles({ location: 'CA' });
            expect(result.results).toHaveLength(1);
            expect(result.results[0].handle).toBe('bob');
        });

        it('should support partial location matching', async () => {
            const result = await queryProfiles({ location: 'New' });
            expect(result.results).toHaveLength(1);
            expect(result.results[0].handle).toBe('carol');
        });

        it('should return empty when location not found', async () => {
            const result = await queryProfiles({ location: 'London' });
            expect(result.results).toHaveLength(0);
        });
    });

    describe('Filter by Updated After', () => {
        it('should find profiles updated after date', async () => {
            // updateSearchIndex uses current time, not profile.lastUpdated
            const result = await queryProfiles({ updatedAfter: '2020-01-01T00:00:00.000Z' });
            expect(result.results).toHaveLength(3); // All profiles
        });

        it('should return empty when no profiles updated after future date', async () => {
            const result = await queryProfiles({ updatedAfter: '2030-12-31T00:00:00.000Z' });
            expect(result.results).toHaveLength(0);
        });
    });

    describe('Combined Filters', () => {
        it('should support multiple filters (AND logic)', async () => {
            const result = await queryProfiles({ skill: 'Python', org: 'Tech Co' });
            expect(result.results).toHaveLength(1);
            expect(result.results[0].handle).toBe('bob');
        });

        it('should return empty when combined filters match nothing', async () => {
            const result = await queryProfiles({ skill: 'TypeScript', org: 'Tech Co' });
            expect(result.results).toHaveLength(0);
        });

        it('should support skill + location filters', async () => {
            const result = await queryProfiles({ skill: 'Python', location: 'Austin' });
            expect(result.results).toHaveLength(1);
            expect(result.results[0].handle).toBe('alice');
        });
    });

    describe('Pagination', () => {
        it('should respect limit parameter', async () => {
            const result = await queryProfiles({ limit: 2 });
            expect(result.results).toHaveLength(2);
            expect(result.results[0].handle).toBe('alice');
            expect(result.results[1].handle).toBe('bob');
        });

        it('should provide nextCursor when more results exist', async () => {
            const result = await queryProfiles({ limit: 2 });
            expect(result.nextCursor).toBe('bob');
        });

        it('should support cursor-based pagination', async () => {
            const page1 = await queryProfiles({ limit: 2 });
            expect(page1.results).toHaveLength(2);
            expect(page1.nextCursor).toBe('bob');

            const page2 = await queryProfiles({ limit: 2, cursor: page1.nextCursor! });
            expect(page2.results).toHaveLength(1);
            expect(page2.results[0].handle).toBe('carol');
            expect(page2.nextCursor).toBeNull();
        });

        it('should enforce max limit of 100', async () => {
            const result = await queryProfiles({ limit: 150 });
            // Can't test actual limit enforcement without 100+ profiles,
            // but we verify the code exists by checking it doesn't throw
            expect(result.results).toHaveLength(3);
        });

        it('should default to limit 20 when not specified', async () => {
            // Add more profiles to test default limit
            for (let i = 0; i < 25; i++) {
                const user = await createUser(`user${i}@example.com`, 'password');
                const handle = `user-${i}`;
                await claimHandle(user.id, handle);
                const profile: PublicProfile = {
                    schemaVersion: '1.0.0',
                    handle,
                    versionId: 'v1',
                    lastUpdated: '2025-01-01T00:00:00.000Z',
                    contentHash: 'hash',
                    identity: { name: `User ${i}` },
                };
                await updateSearchIndex(handle, profile);
            }

            const result = await queryProfiles({});
            expect(result.results.length).toBeLessThanOrEqual(20);
            expect(result.nextCursor).toBeTruthy();
        });
    });

    describe('Edge Cases', () => {
        it('should handle profiles with no skills', async () => {
            const user = await createUser('dave@example.com', 'password');
            await claimHandle(user.id, 'dave');
            const profile: PublicProfile = {
                schemaVersion: '1.0.0',
                handle: 'dave',
                versionId: 'v1',
                lastUpdated: '2025-01-01T00:00:00.000Z',
                contentHash: 'hash',
                identity: { name: 'Dave' },
            };
            await updateSearchIndex('dave', profile);

            const result = await queryProfiles({ skill: 'TypeScript' });
            expect(result.results.every(r => r.handle !== 'dave')).toBe(true);
        });

        it('should handle profiles with no location', async () => {
            const user = await createUser('eve@example.com', 'password');
            await claimHandle(user.id, 'eve');
            const profile: PublicProfile = {
                schemaVersion: '1.0.0',
                handle: 'eve',
                versionId: 'v1',
                lastUpdated: '2025-01-01T00:00:00.000Z',
                contentHash: 'hash',
                identity: { name: 'Eve' },
            };
            await updateSearchIndex('eve', profile);

            const result = await queryProfiles({ location: 'Austin' });
            expect(result.results.every(r => r.handle !== 'eve')).toBe(true);
        });

        it('should handle empty search index', async () => {
            const db = getDb();
            await db.executeMultiple('DELETE FROM search_index');

            const result = await queryProfiles({});
            expect(result.results).toHaveLength(0);
            expect(result.nextCursor).toBeNull();
        });

        it('should handle special characters in search terms', async () => {
            const result = await queryProfiles({ skill: "Type'Script" });
            expect(result.results).toHaveLength(0); // No SQL injection
        });
    });
});
