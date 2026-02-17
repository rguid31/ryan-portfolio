import { getExperience } from '@/lib/masterReport';
import NeuromorphicCard from '@/components/neuromorphic/NeuromorphicCard';
import NeuromorphicButton from '@/components/neuromorphic/NeuromorphicButton';

export const metadata = {
    title: 'Experience | Ryan Guidry',
    description: 'My professional journey in software engineering, data science, and chemical engineering.',
};

export default async function ExperiencePage() {
    const experience = await getExperience();

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-[#e0e5ec] dark:bg-[#1a1c23] transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-extrabold text-gray-800 dark:text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                        Experience
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        My professional journey through engineering, data science, and software development.
                    </p>
                </div>

                <div className="space-y-8">
                    {experience.map((job, index) => (
                        <NeuromorphicCard key={index} className="flex flex-col md:flex-row gap-6 hover:scale-[1.01] transition-transform duration-300">
                            <div className="md:w-1/4 flex-shrink-0">
                                <div className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                    {job.startDate} — {job.endDate}
                                </div>
                                <div className="text-lg font-bold text-gray-800 dark:text-white">
                                    {job.company}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    {job.location}
                                </div>
                            </div>

                            <div className="md:w-3/4">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    {job.title}
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-line">
                                    {job.responsibilities}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {job.skills?.slice(0, 6).map((skill) => (
                                        <span key={skill} className="px-2 py-1 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </NeuromorphicCard>
                    ))}
                </div>
            </div>
        </div>
    );
}