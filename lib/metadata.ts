import { Metadata } from 'next';

const SITE_URL = 'https://ryanguidry.com';
const SITE_NAME = 'Ryan Guidry - Digital Twin Portfolio';
const DEFAULT_DESCRIPTION =
    'A self-documenting, data-driven professional platform showcasing AI/ML, full-stack development, and data science expertise.';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

/**
 * Generate base metadata for all pages
 */
export function generateBaseMetadata(): Metadata {
    return {
        metadataBase: new URL(SITE_URL),
        title: {
            default: SITE_NAME,
            template: `%s | Ryan Guidry`,
        },
        description: DEFAULT_DESCRIPTION,
        keywords: [
            'Ryan Guidry',
            'AI/ML Engineer',
            'Data Scientist',
            'Full-Stack Developer',
            'Technical Writer',
            'Mathematics',
            'Chemical Engineering',
            'Next.js',
            'React',
            'Python',
            'TypeScript',
        ],
        authors: [{ name: 'Ryan Guidry', url: SITE_URL }],
        creator: 'Ryan Guidry',
        openGraph: {
            type: 'website',
            locale: 'en_US',
            url: SITE_URL,
            siteName: SITE_NAME,
            title: SITE_NAME,
            description: DEFAULT_DESCRIPTION,
            images: [
                {
                    url: DEFAULT_IMAGE,
                    width: 1200,
                    height: 630,
                    alt: 'Ryan Guidry - Digital Twin Portfolio',
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: SITE_NAME,
            description: DEFAULT_DESCRIPTION,
            images: [DEFAULT_IMAGE],
            creator: '@inquireryan',
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
    };
}

/**
 * Generate metadata for project pages
 */
export function generateProjectMetadata(project: {
    projectName: string;
    projectDescription: string;
    slug: string;
    techStack: string[];
}): Metadata {
    const title = project.projectName;
    const description = project.projectDescription;
    const url = `${SITE_URL}/projects/${project.slug}`;

    return {
        title,
        description,
        openGraph: {
            type: 'article',
            url,
            title,
            description,
            images: [DEFAULT_IMAGE],
            tags: project.techStack,
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [DEFAULT_IMAGE],
        },
    };
}

/**
 * Generate metadata for experience/education pages
 */
export function generatePageMetadata(
    title: string,
    description: string,
    path: string
): Metadata {
    const url = `${SITE_URL}${path}`;

    return {
        title,
        description,
        openGraph: {
            type: 'website',
            url,
            title,
            description,
            images: [DEFAULT_IMAGE],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [DEFAULT_IMAGE],
        },
    };
}
