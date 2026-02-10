import { notFound } from 'next/navigation';
import { getProjectBySlug, getProjects } from '@/lib/masterReport';
import Link from 'next/link';

interface ProjectPageProps {
    params: {
        slug: string;
    };
}

export async function generateStaticParams() {
    const projects = getProjects();
    return projects.map((project) => ({
        slug: project.id,
    }));
}

export default function ProjectPage({ params }: ProjectPageProps) {
    const project = getProjectBySlug(params.slug);

    if (!project) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <Link
                href="/projects"
                className="text-blue-600 dark:text-blue-400 hover:underline mb-6 inline-block"
            >
                ← Back to Projects
            </Link>

            <article className="max-w-4xl">
                <h1 className="text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                    {project.projectName}
                </h1>

                <div className="flex flex-wrap gap-2 mb-6">
                    {project.techStack?.map((tech: string) => (
                        <span
                            key={tech}
                            className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                        >
                            {tech}
                        </span>
                    ))}
                </div>

                {project.projectDescription && (
                    <div className="prose dark:prose-invert max-w-none mb-8">
                        <p className="text-xl text-gray-700 dark:text-gray-300">
                            {project.projectDescription}
                        </p>
                    </div>
                )}

                {project.responsibilities && project.responsibilities.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            Key Responsibilities
                        </h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                            {project.responsibilities.map((item: string, index: number) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </section>
                )}

                {project.keyLearnings && project.keyLearnings.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            Key Learnings
                        </h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                            {project.keyLearnings.map((item: string, index: number) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </section>
                )}

                {project.projectURL && (
                    <a
                        href={project.projectURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                    >
                        View Project →
                    </a>
                )}
            </article>
        </div>
    );
}