// GET /u/:handle — Public profile HTML page
// Renders the public dataset as a styled profile page
import { getLatestSnapshot } from '@/lib/truth-engine';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { PublicProfile } from '@/lib/truth-engine/types';
import type { Metadata } from 'next';

interface ProfilePageProps {
    params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
    const { handle } = await params;
    const snapshot = await getLatestSnapshot(handle);

    if (!snapshot) {
        return { title: 'Profile Not Found' };
    }

    const profile: PublicProfile = JSON.parse(snapshot.public_json);
    return {
        title: `${profile.identity.name} | Truth Engine`,
        description: profile.identity.headline || `${profile.identity.name}'s public profile`,
    };
}

export default async function PublicProfilePage({ params }: ProfilePageProps) {
    const { handle } = await params;

    const snapshot = await getLatestSnapshot(handle);
    if (!snapshot) {
        notFound();
    }

    const profile: PublicProfile = JSON.parse(snapshot.public_json);
    const jsonLd = JSON.parse(snapshot.jsonld_json);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* JSON-LD for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Header */}
                <header className="mb-12">
                    <div className="flex items-start gap-6 mb-6">
                        {profile.identity.image && (
                            <img
                                src={profile.identity.image}
                                alt={profile.identity.name}
                                className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
                            />
                        )}
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                                {profile.identity.name}
                            </h1>
                            {profile.identity.headline && (
                                <p className="text-xl text-gray-600 dark:text-gray-400 mt-1">
                                    {profile.identity.headline}
                                </p>
                            )}
                            {profile.identity.location && (
                                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                                    📍 {[profile.identity.location.city, profile.identity.location.region, profile.identity.location.country].filter(Boolean).join(', ')}
                                </p>
                            )}
                        </div>
                    </div>

                    {profile.identity.summary && (
                        <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                            {profile.identity.summary}
                        </p>
                    )}

                    {/* Links */}
                    {profile.links && (
                        <div className="flex flex-wrap gap-3 mt-4">
                            {profile.links.website && (
                                <a href={profile.links.website} target="_blank" rel="noopener noreferrer"
                                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                                    🌐 Website
                                </a>
                            )}
                            {profile.links.sameAs?.map((url) => (
                                <a key={url} href={url} target="_blank" rel="noopener noreferrer"
                                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                                    🔗 {new URL(url).hostname}
                                </a>
                            ))}
                        </div>
                    )}

                    {/* Contact */}
                    {profile.contact?.publicEmail && (
                        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                            ✉️ <a href={`mailto:${profile.contact.publicEmail}`} className="hover:underline">
                                {profile.contact.publicEmail}
                            </a>
                        </p>
                    )}
                </header>

                {/* Experience */}
                {profile.experience && profile.experience.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-2">
                            Experience
                        </h2>
                        <div className="space-y-6">
                            {profile.experience.map((exp, i) => (
                                <div key={i} className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {exp.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {exp.organization}
                                        {exp.location && ` · ${exp.location}`}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-500">
                                        {exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate}
                                    </p>
                                    {exp.highlights && exp.highlights.length > 0 && (
                                        <ul className="mt-3 space-y-1">
                                            {exp.highlights.map((h, j) => (
                                                <li key={j} className="text-gray-700 dark:text-gray-300 text-sm">
                                                    • {h}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {exp.tags && exp.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-3">
                                            {exp.tags.map((tag) => (
                                                <span key={tag} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded text-xs">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {profile.education && profile.education.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-2">
                            Education
                        </h2>
                        <div className="space-y-4">
                            {profile.education.map((edu, i) => (
                                <div key={i} className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {edu.institution}
                                    </h3>
                                    {(edu.degree || edu.program) && (
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {[edu.degree, edu.program].filter(Boolean).join(' — ')}
                                        </p>
                                    )}
                                    <p className="text-sm text-gray-500 dark:text-gray-500">
                                        {edu.startDate} — {edu.endDate || 'Present'}
                                        {edu.status && ` · ${edu.status}`}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Skills */}
                {profile.skills && profile.skills.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-2">
                            Skills
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {profile.skills.map((cat, i) => (
                                <div key={i} className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                                        {cat.category}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {cat.items.map((skill) => (
                                            <span key={skill} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects */}
                {profile.projects && profile.projects.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-2">
                            Projects
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {profile.projects.map((proj, i) => (
                                <div key={i} className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                        {proj.url ? (
                                            <a href={proj.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                                                {proj.name} ↗
                                            </a>
                                        ) : proj.name}
                                    </h3>
                                    {proj.description && (
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                                            {proj.description}
                                        </p>
                                    )}
                                    {proj.tech && proj.tech.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-3">
                                            {proj.tech.map((t) => (
                                                <span key={t} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded text-xs">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    {proj.repoUrl && (
                                        <a href={proj.repoUrl} target="_blank" rel="noopener noreferrer"
                                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block">
                                            View Source →
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Footer with data links */}
                <footer className="border-t pt-6 mt-12 text-center text-sm text-gray-500 dark:text-gray-500">
                    <p className="mb-2">
                        Version {snapshot.version_id.slice(0, 8)} · Last updated {new Date(snapshot.created_at).toLocaleDateString()}
                    </p>
                    <div className="flex justify-center gap-4">
                        <a href={`/u/${handle}.json`} className="hover:text-blue-600">📄 JSON</a>
                        <a href={`/u/${handle}.jsonld`} className="hover:text-blue-600">🔗 JSON-LD</a>
                    </div>
                    <p className="mt-4 text-xs">
                        Powered by <Link href="/" className="text-blue-600 hover:underline">Truth Engine</Link>
                    </p>
                </footer>
            </div>
        </div>
    );
}
