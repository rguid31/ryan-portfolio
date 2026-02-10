// Truth Engine — Privacy engine: canonical → public transformation
// Implements spec/PRIVACY.md redaction rules

import type { CanonicalProfile, PublicProfile, VisibilitySettings } from './types';

/**
 * Hard-private fields that are NEVER included in the public profile,
 * regardless of visibility settings.
 */
const HARD_PRIVATE_FIELDS = [
    'dateOfBirth',
    'address',       // entire section
    'privateNotes',  // on experience + projects entries
];

/**
 * Transform a canonical profile into a public profile by applying
 * visibility settings and hard-privacy redaction rules.
 *
 * This is the security boundary — the output of this function is the
 * ONLY data that public endpoints will ever return.
 */
export function derivePublicProfile(
    canonical: CanonicalProfile,
    visibility: VisibilitySettings,
    versionId: string,
    contentHash: string,
    publishedAt: string,
): PublicProfile {
    const pub: PublicProfile = {
        schemaVersion: canonical.schemaVersion,
        handle: canonical.handle,
        versionId,
        lastUpdated: publishedAt,
        contentHash,
        identity: { name: canonical.identity.name },
    };

    // ─── Identity (always required, but redact PII) ──────────────
    if (visibility.sections.identity === 'public') {
        pub.identity = {
            name: canonical.identity.name,
            ...(canonical.identity.headline && { headline: canonical.identity.headline }),
            ...(canonical.identity.summary && { summary: canonical.identity.summary }),
            ...(canonical.identity.image && { image: canonical.identity.image }),
            ...(canonical.identity.location && { location: canonical.identity.location }),
            // dateOfBirth is NEVER included (hard-private)
        };
    } else {
        // Identity name is always required in public schema
        pub.identity = { name: canonical.identity.name };
    }

    // ─── Links ───────────────────────────────────────────────────
    if (visibility.sections.links === 'public' && canonical.links) {
        pub.links = {
            ...(canonical.links.website && { website: canonical.links.website }),
            ...(canonical.links.sameAs?.length && { sameAs: canonical.links.sameAs }),
        };
    }

    // ─── Contact (heavily redacted) ──────────────────────────────
    if (visibility.sections.contact === 'public' && canonical.contact) {
        const contact: PublicProfile['contact'] = {};

        // Only include public-type emails
        const publicEmail = canonical.contact.emails?.find(e => e.type === 'public');
        if (publicEmail && visibility.overrides['/contact/emails'] !== 'private') {
            contact.publicEmail = publicEmail.email;
        }

        // Phone only if explicitly overridden to public
        if (canonical.contact.phone && visibility.overrides['/contact/phone'] === 'public') {
            contact.phone = canonical.contact.phone;
        }

        if (Object.keys(contact).length > 0) {
            pub.contact = contact;
        }
    }

    // ─── Experience (strip privateNotes) ─────────────────────────
    if (visibility.sections.experience === 'public' && canonical.experience?.length) {
        pub.experience = canonical.experience.map(exp => {
            // Destructure out privateNotes — never include it
            const { privateNotes, ...publicExp } = exp;
            return publicExp;
        });
    }

    // ─── Education ───────────────────────────────────────────────
    if (visibility.sections.education === 'public' && canonical.education?.length) {
        pub.education = canonical.education;
    }

    // ─── Skills ──────────────────────────────────────────────────
    if (visibility.sections.skills === 'public' && canonical.skills?.length) {
        pub.skills = canonical.skills;
    }

    // ─── Projects (strip privateNotes) ───────────────────────────
    if (visibility.sections.projects === 'public' && canonical.projects?.length) {
        pub.projects = canonical.projects.map(proj => {
            const { privateNotes, role, highlights, ...publicProj } = proj;
            return publicProj;
        });
    }

    return pub;
}
