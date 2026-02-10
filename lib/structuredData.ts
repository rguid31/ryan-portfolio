import { getMasterReport } from './masterReport';
import { Project, Experience, Education } from './types';

const SITE_URL = 'https://ryanguidry.com';

/**
 * Generate Person schema for homepage
 */
export function generatePersonSchema() {
    const data = getMasterReport();
    const { personal, summary } = data;

    return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: personal.fullName,
        givenName: personal.firstName,
        familyName: personal.lastName,
        email: personal.contact.email,
        telephone: personal.contact.phone,
        url: personal.contact.website,
        jobTitle: summary.headline,
        description: summary.description,
        address: {
            '@type': 'PostalAddress',
            addressLocality: personal.location.city,
            addressRegion: personal.location.state,
            addressCountry: personal.location.country,
        },
        sameAs: [
            personal.social.linkedin,
            personal.social.github,
            personal.social.twitter,
        ].filter(Boolean),
        knowsAbout: summary.coreCompetencies,
    };
}

/**
 * Generate WebSite schema
 */
export function generateWebSiteSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Ryan Guidry - Digital Twin Portfolio',
        description: 'A self-documenting, data-driven professional platform showcasing AI/ML, full-stack development, and data science expertise.',
        url: SITE_URL,
        author: {
            '@type': 'Person',
            name: 'Ryan Guidry',
        },
        potentialAction: {
            '@type': 'SearchAction',
            target: `${SITE_URL}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
        },
    };
}

/**
 * Generate Project/CreativeWork schema
 */
export function generateProjectSchema(project: Project) {
    return {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: project.projectName,
        description: project.projectDescription,
        url: project.projectURL || `${SITE_URL}/projects/${project.slug}`,
        creator: {
            '@type': 'Person',
            name: 'Ryan Guidry',
        },
        keywords: project.techStack.join(', '),
        about: project.category,
        ...(project.repoURL && {
            codeRepository: project.repoURL,
        }),
    };
}

/**
 * Generate WorkExperience schema
 */
export function generateWorkExperienceSchema(experience: Experience) {
    return {
        '@context': 'https://schema.org',
        '@type': 'WorkExperience',
        name: experience.title,
        description: experience.description,
        startDate: experience.startDate,
        ...(experience.endDate && { endDate: experience.endDate }),
        employer: {
            '@type': 'Organization',
            name: experience.company,
            address: {
                '@type': 'PostalAddress',
                addressLocality: experience.location,
            },
        },
        skills: experience.skills.join(', '),
    };
}

/**
 * Generate EducationalOccupationalCredential schema
 */
export function generateEducationSchema(education: Education) {
    return {
        '@context': 'https://schema.org',
        '@type': 'EducationalOccupationalCredential',
        name: `${education.degree} in ${education.field}`,
        description: education.description || `${education.degree} from ${education.institution}`,
        credentialCategory: education.degree,
        educationalLevel: education.degree.includes('Bachelor') ? 'Undergraduate' : 'Graduate',
        recognizedBy: {
            '@type': 'EducationalOrganization',
            name: education.institution,
            address: {
                '@type': 'PostalAddress',
                addressLocality: education.location.city,
                addressRegion: education.location.state,
            },
        },
        ...(education.graduationDate && {
            validFrom: education.graduationDate,
        }),
    };
}

/**
 * Generate BreadcrumbList schema for navigation
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${SITE_URL}${item.url}`,
        })),
    };
}

/**
 * Helper to inject JSON-LD script into page
 */
export function jsonLdScriptProps(data: object) {
    return {
        type: 'application/ld+json',
        dangerouslySetInnerHTML: { __html: JSON.stringify(data) },
    };
}
