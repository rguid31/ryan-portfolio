import { getPortfolioStats } from '@/lib/stats';
import NeuromorphicCard from '@/components/neuromorphic/NeuromorphicCard';
import NeuromorphicButton from '@/components/neuromorphic/NeuromorphicButton';
import Link from 'next/link';
import { Activity, Code, Cpu, Layers, Database, Globe } from 'lucide-react';

export const metadata = {
    title: 'Explore | Ryan Guidry',
    description: 'Interactive neuromorphic dashboard visualizing portfolio analytics and exploration data.',
};

export default async function ExplorePage() {
    const stats = await getPortfolioStats();
    const metrics = stats.exploration;

    return (
        <div className="min-h-screen bg-[#e0e5ec] dark:bg-[#1a1c23] text-gray-700 dark:text-gray-300 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-12 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                        Explore
                    </h1>
                    <p className="text-lg opacity-80 max-w-2xl">
                        Neuromorphic analytics dashboard visualizing the depth and breadth of my portfolio exploration.
                    </p>
                </div>

                {/* Top Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    <NeuromorphicCard className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-[#e0e5ec] dark:bg-[#1a1c23] shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff] dark:shadow-[inset_4px_4px_8px_#121318,inset_-4px_-4px_8px_#22252e]">
                            <Code className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <div className="text-3xl font-bold">{metrics.projects.total}</div>
                            <div className="text-sm font-medium opacity-60">Total Projects</div>
                        </div>
                    </NeuromorphicCard>

                    <NeuromorphicCard className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-[#e0e5ec] dark:bg-[#1a1c23] shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff] dark:shadow-[inset_4px_4px_8px_#121318,inset_-4px_-4px_8px_#22252e]">
                            <Cpu className="w-6 h-6 text-purple-500" />
                        </div>
                        <div>
                            <div className="text-3xl font-bold">{metrics.skills.total}</div>
                            <div className="text-sm font-medium opacity-60">Tech Skills</div>
                        </div>
                    </NeuromorphicCard>

                    <NeuromorphicCard className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-[#e0e5ec] dark:bg-[#1a1c23] shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff] dark:shadow-[inset_4px_4px_8px_#121318,inset_-4px_-4px_8px_#22252e]">
                            <Layers className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                            <div className="text-3xl font-bold">{metrics.experience.totalYears}+</div>
                            <div className="text-sm font-medium opacity-60">Years Exp</div>
                        </div>
                    </NeuromorphicCard>

                    <NeuromorphicCard className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-[#e0e5ec] dark:bg-[#1a1c23] shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff] dark:shadow-[inset_4px_4px_8px_#121318,inset_-4px_-4px_8px_#22252e]">
                            <Globe className="w-6 h-6 text-amber-500" />
                        </div>
                        <div>
                            <div className="text-3xl font-bold">{metrics.knowledge.activeCertifications}</div>
                            <div className="text-sm font-medium opacity-60">Active Certs</div>
                        </div>
                    </NeuromorphicCard>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Project Distribution */}
                    <div className="lg:col-span-2">
                        <NeuromorphicCard className="h-full">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Database className="w-5 h-5 text-blue-500" />
                                Project Categories
                            </h2>
                            <div className="space-y-6">
                                {Object.entries(metrics.projects.byCategory).map(([category, count]) => (
                                    <div key={category}>
                                        <div className="flex justify-between mb-2">
                                            <span className="font-medium">{category}</span>
                                            <span className="opacity-60">{count} projects</span>
                                        </div>
                                        <div className="h-4 w-full bg-[#e0e5ec] dark:bg-[#1a1c23] rounded-full overflow-hidden shadow-[inset_3px_3px_6px_#b8b9be,inset_-3px_-3px_6px_#ffffff] dark:shadow-[inset_3px_3px_6px_#121318,inset_-3px_-3px_6px_#22252e]">
                                            <div
                                                className="h-full bg-blue-500 rounded-full"
                                                style={{ width: `${(count / metrics.projects.total) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </NeuromorphicCard>
                    </div>

                    {/* Skill Breakdown */}
                    <div className="lg:col-span-1">
                        <NeuromorphicCard className="h-full">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-purple-500" />
                                Skill Distribution
                            </h2>
                            <div className="space-y-4">
                                {Object.entries(metrics.skills.byCategory).map(([category, count]) => (
                                    <div key={category} className="flex items-center justify-between p-3 rounded-xl bg-[#e0e5ec] dark:bg-[#1a1c23] shadow-[5px_5px_10px_#b8b9be,-5px_-5px_10px_#ffffff] dark:shadow-[5px_5px_10px_#121318,-5px_-5px_10px_#22252e]">
                                        <span className="text-sm font-medium truncate pr-4">{category}</span>
                                        <span className="text-xs font-bold px-2 py-1 rounded bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                            {count}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </NeuromorphicCard>
                    </div>

                </div>

                {/* Action Buttons */}
                <div className="mt-12 flex flex-wrap gap-6 justify-center">
                    <NeuromorphicButton href="/projects">
                        View All Projects
                    </NeuromorphicButton>
                    <NeuromorphicButton href="/skills">
                        Explore Skills
                    </NeuromorphicButton>
                    <NeuromorphicButton href="/">
                        Return Home
                    </NeuromorphicButton>
                </div>

            </div>
        </div>
    );
}
