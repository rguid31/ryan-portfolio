import { getEducation, getMasterReport } from '@/lib/masterReport';

export const metadata = {
    title: 'Education & Certifications | Ryan Guidry',
    description: 'Academic background and professional certifications.',
};

export default function EducationPage() {
    const education = getEducation();
    const data = getMasterReport();
    const certifications = data.certifications;

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'in progress':
                return 'bg-blue-100 text-blue-800';
            case 'needs verification':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="container mx-auto px-4 py-16">
            <h1 className="text-5xl font-bold mb-12">Education & Certifications</h1>

            {/* Education Section */}
            <section className="mb-16">
                <h2 className="text-3xl font-bold mb-8">Education</h2>
                {education.map((edu) => (
                    <div key={edu.id} className="border border-gray-200 rounded-lg p-8 mb-6">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                            <div>
                                <h3 className="text-2xl font-bold mb-2">{edu.degree} in {edu.field}</h3>
                                <p className="text-xl text-gray-700">{edu.institution}</p>
                                <p className="text-gray-600">{edu.location.city}, {edu.location.state}</p>
                            </div>
                            <div className="text-right mt-4 md:mt-0">
                                <p className="text-lg font-medium">Graduated: {edu.graduationDate}</p>
                                <p className="text-gray-600">GPA: {edu.gpa.toFixed(1)}</p>
                            </div>
                        </div>

                        {/* Relevant Coursework */}
                        {edu.relevantCoursework && edu.relevantCoursework.length > 0 && (
                            <div className="mb-4">
                                <h4 className="font-semibold mb-3">Relevant Coursework:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {edu.relevantCoursework.map((course) => (
                                        <span
                                            key={course}
                                            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                                        >
                                            {course}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Achievements */}
                        {edu.achievements && edu.achievements.length > 0 && (
                            <div>
                                <h4 className="font-semibold mb-2">Key Achievements:</h4>
                                <ul className="space-y-1">
                                    {edu.achievements.map((achievement, idx) => (
                                        <li key={idx} className="flex items-start">
                                            <span className="text-blue-600 mr-2">✓</span>
                                            <span className="text-gray-700">{achievement}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ))}
            </section>

            {/* Certifications Section */}
            <section>
                <h2 className="text-3xl font-bold mb-8">Professional Certifications</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {certifications.map((cert) => (
                        <div key={cert.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-xl font-bold flex-1">{cert.name}</h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(cert.status)}`}>
                                    {cert.status}
                                </span>
                            </div>

                            <p className="text-gray-700 font-medium mb-3">{cert.issuer}</p>

                            {/* Dates */}
                            <div className="text-sm text-gray-600 mb-3">
                                {cert.startDate && <p>Started: {cert.startDate}</p>}
                                {cert.completionDate && <p>Completed: {cert.completionDate}</p>}
                                {cert.issueDate && <p>Issued: {cert.issueDate}</p>}
                                {cert.expirationDate && <p>Expires: {cert.expirationDate}</p>}
                            </div>

                            {/* Credential Info */}
                            {cert.credentialID && (
                                <p className="text-xs text-gray-500 mb-2">
                                    Credential ID: {cert.credentialID}
                                </p>
                            )}

                            {cert.credentialURL && (
                                <a
                                    href={cert.credentialURL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    View Credential →
                                </a>
                            )}

                            {/* Skills */}
                            {cert.skills && cert.skills.length > 0 && (
                                <div className="mt-4">
                                    <div className="flex flex-wrap gap-2">
                                        {cert.skills.map((skill) => (
                                            <span
                                                key={skill}
                                                className="px-2 py-1 bg-gray-100 rounded text-xs"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Certification Summary */}
                <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold mb-4">Certifications Summary</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">{certifications.length}</div>
                            <div className="text-sm text-gray-600">Total Certifications</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600">
                                {certifications.filter(c => c.status === 'Active').length}
                            </div>
                            <div className="text-sm text-gray-600">Active</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">
                                {certifications.filter(c => c.status === 'In Progress').length}
                            </div>
                            <div className="text-sm text-gray-600">In Progress</div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}