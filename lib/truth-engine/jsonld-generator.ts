// Truth Engine — JSON-LD generator: public profile → Schema.org JSON-LD
// Mapping rules per docs/ARCHITECTURE.md

import type { PublicProfile } from './types';

/**
 * Generate a JSON-LD document from a public profile snapshot.
 * Maps to Schema.org types: Person, Role, EducationalOrganization, CreativeWork.
 *
 * The output is deterministic — derived entirely from the public dataset
 * with no extra facts injected.
 */
export function generateJsonLd(profile: PublicProfile): object {
    const person: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        '@id': `/u/${profile.handle}`,
        name: profile.identity.name,
    };

    // Identity fields
    if (profile.identity.headline) {
        person.description = profile.identity.headline;
    }
    if (profile.identity.image) {
        person.image = profile.identity.image;
    }
    if (profile.identity.location) {
        const loc = profile.identity.location;
        person.address = {
            '@type': 'PostalAddress',
            ...(loc.city && { addressLocality: loc.city }),
            ...(loc.region && { addressRegion: loc.region }),
            ...(loc.country && { addressCountry: loc.country }),
        };
    }

    // Links
    if (profile.links?.website) {
        person.url = profile.links.website;
    }
    if (profile.links?.sameAs?.length) {
        person.sameAs = profile.links.sameAs;
    }

    // Contact
    if (profile.contact?.publicEmail) {
        person.email = profile.contact.publicEmail;
    }
    if (profile.contact?.phone) {
        person.telephone = profile.contact.phone;
    }

    // Experience → hasOccupation (array of Role)
    if (profile.experience?.length) {
        person.hasOccupation = profile.experience.map(exp => {
            const role: Record<string, unknown> = {
                '@type': 'Role',
                roleName: exp.title,
                memberOf: {
                    '@type': 'Organization',
                    name: exp.organization,
                },
            };
            if (exp.startDate) role.startDate = exp.startDate;
            if (exp.endDate) role.endDate = exp.endDate;
            if (exp.location) {
                (role['memberOf'] as Record<string, unknown>).location = exp.location;
            }
            if (exp.highlights?.length) {
                role.description = exp.highlights.join('; ');
            }
            return role;
        });
    }

    // Education → alumniOf (array of EducationalOrganization)
    if (profile.education?.length) {
        person.alumniOf = profile.education.map(edu => {
            const org: Record<string, unknown> = {
                '@type': 'EducationalOrganization',
                name: edu.institution,
            };
            if (edu.degree || edu.program) {
                org.description = [edu.degree, edu.program].filter(Boolean).join(' — ');
            }
            return org;
        });
    }

    // Skills → knowsAbout
    if (profile.skills?.length) {
        const allSkills = profile.skills.flatMap(cat => cat.items);
        if (allSkills.length > 0) {
            person.knowsAbout = allSkills;
        }
    }

    // Projects → CreativeWork
    if (profile.projects?.length) {
        person.owns = profile.projects.map(proj => {
            const work: Record<string, unknown> = {
                '@type': 'CreativeWork',
                name: proj.name,
            };
            if (proj.description) work.description = proj.description;
            if (proj.url) work.url = proj.url;
            if (proj.repoUrl) work.codeRepository = proj.repoUrl;
            if (proj.tech?.length) work.keywords = proj.tech;
            return work;
        });
    }

    return person;
}
