// Schema Validator tests
import { validateCanonicalProfile, validatePublicProfile } from '../../lib/truth-engine/schema-validator';

describe('validateCanonicalProfile', () => {
    const validCanonical = {
        schemaVersion: '1.0.0',
        handle: 'test-user',
        identity: { name: 'Test User' },
    };

    it('accepts a minimal valid canonical profile', () => {
        const result = validateCanonicalProfile(validCanonical);
        expect(result.isValid).toBe(true);
        expect(result.fields).toHaveLength(0);
    });

    it('accepts a full canonical profile', () => {
        const full = {
            ...validCanonical,
            identity: {
                name: 'Test User',
                headline: 'Software Engineer',
                summary: 'Experienced developer',
                image: 'https://example.com/photo.jpg',
                location: { city: 'Austin', region: 'TX', country: 'US' },
                dateOfBirth: '1990-01-01',
            },
            links: {
                website: 'https://example.com',
                sameAs: ['https://linkedin.com/in/test', 'https://github.com/test'],
            },
            contact: {
                phone: '555-1234',
                emails: [
                    { email: 'public@example.com', type: 'public' },
                    { email: 'personal@example.com', type: 'personal' },
                ],
            },
            experience: [
                {
                    organization: 'Acme Corp',
                    title: 'Engineer',
                    startDate: '2020-01-01',
                    isCurrent: true,
                    highlights: ['Did something great'],
                    tags: ['engineering'],
                },
            ],
            education: [
                {
                    institution: 'MIT',
                    degree: 'BS',
                    program: 'Computer Science',
                    startDate: '2016-09-01',
                    endDate: '2020-05-15',
                    status: 'completed',
                },
            ],
            skills: [
                { category: 'Languages', items: ['TypeScript', 'Python'] },
            ],
            projects: [
                {
                    name: 'My Project',
                    description: 'A cool project',
                    tech: ['React', 'Node.js'],
                    url: 'https://example.com/project',
                    repoUrl: 'https://github.com/test/project',
                },
            ],
        };
        const result = validateCanonicalProfile(full);
        expect(result.isValid).toBe(true);
    });

    it('rejects when schemaVersion is missing', () => {
        const result = validateCanonicalProfile({
            handle: 'test',
            identity: { name: 'Test' },
        });
        expect(result.isValid).toBe(false);
        expect(result.fields.length).toBeGreaterThan(0);
    });

    it('rejects when handle is missing', () => {
        const result = validateCanonicalProfile({
            schemaVersion: '1.0.0',
            identity: { name: 'Test' },
        });
        expect(result.isValid).toBe(false);
    });

    it('rejects when identity.name is missing', () => {
        const result = validateCanonicalProfile({
            schemaVersion: '1.0.0',
            handle: 'test',
            identity: {},
        });
        expect(result.isValid).toBe(false);
    });

    it('rejects an invalid handle format', () => {
        const result = validateCanonicalProfile({
            schemaVersion: '1.0.0',
            handle: 'AB', // too short and uppercase
            identity: { name: 'Test' },
        });
        expect(result.isValid).toBe(false);
    });

    it('rejects additional properties', () => {
        const result = validateCanonicalProfile({
            ...validCanonical,
            extraField: 'not allowed',
        });
        expect(result.isValid).toBe(false);
    });

    it('rejects invalid email format', () => {
        const result = validateCanonicalProfile({
            ...validCanonical,
            contact: {
                emails: [{ email: 'not-an-email', type: 'public' }],
            },
        });
        expect(result.isValid).toBe(false);
    });

    it('rejects invalid URL format', () => {
        const result = validateCanonicalProfile({
            ...validCanonical,
            links: { website: 'not-a-url' },
        });
        expect(result.isValid).toBe(false);
    });
});

describe('validatePublicProfile', () => {
    const validPublic = {
        schemaVersion: '1.0.0',
        handle: 'test-user',
        versionId: '550e8400-e29b-41d4-a716-446655440000',
        lastUpdated: '2024-01-01T00:00:00.000Z',
        contentHash: 'a'.repeat(64), // 64-char hex string
        identity: { name: 'Test User' },
    };

    it('accepts a valid minimal public profile', () => {
        const result = validatePublicProfile(validPublic);
        expect(result.isValid).toBe(true);
    });

    it('rejects when versionId is missing', () => {
        const { versionId: _, ...incomplete } = validPublic;
        const result = validatePublicProfile(incomplete);
        expect(result.isValid).toBe(false);
    });

    it('accepts when contentHash is missing (it is optional)', () => {
        const { contentHash: _, ...withoutHash } = validPublic;
        const result = validatePublicProfile(withoutHash);
        expect(result.isValid).toBe(true);
    });

    it('rejects when contentHash has wrong format', () => {
        const result = validatePublicProfile({
            ...validPublic,
            contentHash: 'not-a-valid-hash',
        });
        expect(result.isValid).toBe(false);
    });
});
