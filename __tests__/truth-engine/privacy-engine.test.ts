// Tests: Privacy Engine — canonical → public transformation
// Asserts PII can never leak through the privacy boundary

import { derivePublicProfile } from '../../lib/truth-engine/privacy-engine';
import type { CanonicalProfile, VisibilitySettings } from '../../lib/truth-engine/types';
import { DEFAULT_VISIBILITY } from '../../lib/truth-engine/types';

const SAMPLE_CANONICAL: CanonicalProfile = {
    schemaVersion: '1.0.0',
    handle: 'test-user',
    identity: {
        name: 'Test User',
        headline: 'Software Engineer',
        summary: 'A test user profile',
        image: 'https://example.com/photo.jpg',
        location: { city: 'Austin', region: 'TX', country: 'US' },
        dateOfBirth: '1990-01-15', // PII — MUST be stripped
    },
    links: {
        website: 'https://example.com',
        sameAs: ['https://github.com/testuser', 'https://linkedin.com/in/testuser'],
    },
    contact: {
        phone: '555-123-4567', // PII — MUST be stripped by default
        emails: [
            { email: 'public@example.com', type: 'public' },
            { email: 'personal@gmail.com', type: 'personal' }, // PII — MUST be stripped
        ],
    },
    address: {
        street1: '123 Main St', // PII — entire section MUST be stripped
        city: 'Austin',
        region: 'TX',
        postalCode: '78701',
        country: 'US',
    },
    experience: [
        {
            organization: 'Acme Corp',
            title: 'Senior Engineer',
            startDate: '2022-01-01',
            isCurrent: true,
            highlights: ['Led team of 5', 'Shipped 3 products'],
            tags: ['leadership', 'engineering'],
            privateNotes: 'Salary: $150k — NOT for public', // MUST be stripped
        },
    ],
    education: [
        {
            institution: 'UT Austin',
            degree: 'B.S.',
            program: 'Computer Science',
            startDate: '2008-08-01',
            endDate: '2012-05-15',
            status: 'completed',
        },
    ],
    skills: [
        { category: 'Languages', items: ['TypeScript', 'Python', 'Rust'] },
        { category: 'Frameworks', items: ['React', 'Next.js'] },
    ],
    projects: [
        {
            name: 'My Project',
            description: 'A cool project',
            tech: ['TypeScript', 'Node.js'],
            url: 'https://myproject.com',
            repoUrl: 'https://github.com/test/project',
            privateNotes: 'Revenue: $10k/mo — NOT for public', // MUST be stripped
        },
    ],
};

describe('Privacy Engine', () => {
    const versionId = 'test-version-id';
    const contentHash = 'test-hash';
    const publishedAt = '2025-01-01T00:00:00.000Z';

    describe('PII Redaction (hard-private fields)', () => {
        it('should NEVER include dateOfBirth in public profile', () => {
            const pub = derivePublicProfile(SAMPLE_CANONICAL, DEFAULT_VISIBILITY, versionId, contentHash, publishedAt);
            expect(JSON.stringify(pub)).not.toContain('dateOfBirth');
            expect(JSON.stringify(pub)).not.toContain('1990-01-15');
        });

        it('should NEVER include address section in public profile', () => {
            const pub = derivePublicProfile(SAMPLE_CANONICAL, DEFAULT_VISIBILITY, versionId, contentHash, publishedAt);
            expect(JSON.stringify(pub)).not.toContain('street1');
            expect(JSON.stringify(pub)).not.toContain('123 Main St');
            expect(JSON.stringify(pub)).not.toContain('postalCode');
            expect(JSON.stringify(pub)).not.toContain('78701');
        });

        it('should NEVER include privateNotes from experience', () => {
            const visibility: VisibilitySettings = {
                ...DEFAULT_VISIBILITY,
                sections: { ...DEFAULT_VISIBILITY.sections, experience: 'public' },
            };
            const pub = derivePublicProfile(SAMPLE_CANONICAL, visibility, versionId, contentHash, publishedAt);
            expect(JSON.stringify(pub)).not.toContain('privateNotes');
            expect(JSON.stringify(pub)).not.toContain('Salary');
            expect(JSON.stringify(pub)).not.toContain('$150k');
        });

        it('should NEVER include privateNotes from projects', () => {
            const visibility: VisibilitySettings = {
                ...DEFAULT_VISIBILITY,
                sections: { ...DEFAULT_VISIBILITY.sections, projects: 'public' },
            };
            const pub = derivePublicProfile(SAMPLE_CANONICAL, visibility, versionId, contentHash, publishedAt);
            expect(JSON.stringify(pub)).not.toContain('Revenue');
            expect(JSON.stringify(pub)).not.toContain('$10k/mo');
        });

        it('should NEVER include personal emails in public profile', () => {
            const visibility: VisibilitySettings = {
                ...DEFAULT_VISIBILITY,
                sections: { ...DEFAULT_VISIBILITY.sections, contact: 'public' },
                overrides: { '/contact/emails': 'public', '/contact/phone': 'private' },
            };
            const pub = derivePublicProfile(SAMPLE_CANONICAL, visibility, versionId, contentHash, publishedAt);
            expect(JSON.stringify(pub)).not.toContain('personal@gmail.com');
            // Public email SHOULD be included
            expect(pub.contact?.publicEmail).toBe('public@example.com');
        });
    });

    describe('Visibility Settings', () => {
        it('should omit entire section when visibility is private', () => {
            const visibility: VisibilitySettings = {
                sections: {
                    identity: 'public',
                    links: 'private',
                    experience: 'private',
                    education: 'private',
                    skills: 'private',
                    projects: 'private',
                    contact: 'private',
                },
                overrides: {},
            };
            const pub = derivePublicProfile(SAMPLE_CANONICAL, visibility, versionId, contentHash, publishedAt);
            expect(pub.links).toBeUndefined();
            expect(pub.experience).toBeUndefined();
            expect(pub.education).toBeUndefined();
            expect(pub.skills).toBeUndefined();
            expect(pub.projects).toBeUndefined();
            expect(pub.contact).toBeUndefined();
        });

        it('should include sections when visibility is public', () => {
            const visibility: VisibilitySettings = {
                sections: {
                    identity: 'public',
                    links: 'public',
                    experience: 'public',
                    education: 'public',
                    skills: 'public',
                    projects: 'public',
                    contact: 'private',
                },
                overrides: {},
            };
            const pub = derivePublicProfile(SAMPLE_CANONICAL, visibility, versionId, contentHash, publishedAt);
            expect(pub.links).toBeDefined();
            expect(pub.experience).toBeDefined();
            expect(pub.education).toBeDefined();
            expect(pub.skills).toBeDefined();
            expect(pub.projects).toBeDefined();
        });

        it('should not include phone unless explicitly overridden to public', () => {
            const visibility: VisibilitySettings = {
                ...DEFAULT_VISIBILITY,
                sections: { ...DEFAULT_VISIBILITY.sections, contact: 'public' },
                overrides: { '/contact/emails': 'public', '/contact/phone': 'private' },
            };
            const pub = derivePublicProfile(SAMPLE_CANONICAL, visibility, versionId, contentHash, publishedAt);
            expect(pub.contact?.phone).toBeUndefined();
        });

        it('should include phone when explicitly overridden to public', () => {
            const visibility: VisibilitySettings = {
                ...DEFAULT_VISIBILITY,
                sections: { ...DEFAULT_VISIBILITY.sections, contact: 'public' },
                overrides: { '/contact/emails': 'public', '/contact/phone': 'public' },
            };
            const pub = derivePublicProfile(SAMPLE_CANONICAL, visibility, versionId, contentHash, publishedAt);
            expect(pub.contact?.phone).toBe('555-123-4567');
        });
    });

    describe('Public Profile Structure', () => {
        it('should always include name even when identity is private', () => {
            const visibility: VisibilitySettings = {
                ...DEFAULT_VISIBILITY,
                sections: { ...DEFAULT_VISIBILITY.sections, identity: 'private' },
            };
            const pub = derivePublicProfile(SAMPLE_CANONICAL, visibility, versionId, contentHash, publishedAt);
            expect(pub.identity.name).toBe('Test User');
        });

        it('should include version metadata', () => {
            const pub = derivePublicProfile(SAMPLE_CANONICAL, DEFAULT_VISIBILITY, versionId, contentHash, publishedAt);
            expect(pub.schemaVersion).toBe('1.0.0');
            expect(pub.handle).toBe('test-user');
            expect(pub.versionId).toBe(versionId);
            expect(pub.lastUpdated).toBe(publishedAt);
        });
    });
});
