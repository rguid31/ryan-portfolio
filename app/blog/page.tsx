import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import NeuromorphicCard from '@/components/neuromorphic/NeuromorphicCard';
import NeuromorphicButton from '@/components/neuromorphic/NeuromorphicButton';

export const metadata = {
    title: 'Blog | Ryan Guidry',
    description: 'Thoughts on AI/ML, web development, mathematics, and building data-driven systems.',
};

interface BlogPost {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
    category: string;
}

const blogPosts: BlogPost[] = [
    {
        slug: 'building-digital-twin-portfolio',
        title: 'Building a Digital Twin Portfolio: From JSON to Production',
        excerpt: 'How I built a self-documenting, data-driven portfolio using Next.js 16, React 19, and a single source of truth JSON architecture.',
        date: '2026-02-10',
        readTime: '8 min read',
        category: 'Web Development',
    },
    {
        slug: 'ai-discoverability-seo',
        title: 'Making Your Portfolio AI-Discoverable: JSON-LD, Sitemaps, and Structured Data',
        excerpt: 'A comprehensive guide to implementing Schema.org markup, dynamic sitemaps, and API endpoints for maximum AI crawler accessibility.',
        date: '2026-02-09',
        readTime: '10 min read',
        category: 'AI/ML',
    },
    {
        slug: 'mathematics-chemical-engineering',
        title: 'From Chemical Engineering to Mathematics: A Career Pivot Story',
        excerpt: 'Why I switched from chemical engineering to mathematics after 131 credits, and what I learned about following intellectual curiosity.',
        date: '2026-02-05',
        readTime: '6 min read',
        category: 'Personal',
    },
    {
        slug: 'next-js-16-async-params',
        title: 'Next.js 16 Breaking Change: Async Params and Dynamic Routes',
        excerpt: 'How the params prop became a Promise in Next.js 16, and how to fix 404 errors in dynamic routes.',
        date: '2026-02-01',
        readTime: '5 min read',
        category: 'Web Development',
    },
];

function BlogPostCard({ post }: { post: BlogPost }) {
    return (
        <Link href={`/blog/${post.slug}`} className="block group">
            <NeuromorphicCard className="hover:scale-[1.02] transition-transform duration-300">
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.7)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5),inset_-2px_-2px_4px_rgba(255,255,255,0.05)]">
                        {post.category}
                    </span>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <time dateTime={post.date}>
                            {new Date(post.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </time>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime}</span>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {post.title}
                </h2>

                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {post.excerpt}
                </p>

                <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:gap-3 transition-all">
                    Read more
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
            </NeuromorphicCard>
        </Link>
    );
}

export default function BlogPage() {
    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-[#e0e5ec] dark:bg-[#1a1c23] transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-extrabold text-gray-800 dark:text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                        Blog
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Thoughts on AI/ML, web development, mathematics, and building data-driven systems.
                    </p>
                </div>

                {/* Blog Posts */}
                <div className="space-y-8">
                    {blogPosts.map((post) => (
                        <BlogPostCard key={post.slug} post={post} />
                    ))}
                </div>

                {/* Empty State for Future */}
                <div className="mt-16 text-center">
                    <NeuromorphicCard className="p-12 border-none">
                        <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
                            More posts coming soon! Subscribe to stay updated.
                        </p>
                        <NeuromorphicButton href="/">
                            ← Back to Home
                        </NeuromorphicButton>
                    </NeuromorphicCard>
                </div>
            </div>
        </div>
    );
}
