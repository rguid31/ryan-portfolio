import { getExperience } from '@/lib/masterReport';

export default function ExperiencePage() {
    const experiences = getExperience();

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-5xl font-bold mb-8">Work Experience</h1>

            <div className="max-w-4xl space-y-12">
                {experiences.map((exp) => (
                    <article key={exp.id} className="border-l-4 border-blue-600 pl-6 pb-8">
                        <div className="mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">{exp.title}</h2>
                            <p className="text-xl text-gray-700">{exp.company}</p>
                            <p className="text-sm text-gray-500 mt-1">
                                {exp.startDate} - {exp.endDate || 'Present'} • {exp.location} • {exp.employmentType}
                            </p>
                        </div>

                        <p className="text-gray-700 mb-4">{exp.description}</p>

                        {exp.responsibilities && exp.responsibilities.length > 0 && (
                            <div className="mb-4">
                                <h3 className="font-semibold mb-2">Responsibilities:</h3>
                                <ul className="list-disc list-inside space-y-1">
                                    {exp.responsibilities.map((resp, idx) => (
                                        <li key={idx} className="text-gray-700">{resp}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {exp.achievements && exp.achievements.length > 0 && (
                            <div className="mb-4">
                                <h3 className="font-semibold mb-2">Achievements:</h3>
                                <ul className="list-disc list-inside space-y-1">
                                    {exp.achievements.map((achievement, idx) => (
                                        <li key={idx} className="text-gray-700">{achievement}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {exp.skills && exp.skills.length > 0 && (
                            <div>
                                <h3 className="font-semibold mb-2">Skills:</h3>
                                <div className="flex flex-wrap gap-2">
                                    {exp.skills.map((skill, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </article>
                ))}
            </div>
        </div>
    );
}