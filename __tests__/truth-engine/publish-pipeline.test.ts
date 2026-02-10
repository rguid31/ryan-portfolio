// Publish Pipeline integration tests
// Tests the full flow: draft → validate → derive public → hash → snapshot → JSON-LD

import { derivePublicProfile } from '../../lib/truth-engine/privacy-engine';
import { generateJsonLd } from '../../lib/truth-engine/jsonld-generator';
import { generateVersionId, computeContentHash, now } from '../../lib/truth-engine/snapshot';
import { validateCanonicalProfile, validatePublicProfile } from '../../lib/truth-engine/schema-validator';
import type { CanonicalProfile, VisibilitySettings } from '../../lib/truth-engine/types';

const CANONICAL_FIXTURE: CanonicalProfile = {
    schemaVersion: '1.0.0',
    handle: 'jane-doe',
    identity: {
        name: 'Jane Doe',
        headline: 'Full Stack Developer',
        summary: 'I build things for the web.',
        image: 'https://example.com/jane.jpg',
        location: { city: 'Austin', region: 'TX', country: 'US' },
        dateOfBirth: '1995-03-15',
    },
    links: {
        website: 'https://janedoe.dev',
        sameAs: ['https://github.com/janedoe', 'https://linkedin.com/in/janedoe'],
    },
    contact: {
        phone: '555-9876',
        emails: [
            { email: 'public@janedoe.dev', type: 'public' },
            { email: 'personal@gmail.com', type: 'personal' },
        ],
    },
    address: {
        street1: '123 Main St',
        city: 'Austin',
        region: 'TX',
        postalCode: '78701',
        country: 'US',
    },
    experience: [
        {
            organization: 'Tech Co',
            title: 'Senior Engineer',
            location: 'Austin, TX',
            startDate: '2021-06-01',
            isCurrent: true,
            highlights: ['Led migration to TypeScript'],
            tags: ['typescript', 'react'],
            privateNotes: 'Salary: $180k',
        },
    ],
    education: [
        {
            institution: 'UT Austin',
            degree: 'BS',
            program: 'Computer Science',
            startDate: '2013-09-01',
            endDate: '2017-05-15',
            status: 'completed',
        },
    ],
    skills: [
        { category: 'Languages', items: ['TypeScript', 'Python', 'Go'] },
        { category: 'Frameworks', items: ['React', 'Next.js', 'Express'] },
    ],
    projects: [
        {
            name: 'OpenWidget',
            description: 'An open-source widget library',
            tech: ['React', 'TypeScript'],
            url: 'https://openwidget.dev',
            repoUrl: 'https://github.com/janedoe/openwidget',
            role: 'Creator',
            highlights: ['500+ GitHub stars'],
            privateNotes: 'Revenue: $200/mo from sponsors',
        },
    ],
};

const DEFAULT_VISIBILITY: VisibilitySettings = {
    sections: {
        identity: 'public',
        links: 'public',
        experience: 'public',
        education: 'public',
        skills: 'public',
        projects: 'public',
        contact: 'public',
    },
    overrides: {
        '/contact/emails': 'public',
        '/contact/phone': 'private',
    },
};

describe('Publish Pipeline', () => {
    it('validates canonical fixture against schema', () => {
        const result = validateCanonicalProfile(CANONICAL_FIXTURE);
        expect(result.isValid).toBe(true);
    });

    it('derives a valid public profile from canonical', () => {
        const versionId = generateVersionId();
        const publishedAt = now();
        const publicProfile = derivePublicProfile(
            CANONICAL_FIXTURE,
            DEFAULT_VISIBILITY,
            versionId,
            '',
            publishedAt,
        );

        // Compute and set content hash
        const contentHash = computeContentHash(publicProfile);
        publicProfile.contentHash = contentHash;

        // Validate the derived public profile
        const result = validatePublicProfile(publicProfile);
        expect(result.isValid).toBe(true);

        // Verify PII redaction
        expect((publicProfile as unknown as Record<string, unknown>).address).toBeUndefined();
        expect((publicProfile.identity as unknown as Record<string, unknown>).dateOfBirth).toBeUndefined();
        expect(publicProfile.experience![0]).not.toHaveProperty('privateNotes');
        expect(publicProfile.projects![0]).not.toHaveProperty('privateNotes');

        // Verify public email is included but phone is not
        expect(publicProfile.contact?.publicEmail).toBe('public@janedoe.dev');
        expect(publicProfile.contact?.phone).toBeUndefined();
    });

    it('generates valid JSON-LD from public profile', () => {
        const versionId = generateVersionId();
        const publishedAt = now();
        const publicProfile = derivePublicProfile(
            CANONICAL_FIXTURE,
            DEFAULT_VISIBILITY,
            versionId,
            '',
            publishedAt,
        );
        publicProfile.contentHash = computeContentHash(publicProfile);

        const jsonLd = generateJsonLd(publicProfile) as Record<string, unknown>;

        expect(jsonLd['@context']).toBe('https://schema.org');
        expect(jsonLd['@type']).toBe('Person');
        expect(jsonLd.name).toBe('Jane Doe');
        expect(jsonLd.email).toBe('public@janedoe.dev');
        expect(jsonLd.url).toBe('https://janedoe.dev');
        expect((jsonLd.sameAs as string[]).length).toBe(2);
        expect((jsonLd.hasOccupation as unknown[]).length).toBe(1);
        expect((jsonLd.alumniOf as unknown[]).length).toBe(1);
        expect((jsonLd.knowsAbout as string[]).length).toBe(6); // 3 languages + 3 frameworks
        expect((jsonLd.owns as unknown[]).length).toBe(1);
    });

    it('content hash is deterministic', () => {
        const versionId = generateVersionId();
        const publishedAt = now();
        const pub1 = derivePublicProfile(CANONICAL_FIXTURE, DEFAULT_VISIBILITY, versionId, '', publishedAt);
        const pub2 = derivePublicProfile(CANONICAL_FIXTURE, DEFAULT_VISIBILITY, versionId, '', publishedAt);

        expect(computeContentHash(pub1)).toBe(computeContentHash(pub2));
    });

    it('content hash changes when data changes', () => {
        const versionId = generateVersionId();
        const publishedAt = now();
        const pub1 = derivePublicProfile(CANONICAL_FIXTURE, DEFAULT_VISIBILITY, versionId, '', publishedAt);

        const modified = { ...CANONICAL_FIXTURE, identity: { ...CANONICAL_FIXTURE.identity, name: 'Jane Smith' } };
        const pub2 = derivePublicProfile(modified, DEFAULT_VISIBILITY, versionId, '', publishedAt);

        expect(computeContentHash(pub1)).not.toBe(computeContentHash(pub2));
    });

    it('respects private sections — hides experience when private', () => {
        const visibility: VisibilitySettings = {
            ...DEFAULT_VISIBILITY,
            sections: { ...DEFAULT_VISIBILITY.sections, experience: 'private' },
        };
        const versionId = generateVersionId();
        const publishedAt = now();
        const pub = derivePublicProfile(CANONICAL_FIXTURE, visibility, versionId, '', publishedAt);

        expect(pub.experience).toBeUndefined();
    });

    it('respects private sections — hides everything except identity name', () => {
        const visibility: VisibilitySettings = {
            sections: {
                identity: 'private',
                links: 'private',
                experience: 'private',
                education: 'private',
                skills: 'private',
                projects: 'private',
                contact: 'private',
            },
            overrides: {},
        };
        const versionId = generateVersionId();
        const publishedAt = now();
        const pub = derivePublicProfile(CANONICAL_FIXTURE, visibility, versionId, '', publishedAt);

        // Identity name is always required
        expect(pub.identity.name).toBe('Jane Doe');
        // Everything else should be undefined
        expect(pub.identity.headline).toBeUndefined();
        expect(pub.links).toBeUndefined();
        expect(pub.experience).toBeUndefined();
        expect(pub.education).toBeUndefined();
        expect(pub.skills).toBeUndefined();
        expect(pub.projects).toBeUndefined();
        expect(pub.contact).toBeUndefined();
    });

    it('versionId is a valid UUID', () => {
        const vid = generateVersionId();
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        expect(vid).toMatch(uuidRegex);
    });
});
