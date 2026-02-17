import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import NeuromorphicCard from '@/components/neuromorphic/NeuromorphicCard';
import NeuromorphicButton from '@/components/neuromorphic/NeuromorphicButton';

interface BlogPostPageProps {
    params: {
        slug: string;
    };
}

// Placeholder blog posts data
const blogPosts: Record<string, {
    title: string;
    date: string;
    readTime: string;
    category: string;
    content: string;
}> = {
    'building-digital-twin-portfolio': {
        title: 'Building a Digital Twin Portfolio: From JSON to Production',
        date: '2026-02-10',
        readTime: '8 min read',
        category: 'Web Development',
        content: `
# Building a Digital Twin Portfolio

## The Concept

Most portfolios are static HTML pages that require manual updates across multiple files. I wanted something different—a **"Digital Twin"** architecture where a single JSON file serves as the source of truth for my entire professional identity.

## The Architecture

\`\`\`typescript
// Single source of truth
public/data/master_report.json

// Typed data layer
lib/masterReport.ts
lib/types.ts

// Next.js App Router
app/projects/[slug]/page.tsx
app/experience/page.tsx
\`\`\`

## Key Benefits

1. **Single Update Point** - Change data once, update everywhere
2. **Type Safety** - Full TypeScript coverage
3. **Static Generation** - Blazing fast page loads
4. **API-Ready** - Expose data via clean endpoints

## Implementation Details

The portfolio uses Next.js 16 with React 19, leveraging Server Components for zero client-side JavaScript on content pages. All project pages are statically generated at build time using \`generateStaticParams\`.

## Lessons Learned

- Next.js 16 changed \`params\` to be a Promise (breaking change!)
- JSON-LD structured data is crucial for AI discoverability
- Dynamic sitemaps improve SEO significantly

*This is a placeholder post. Full content coming soon!*
    `,
    },
    'ai-discoverability-seo': {
        title: 'Making Your Portfolio AI-Discoverable: JSON-LD, Sitemaps, and Structured Data',
        date: '2026-02-09',
        readTime: '10 min read',
        category: 'AI/ML',
        content: `
# AI Discoverability & SEO

## Why It Matters

In 2026, AI chat interfaces like ChatGPT, Claude, and Perplexity are major traffic sources. Making your portfolio discoverable by AI crawlers is no longer optional—it's essential.

## Implementation Checklist

### 1. JSON-LD Structured Data

\`\`\`typescript
// Person schema for homepage
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Ryan Guidry",
  "jobTitle": "AI/ML Engineer",
  // ...
}
\`\`\`

### 2. Dynamic Sitemap

Create \`app/sitemap.ts\` to auto-generate your sitemap with all routes.

### 3. Robots.txt

Explicitly allow AI crawlers:
- GPTBot (ChatGPT)
- Claude-Web (Claude)
- PerplexityBot (Perplexity)

### 4. Clean API Endpoints

Expose \`/api/resume\` and \`/api/projects\` for programmatic access.

## Results

After implementation:
- ✅ Indexed by ChatGPT within 48 hours
- ✅ Appearing in Perplexity search results
- ✅ Rich snippets in Google search

*This is a placeholder post. Full content coming soon!*
    `,
    },
    'mathematics-chemical-engineering': {
        title: 'From Chemical Engineering to Mathematics: A Career Pivot Story',
        date: '2026-02-05',
        readTime: '6 min read',
        category: 'Personal',
        content: `
# From Chemical Engineering to Mathematics

## The Decision

After completing 131 out of 139 credits in Chemical Engineering at LSU, I made a difficult decision: switch to Mathematics.

## Why the Change?

1. **Intellectual Curiosity** - Math felt more fundamental
2. **AI/ML Interest** - Strong mathematical foundation is crucial
3. **Problem-Solving** - Pure logic and abstraction appealed to me

## What I Learned

- Sunk cost fallacy is real, but following passion is worth it
- Chemical engineering taught me systems thinking
- Mathematics is teaching me rigorous proof-based reasoning

## The Future

Now pursuing a B.S. in Mathematics with a secondary discipline in Chemical Engineering, combining the best of both worlds.

*This is a placeholder post. Full content coming soon!*
    `,
    },
    'next-js-16-async-params': {
        title: 'Next.js 16 Breaking Change: Async Params and Dynamic Routes',
        date: '2026-02-01',
        readTime: '5 min read',
        category: 'Web Development',
        content: `
# Next.js 16: Async Params Breaking Change

## The Problem

After upgrading to Next.js 16, all my project detail pages started returning 404 errors.

## The Cause

In Next.js 16, the \`params\` prop in dynamic routes is now a **Promise**.

### Before (Next.js 15)
\`\`\`typescript
export default function Page({ params }: Props) {
  const project = getProjectBySlug(params.slug);
  // ...
}
\`\`\`

### After (Next.js 16)
\`\`\`typescript
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  // ...
}
\`\`\`

## The Fix

1. Make the component \`async\`
2. \`await\` the params
3. Destructure the slug

## Lesson Learned

Always check the migration guide when upgrading major versions!

*This is a placeholder post. Full content coming soon!*
    `,
    },
};

export async function generateStaticParams() {
    return Object.keys(blogPosts).map((slug) => ({
        slug,
    }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;
    const post = blogPosts[slug];

    if (!post) {
        notFound();
    }

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-[#e0e5ec] dark:bg-[#1a1c23] transition-colors duration-300">
            <article className="max-w-3xl mx-auto">
                {/* Back Button */}
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors mb-8 font-medium"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Blog
                </Link>

                {/* Header */}
                <header className="mb-12">
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

                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-white mb-4 leading-tight">
                        {post.title}
                    </h1>
                </header>

                {/* Content */}
                <NeuromorphicCard className="p-8 md:p-12 mb-12">
                    <div className="prose prose-lg dark:prose-invert prose-slate max-w-none">
                        <div className="whitespace-pre-wrap">{post.content}</div>
                    </div>
                </NeuromorphicCard>

                {/* Footer */}
                <footer className="border-t border-gray-300 dark:border-gray-700 pt-8 mt-12">
                    <NeuromorphicButton href="/blog">
                        ← Back to all posts
                    </NeuromorphicButton>
                </footer>
            </article>
        </div>
    );
}
