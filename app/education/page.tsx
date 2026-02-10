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
                    <div key={edu.id} className="border border-gray-200 dark:border-gray-800 rounded-2xl p-8 mb-8 hover:shadow-xl transition-shadow bg-white dark:bg-slate-950">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
                            <div>
                                <h3 className="text-2xl md:text-3xl font-bold mb-2 text-slate-900 dark:text-white">{edu.degree} in {edu.field}</h3>
                                <p className="text-xl text-blue-600 dark:text-blue-400 font-medium">{edu.institution}</p>
                                <p className="text-slate-500 dark:text-slate-400">{edu.location.city}, {edu.location.state}</p>
                            </div>
                            <div className="text-right mt-4 md:mt-0">
                                <span className="inline-block px-4 py-1.5 bg-slate-100 dark:bg-slate-900 rounded-full text-sm font-bold tracking-wide text-slate-600 dark:text-slate-400">
                                    {edu.dateLabel || 'Graduated'}: {edu.graduationDate}
                                </span>
                                {edu.gpa && <p className="text-slate-500 mt-2 font-medium">GPA: {edu.gpa.toFixed(1)}</p>}
                            </div>
                        </div>

                        {edu.description && (
                            <p className="text-slate-600 dark:text-slate-400 mb-8 italic leading-relaxed text-lg max-w-4xl border-l-4 border-slate-200 dark:border-slate-800 pl-6">
                                {edu.description}
                            </p>
                        )}

                        {/* Categorized Coursework (Dropdowns) */}
                        {edu.categorizedCoursework && Object.keys(edu.categorizedCoursework).length > 0 && (
                            <div className="mb-8 bg-slate-50/50 dark:bg-slate-900/20 p-6 rounded-xl border border-slate-100 dark:border-slate-800/50">
                                <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                    Detailed Coursework Breakdown
                                </h4>
                                <div className="space-y-3">
                                    {Object.entries(edu.categorizedCoursework).map(([category, courses]) => (
                                        <details key={category} className="group border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950/50 overflow-hidden transition-all duration-300">
                                            <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors list-none select-none">
                                                <span className="font-semibold text-slate-700 dark:text-slate-300">{category}</span>
                                                <span className="text-slate-400 group-open:rotate-180 transition-transform duration-300">
                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </span>
                                            </summary>
                                            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/10">
                                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
                                                    {courses.map((course, idx) => (
                                                        <li key={idx} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-3">
                                                            <span className="text-blue-500/50 mt-1">•</span>
                                                            <span className="leading-relaxed">{course}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </details>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Flat Relevant Coursework (Legacy or Simple) */}
                        {edu.relevantCoursework && edu.relevantCoursework.length > 0 && (
                            <div className="mb-8">
                                <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-widest text-xs mb-4">Core Focus Areas</h4>
                                <div className="flex flex-wrap gap-2">
                                    {edu.relevantCoursework.map((course) => (
                                        <span
                                            key={course}
                                            className="px-4 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium border border-blue-100/50 dark:border-blue-800/30 shadow-sm"
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
                                <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-widest text-xs mb-4">Academic Highlights</h4>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {edu.achievements.map((achievement, idx) => (
                                        <li key={idx} className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl text-slate-700 dark:text-slate-300 text-sm font-medium border border-slate-100 dark:border-slate-800/50">
                                            <span className="text-green-500 bg-green-500/10 p-1 rounded-full">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M13.3333 4L5.99999 11.3333L2.66666 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </span>
                                            {achievement}
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