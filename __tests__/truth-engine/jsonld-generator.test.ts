// Tests: JSON-LD Generator — public profile → Schema.org JSON-LD

import { generateJsonLd } from '../../lib/truth-engine/jsonld-generator';
import type { PublicProfile } from '../../lib/truth-engine/types';

const SAMPLE_PROFILE: PublicProfile = {
    schemaVersion: '1.0.0',
    handle: 'ryan-guidry',
    versionId: 'abc-123',
    lastUpdated: '2025-01-01T00:00:00.000Z',
    contentHash: 'deadbeef',
    identity: {
        name: 'Ryan Guidry',
        headline: 'Software Engineer & Technical Writer',
        image: 'https://example.com/photo.jpg',
        location: { city: 'Baton Rouge', region: 'Louisiana', country: 'US' },
    },
    links: {
        website: 'https://ryanguidry.com',
        sameAs: ['https://github.com/rguid31', 'https://linkedin.com/in/rmguidry'],
    },
    contact: {
        publicEmail: 'public@example.com',
    },
    experience: [
        {
            organization: 'Acme Corp',
            title: 'Senior Engineer',
            location: 'Remote',
            startDate: '2022-01-01',
            isCurrent: true,
            highlights: ['Led team of 5'],
        },
    ],
    education: [
        {
            institution: 'LSU',
            degree: 'B.S.',
            program: 'Chemical Engineering',
        },
    ],
    skills: [
        { category: 'Languages', items: ['TypeScript', 'Python'] },
    ],
    projects: [
        {
            name: 'Portfolio',
            description: 'My portfolio website',
            url: 'https://ryanguidry.com',
            repoUrl: 'https://github.com/rguid31/ryan-portfolio',
            tech: ['Next.js', 'TypeScript'],
        },
    ],
};

describe('JSON-LD Generator', () => {
    it('should produce valid JSON-LD with @context and @type', () => {
        const ld = generateJsonLd(SAMPLE_PROFILE) as Record<string, unknown>;
        expect(ld['@context']).toBe('https://schema.org');
        expect(ld['@type']).toBe('Person');
    });

    it('should map identity fields to Person', () => {
        const ld = generateJsonLd(SAMPLE_PROFILE) as Record<string, unknown>;
        expect(ld.name).toBe('Ryan Guidry');
        expect(ld.description).toBe('Software Engineer & Technical Writer');
        expect(ld.image).toBe('https://example.com/photo.jpg');
    });

    it('should map location to PostalAddress', () => {
        const ld = generateJsonLd(SAMPLE_PROFILE) as Record<string, unknown>;
        const address = ld.address as Record<string, unknown>;
        expect(address['@type']).toBe('PostalAddress');
        expect(address.addressLocality).toBe('Baton Rouge');
        expect(address.addressRegion).toBe('Louisiana');
    });

    it('should map links to url and sameAs', () => {
        const ld = generateJsonLd(SAMPLE_PROFILE) as Record<string, unknown>;
        expect(ld.url).toBe('https://ryanguidry.com');
        expect(ld.sameAs).toEqual(['https://github.com/rguid31', 'https://linkedin.com/in/rmguidry']);
    });

    it('should map contact to email', () => {
        const ld = generateJsonLd(SAMPLE_PROFILE) as Record<string, unknown>;
        expect(ld.email).toBe('public@example.com');
    });

    it('should map experience to hasOccupation roles', () => {
        const ld = generateJsonLd(SAMPLE_PROFILE) as Record<string, unknown>;
        const roles = ld.hasOccupation as Record<string, unknown>[];
        expect(roles).toHaveLength(1);
        expect(roles[0]['@type']).toBe('Role');
        expect(roles[0].roleName).toBe('Senior Engineer');
    });

    it('should map education to alumniOf', () => {
        const ld = generateJsonLd(SAMPLE_PROFILE) as Record<string, unknown>;
        const alumni = ld.alumniOf as Record<string, unknown>[];
        expect(alumni).toHaveLength(1);
        expect(alumni[0]['@type']).toBe('EducationalOrganization');
        expect(alumni[0].name).toBe('LSU');
    });

    it('should map skills to knowsAbout', () => {
        const ld = generateJsonLd(SAMPLE_PROFILE) as Record<string, unknown>;
        expect(ld.knowsAbout).toEqual(['TypeScript', 'Python']);
    });

    it('should map projects to CreativeWork', () => {
        const ld = generateJsonLd(SAMPLE_PROFILE) as Record<string, unknown>;
        const works = ld.owns as Record<string, unknown>[];
        expect(works).toHaveLength(1);
        expect(works[0]['@type']).toBe('CreativeWork');
        expect(works[0].name).toBe('Portfolio');
        expect(works[0].codeRepository).toBe('https://github.com/rguid31/ryan-portfolio');
    });

    it('should be deterministic (no extra data injected)', () => {
        const ld1 = JSON.stringify(generateJsonLd(SAMPLE_PROFILE));
        const ld2 = JSON.stringify(generateJsonLd(SAMPLE_PROFILE));
        expect(ld1).toBe(ld2);
    });
});
