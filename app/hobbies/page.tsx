
import Image from 'next/image';
import Link from 'next/link';
import { getHobbies } from '@/lib/masterReport';
import { Hobby } from '@/lib/types';

export const metadata = {
    title: 'Hobbies & Interests | Ryan Guidry',
    description: 'Exploring the personal side of Ryan Guidry - from vinyl collecting to creative coding.',
};

export default async function HobbiesPage() {
    const hobbies = await getHobbies();

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
                        Hobbies & Interests
                    </h1>
                    <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500 dark:text-gray-400">
                        When I'm not building digital twins or analyzing data, here's what keeps me busy.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {hobbies.map((hobby: Hobby) => (
                        <div
                            key={hobby.id}
                            className="flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                        >
                            <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-700">
                                {hobby.image ? (
                                    <Image
                                        src={hobby.image}
                                        alt={hobby.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
                                        <span className="text-4xl">🎨</span>
                                    </div>
                                )}
                                <div className="absolute top-4 right-4">
                                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                        {hobby.category}
                                    </span>
                                </div>
                            </div>

                            <div className="flex-1 p-6 flex flex-col justify-between">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                        {hobby.name}
                                    </h3>
                                    <p className="text-base text-gray-500 dark:text-gray-400">
                                        {hobby.description}
                                    </p>
                                </div>

                                {hobby.url && (
                                    <div className="mt-6">
                                        <a
                                            href={hobby.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
                                        >
                                            {hobby.linkText || 'Check it out'}
                                            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
