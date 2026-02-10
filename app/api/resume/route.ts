import { NextResponse } from 'next/server';
import { getMasterReport } from '@/lib/masterReport';

export async function GET() {
    const data = getMasterReport();

    // Create a clean, AI-friendly resume format
    const resume = {
        personal: {
            name: data.personal.fullName,
            email: data.personal.contact.email,
            phone: data.personal.contact.phone,
            website: data.personal.contact.website,
            location: `${data.personal.location.city}, ${data.personal.location.state}`,
            linkedin: data.personal.social.linkedin,
            github: data.personal.social.github,
        },
        summary: {
            headline: data.summary.headline,
            tagline: data.summary.tagline,
            description: data.summary.description,
            coreCompetencies: data.summary.coreCompetencies,
        },
        experience: data.experience.map((exp) => ({
            title: exp.title,
            company: exp.company,
            location: exp.location,
            startDate: exp.startDate,
            endDate: exp.endDate,
            current: exp.current,
            description: exp.description,
            responsibilities: exp.responsibilities,
            skills: exp.skills,
        })),
        education: data.education.map((edu) => ({
            institution: edu.institution,
            degree: edu.degree,
            field: edu.field,
            location: `${edu.location.city}, ${edu.location.state}`,
            graduationDate: edu.graduationDate,
            description: edu.description,
        })),
        projects: data.projects.map((project) => ({
            name: project.projectName,
            slug: project.slug,
            category: project.category,
            status: project.status,
            description: project.projectDescription,
            techStack: project.techStack,
            url: project.projectURL,
            repository: project.repoURL,
        })),
        skills: data.skills,
    };

    return NextResponse.json(resume, {
        headers: {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
    });
}
