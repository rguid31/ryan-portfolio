import { notFound } from 'next/navigation';
import { getProjectBySlug, getProjects } from '@/lib/masterReport';
import Link from 'next/link';
import { Project, Challenge } from '@/lib/types';

interface ProjectPageProps {
    params: {
        slug: string;
    };
}

export async function generateStaticParams() {
    const projects = getProjects();
    return projects.map((project: Project) => ({
        slug: project.slug,
    }));
}

export default function ProjectPage({ params }: ProjectPageProps) {
    const project = getProjectBySlug(params.slug);

    if (!project) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-slate-100 selection:bg-blue-500/30">
            {/* Navigation Header */}
            <div className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link
                        href="/projects"
                        className="flex items-center gap-2 text-sm font-medium hover:text-blue-500 transition-colors"
                    >
                        <span className="text-lg">←</span> Back to Projects
                    </Link>
                    <div className="hidden md:flex gap-4">
                        {project.projectURL && (
                            <a
                                href={project.projectURL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-medium px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                            >
                                Live Demo
                            </a>
                        )}
                        {project.repoURL && (
                            <a
                                href={project.repoURL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-medium px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-full hover:bg-slate-50 dark:hover:bg-slate-900 transition"
                            >
                                View Code
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-12 md:py-24 max-w-5xl">
                {/* Hero Section */}
                <header className="mb-20">
                    <div className="inline-block px-3 py-1 mb-6 text-xs font-bold tracking-widest uppercase bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded">
                        {project.category}
                    </div>
                    <h1 className="text-4xl md:text-7xl font-bold mb-8 leading-tight tracking-tight">
                        {project.projectName}
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
                        {project.projectDescription}
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Left Column: Narrative and Details */}
                    <div className="lg:col-span-8 space-y-20">
                        {/* Narrative Section */}
                        {project.narrative && (
                            <section>
                                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 mb-8">
                                    The Vision
                                </h2>
                                <div className="prose prose-xl dark:prose-invert prose-slate max-w-none">
                                    <p className="whitespace-pre-line leading-relaxed">
                                        {project.narrative}
                                    </p>
                                </div>
                            </section>
                        )}

                        {/* Challenges & Solutions */}
                        {project.challengesFaced && project.challengesFaced.length > 0 && (
                            <section>
                                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 mb-10">
                                    Engineering Hurdles
                                </h2>
                                <div className="space-y-12">
                                    {project.challengesFaced.map((item: Challenge, index: number) => (
                                        <div key={index} className="group relative">
                                            <div className="absolute -left-4 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-800 group-hover:bg-blue-500 transition-colors" />
                                            <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-500 transition-colors">
                                                {item.challenge}
                                            </h3>
                                            <div className="space-y-4 text-slate-600 dark:text-slate-400">
                                                <p><strong className="text-slate-900 dark:text-slate-100 underline decoration-slate-300 dark:decoration-slate-700 underline-offset-4">Problem:</strong> {item.description}</p>
                                                <p><strong className="text-slate-900 dark:text-slate-100 underline decoration-slate-300 dark:decoration-slate-700 underline-offset-4">Solution:</strong> {item.solution}</p>
                                                {item.result && (
                                                    <p className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg italic border border-slate-100 dark:border-slate-800">
                                                        "{item.result}"
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Roadmap */}
                        {project.roadmap && project.roadmap.length > 0 && (
                            <section className="bg-slate-50 dark:bg-slate-900/30 p-8 md:p-12 rounded-3xl border border-slate-100 dark:border-slate-800/50">
                                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 mb-8">
                                    Future Roadmap
                                </h2>
                                <ul className="space-y-6">
                                    {project.roadmap.map((goal, idx) => (
                                        <li key={idx} className="flex gap-4 items-start">
                                            <div className="h-6 w-6 rounded-full bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center shrink-0 mt-1">
                                                <div className="h-2 w-2 rounded-full bg-blue-500" />
                                            </div>
                                            <span className="text-lg leading-relaxed">{goal}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}
                    </div>

                    {/* Right Column: Sidebar Stats & Tech */}
                    <aside className="lg:col-span-4 space-y-12">
                        {/* Status Card */}
                        <div className="p-8 rounded-3xl bg-slate-900 text-white dark:bg-white dark:text-black">
                            <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2">Project Status</p>
                            <p className="text-xl font-bold">{project.status}</p>
                        </div>

                        {/* Impact Metrics */}
                        {project.impactMetrics && Object.keys(project.impactMetrics).length > 0 && (
                            <section>
                                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 mb-6">
                                    Key Metrics
                                </h2>
                                <div className="space-y-4">
                                    {Object.entries(project.impactMetrics).map(([key, value]) => (
                                        <div key={key} className="flex flex-col border-b border-slate-100 dark:border-slate-800 pb-4">
                                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                            <span className="text-lg font-bold">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Tech Categories */}
                        {project.techCategories && Object.keys(project.techCategories).length > 0 && (
                            <section>
                                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 mb-6">
                                    Technology Stack
                                </h2>
                                {Object.entries(project.techCategories).map(([category, techs]) => (
                                    <div key={category} className="mb-8 last:mb-0">
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-4">
                                            {category}
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {techs.map((tech) => (
                                                <span
                                                    key={tech}
                                                    className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-xs font-medium"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </section>
                        )}
                    </aside>
                </div>
            </main>

            {/* CTA Section */}
            <footer className="border-t border-slate-100 dark:border-slate-900 mt-20 py-24 bg-slate-50/50 dark:bg-slate-950/50">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-8">Interested in this project?</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/contact"
                            className="px-8 py-4 bg-slate-900 text-white dark:bg-white dark:text-black rounded-full font-bold hover:scale-105 transition transform"
                        >
                            Let's Talk
                        </Link>
                        {project.repoURL && (
                            <a
                                href={project.repoURL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-8 py-4 border border-slate-200 dark:border-slate-800 rounded-full font-bold hover:bg-white dark:hover:bg-slate-900 transition"
                            >
                                Source Code
                            </a>
                        )}
                    </div>
                </div>
            </footer>
        </div>
    );
}