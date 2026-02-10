// Tests: JSON-LD Generator
import { generateJsonLd } from '../../lib/truth-engine/jsonld-generator';
import type { PublicProfile } from '../../lib/truth-engine/types';

const SAMPLE_PUBLIC_PROFILE: PublicProfile = {
    schemaVersion: '1.0.0',
    handle: 'test-user',
    versionId: 'v1',
    lastUpdated: '2025-01-01T00:00:00Z',
    contentHash: 'abc',
    identity: {
        name: 'Test User',
        headline: 'Software Engineer',
        location: { city: 'Austin', region: 'TX', country: 'US' },
        image: 'https://example.com/photo.jpg',
    },
    links: {
        website: 'https://example.com',
        sameAs: ['https://github.com/testuser'],
    },
    contact: {
        publicEmail: 'public@example.com',
    },
    experience: [
        {
            organization: 'Acme Corp',
            title: 'Senior Engineer',
            startDate: '2022-01-01',
            isCurrent: true,
            highlights: ['Led team'],
        },
    ],
    education: [
        {
            institution: 'UT Austin',
            degree: 'B.S.',
            program: 'CS',
            startDate: '2010',
            endDate: '2014',
            status: 'completed',
        },
    ],
    skills: [
        { category: 'Languages', items: ['TypeScript'] },
    ],
    projects: [
        {
            name: 'Project A',
            description: 'A cool project',
            url: 'https://project-a.com',
        },
    ],
};

describe('JSON-LD Generator', () => {
    it('should generate valid Person schema', () => {
        const jsonLd: any = generateJsonLd(SAMPLE_PUBLIC_PROFILE);

        expect(jsonLd['@context']).toBe('https://schema.org');
        expect(jsonLd['@type']).toBe('Person');
        expect(jsonLd.name).toBe('Test User');
        expect(jsonLd.description).toBe('Software Engineer');
        expect(jsonLd.image).toBe('https://example.com/photo.jpg');
    });

    it('should map location to address', () => {
        const jsonLd: any = generateJsonLd(SAMPLE_PUBLIC_PROFILE);
        expect(jsonLd.address['@type']).toBe('PostalAddress');
        expect(jsonLd.address.addressLocality).toBe('Austin');
        expect(jsonLd.address.addressRegion).toBe('TX');
        expect(jsonLd.address.addressCountry).toBe('US');
    });

    it('should map experience to hasOccupation', () => {
        const jsonLd: any = generateJsonLd(SAMPLE_PUBLIC_PROFILE);
        const role = jsonLd.hasOccupation[0];

        expect(role['@type']).toBe('Role');
        expect(role.roleName).toBe('Senior Engineer');
        expect(role.startDate).toBe('2022-01-01');

        // Revised expectation: memberOf should NOT have schema: prefix
        expect(role.memberOf['@type']).toBe('Organization');
        expect(role.memberOf.name).toBe('Acme Corp');
    });

    it('should map education to alumniOf', () => {
        const jsonLd: any = generateJsonLd(SAMPLE_PUBLIC_PROFILE);
        const edu = jsonLd.alumniOf[0];

        expect(edu['@type']).toBe('EducationalOrganization');
        expect(edu.name).toBe('UT Austin');
    });

    it('should map contact info', () => {
        const jsonLd: any = generateJsonLd(SAMPLE_PUBLIC_PROFILE);
        expect(jsonLd.email).toBe('public@example.com');
        // Phone should be undefined as it's not in sample
        expect(jsonLd.telephone).toBeUndefined();
    });
});
