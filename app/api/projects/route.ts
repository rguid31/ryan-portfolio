import { NextResponse } from 'next/server';
import { getProjects } from '@/lib/masterReport';

export async function GET() {
    const projects = await getProjects();

    // Return clean project data for AI consumption
    const projectsData = projects.map((project) => ({
        id: project.id,
        name: project.projectName,
        slug: project.slug,
        category: project.category,
        status: project.status,
        featured: project.featured,
        description: project.projectDescription,
        shortDescription: project.shortDescription,
        narrative: project.narrative,
        conceptualArchitecture: project.conceptualArchitecture,
        techStack: project.techStack,
        impactMetrics: project.impactMetrics,
        roadmap: project.roadmap,
        url: project.projectURL,
        repository: project.repoURL,
    }));

    return NextResponse.json(
        { projects: projectsData },
        {
            headers: {
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
            },
        }
    );
}
