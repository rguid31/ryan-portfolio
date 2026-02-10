import { MetadataRoute } from 'next';
import { getProjects } from '@/lib/masterReport';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://ryanguidry.com';
    const projects = getProjects();

    // Static pages
    const staticPages = [
        '',
        '/about',
        '/projects',
        '/experience',
        '/education',
        '/skills',
        '/hobbies',
        '/resume',
        '/contact',
        '/builder',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1.0 : 0.8,
    }));

    // Dynamic project pages
    const projectPages = projects.map((project) => ({
        url: `${baseUrl}/projects/${project.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: project.featured ? 0.9 : 0.7,
    }));

    return [...staticPages, ...projectPages];
}
