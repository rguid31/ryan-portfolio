import { getEducation, getCertifications } from '@/lib/masterReport';
import NeuromorphicCard from '@/components/neuromorphic/NeuromorphicCard';
import NeuromorphicButton from '@/components/neuromorphic/NeuromorphicButton';

export const metadata = {
    title: 'Education | Ryan Guidry',
    description: 'My academic background and professional certifications.',
};

export default async function EducationPage() {
    const [education, certifications] = await Promise.all([
        getEducation(),
        getCertifications()
    ]);

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-[#e0e5ec] dark:bg-[#1a1c23] transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-extrabold text-gray-800 dark:text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                        Education
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        Academic achievements and continuous learning.
                    </p>
                </div>

                <div className="space-y-12">
                    {/* Degrees Section */}
                    <section>
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Degrees</h2>
                        <div className="space-y-6">
                            {education.map((edu, index) => (
                                <NeuromorphicCard key={index}>
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{edu.institution}</h3>
                                            <p className="text-lg text-blue-600 dark:text-blue-400 font-medium">{edu.degree} in {edu.field}</p>
                                        </div>
                                        <div className="mt-2 md:mt-0 text-right">
                                            <p className="text-gray-600 dark:text-gray-400 font-medium">{edu.dateLabel || 'Graduated'}: {edu.graduationDate}</p>
                                            {edu.gpa && <p className="text-sm text-gray-500 dark:text-gray-400">GPA: {edu.gpa}</p>}
                                        </div>
                                    </div>
                                    {edu.description && (
                                        <p className="text-gray-700 dark:text-gray-300 mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                                            {edu.description}
                                        </p>
                                    )}
                                </NeuromorphicCard>
                            ))}
                        </div>
                    </section>
                </div>

                <hr className="my-16 border-gray-300 dark:border-gray-700 opacity-50" />

                <div className="space-y-12">
                    {/* Certifications Section */}
                    <section>
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Certifications</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {certifications.map((cert, index) => (
                                <NeuromorphicCard key={index} className="h-full">
                                    <div className="flex flex-col h-full justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{cert.name}</h3>
                                                <span className={`px-2 py-1 text-xs rounded-full ${cert.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                                    {cert.status}
                                                </span>
                                            </div>
                                            <p className="text-blue-600 dark:text-blue-400 font-medium text-sm mb-4">{cert.issuer}</p>
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                                            <span>Issued: {cert.issueDate}</span>
                                            {cert.expirationDate && <span>Expires: {cert.expirationDate}</span>}
                                        </div>
                                    </div>
                                </NeuromorphicCard>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="text-center mt-16">
                    <NeuromorphicButton href="/">
                        ← Back to Home
                    </NeuromorphicButton>
                </div>
            </div>
        </div>
    );
}