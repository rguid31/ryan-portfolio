import { getPersonalInfo, getSummary } from '@/lib/masterReport';

export default async function AboutPage() {
    const [personal, summary] = await Promise.all([
        getPersonalInfo(),
        getSummary()
    ]);

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-5xl font-bold mb-8">About Me</h1>

            <div className="max-w-4xl">
                <section className="mb-12">
                    <h2 className="text-3xl font-semibold mb-4">Background</h2>
                    <p className="text-lg text-gray-700 mb-4">{summary.description}</p>
                    <p className="text-lg text-gray-700">{summary.valueProposition}</p>
                </section>

                <section className="mb-12">
                    <h2 className="text-3xl font-semibold mb-4">Core Competencies</h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {summary.coreCompetencies.map((competency, index) => (
                            <li key={index} className="flex items-start">
                                <span className="text-blue-600 mr-2">•</span>
                                <span className="text-gray-700">{competency}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h2 className="text-3xl font-semibold mb-4">Let's Connect</h2>
                    <div className="flex flex-col gap-2">
                        <p className="text-gray-700">
                            <strong>Email:</strong> <a href={`mailto:${personal.contact.email}`} className="text-blue-600 hover:underline">{personal.contact.email}</a>
                        </p>
                        <p className="text-gray-700">
                            <strong>Location:</strong> {personal.location.city}, {personal.location.state}
                        </p>
                        {personal.social.linkedin && (
                            <p className="text-gray-700">
                                <strong>LinkedIn:</strong> <a href={personal.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Profile</a>
                            </p>
                        )}
                        {personal.social.github && (
                            <p className="text-gray-700">
                                <strong>GitHub:</strong> <a href={personal.social.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Profile</a>
                            </p>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}