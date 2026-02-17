import { getPersonalInfo, getSummary, getExperience, getEducation, getSkills } from '@/lib/masterReport';
import PrintButton from '@/components/PrintButton';

export default async function ResumePage() {
    const [personal, summary, experiences, education, skills] = await Promise.all([
        getPersonalInfo(),
        getSummary(),
        getExperience(),
        getEducation(),
        getSkills()
    ]);

    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl">
            <div className="bg-white shadow-lg rounded-lg p-8 md:p-12">
                {/* Header */}
                <header className="mb-8 border-b-2 border-gray-200 pb-6">
                    <h1 className="text-5xl font-bold mb-2">{personal.fullName}</h1>
                    <p className="text-2xl text-gray-700 mb-4">{summary.headline}</p>
                    <div className="flex flex-wrap gap-4 text-gray-600">
                        <span>{personal.contact.email}</span>
                        <span>•</span>
                        <span>{personal.location.city}, {personal.location.state}</span>
                        {personal.contact.website && (
                            <>
                                <span>•</span>
                                <a href={personal.contact.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    Portfolio
                                </a>
                            </>
                        )}
                    </div>
                </header>

                {/* Summary */}
                <section className="mb-8">
                    <h2 className="text-3xl font-bold mb-3 text-blue-600">Professional Summary</h2>
                    <p className="text-gray-700">{summary.description}</p>
                </section>

                {/* Experience */}
                <section className="mb-8">
                    <h2 className="text-3xl font-bold mb-4 text-blue-600">Experience</h2>
                    <div className="space-y-6">
                        {experiences.map((exp) => (
                            <div key={exp.id}>
                                <div className="mb-2">
                                    <h3 className="text-xl font-bold">{exp.title}</h3>
                                    <p className="text-gray-700">{exp.company} • {exp.location}</p>
                                    <p className="text-sm text-gray-500">{exp.startDate} - {exp.endDate || 'Present'}</p>
                                </div>
                                {exp.responsibilities && exp.responsibilities.length > 0 && (
                                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                                        {exp.responsibilities.slice(0, 3).map((resp, idx) => (
                                            <li key={idx}>{resp}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Education */}
                <section className="mb-8">
                    <h2 className="text-3xl font-bold mb-4 text-blue-600">Education</h2>
                    {education.map((edu) => (
                        <div key={edu.id} className="mb-4">
                            <h3 className="text-xl font-bold">{edu.degree} in {edu.field}</h3>
                            <p className="text-gray-700">{edu.institution}</p>
                            <p className="text-sm text-gray-500">{edu.location.city}, {edu.location.state} • Graduated {edu.graduationDate}</p>
                            {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                        </div>
                    ))}
                </section>

                {/* Skills */}
                <section className="mb-8">
                    <h2 className="text-3xl font-bold mb-4 text-blue-600">Technical Skills</h2>
                    <div className="space-y-3">
                        {Object.values(skills).map((category) => (
                            <div key={category.category}>
                                <h3 className="font-bold text-lg mb-1">{category.category}</h3>
                                <p className="text-gray-700">
                                    {category.items.map(skill => skill.name).join(' • ')}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Download Button */}
                <div className="text-center pt-6 border-t-2 border-gray-200">
                    <PrintButton />
                </div>
            </div>
        </div>
    );
}