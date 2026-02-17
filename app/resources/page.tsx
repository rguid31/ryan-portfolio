import Link from 'next/link';
import { ExternalLink, BookOpen, Code, Brain, Users, Wrench, Download } from 'lucide-react';
import NeuromorphicCard from '@/components/neuromorphic/NeuromorphicCard';
import NeuromorphicButton from '@/components/neuromorphic/NeuromorphicButton';

export const metadata = {
    title: 'Resources | Ryan Guidry',
    description: 'Curated resources for AI/ML, engineering, mathematics, and influential thought leaders.',
};

interface Resource {
    title: string;
    url: string;
    description: string;
    type?: string;
}

const resources = {
    aiml: [
        {
            title: 'Anthropic Claude',
            url: 'https://claude.ai',
            description: 'Advanced AI assistant for research, writing, and coding',
        },
        {
            title: 'OpenAI ChatGPT',
            url: 'https://chat.openai.com',
            description: 'Conversational AI for problem-solving and creative work',
        },
        {
            title: 'Hugging Face',
            url: 'https://huggingface.co',
            description: 'Open-source ML models, datasets, and tools',
        },
        {
            title: 'Papers with Code',
            url: 'https://paperswithcode.com',
            description: 'ML research papers with implementation code',
        },
        {
            title: 'Fast.ai',
            url: 'https://www.fast.ai',
            description: 'Practical deep learning courses and library',
        },
    ],
    engineering: [
        {
            title: 'Next.js Documentation',
            url: 'https://nextjs.org/docs',
            description: 'Official Next.js framework documentation',
        },
        {
            title: 'MDN Web Docs',
            url: 'https://developer.mozilla.org',
            description: 'Comprehensive web development documentation',
        },
        {
            title: 'Stack Overflow',
            url: 'https://stackoverflow.com',
            description: 'Developer Q&A community',
        },
        {
            title: 'GitHub',
            url: 'https://github.com',
            description: 'Code hosting and collaboration platform',
        },
        {
            title: 'Vercel',
            url: 'https://vercel.com',
            description: 'Deployment platform for modern web applications',
        },
    ],
    mathematics: [
        {
            title: '3Blue1Brown',
            url: 'https://www.3blue1brown.com',
            description: 'Visual mathematics explanations by Grant Sanderson',
        },
        {
            title: 'Khan Academy',
            url: 'https://www.khanacademy.org/math',
            description: 'Free mathematics courses from basics to advanced',
        },
        {
            title: 'Wolfram Alpha',
            url: 'https://www.wolframalpha.com',
            description: 'Computational knowledge engine for mathematics',
        },
        {
            title: 'MIT OpenCourseWare',
            url: 'https://ocw.mit.edu/courses/mathematics/',
            description: 'Free MIT mathematics course materials',
        },
        {
            title: 'Paul\'s Online Math Notes',
            url: 'https://tutorial.math.lamar.edu',
            description: 'Comprehensive calculus and differential equations notes',
        },
    ],
    personalities: [
        {
            title: 'Lex Fridman Podcast',
            url: 'https://lexfridman.com/podcast/',
            description: 'Deep conversations about AI, science, technology, and philosophy',
        },
        {
            title: 'Jordan Peterson YouTube',
            url: 'https://www.youtube.com/@JordanBPeterson',
            description: 'Psychology, philosophy, and personal development',
        },
        {
            title: 'Andrew Huberman Podcast',
            url: 'https://hubermanlab.com',
            description: 'Neuroscience and science-based tools for everyday life',
        },
        {
            title: 'Naval Ravikant',
            url: 'https://nav.al',
            description: 'Wisdom on wealth, happiness, and philosophy',
        },
        {
            title: 'Tim Ferriss Podcast',
            url: 'https://tim.blog/podcast/',
            description: 'Deconstructing world-class performers',
        },
    ],
    software: [
        {
            title: 'Mutaz.net',
            url: 'https://mutaz.net/free-programs/',
            description: 'Curated collection of free Windows software and utilities',
        },
        {
            title: 'AlternativeTo',
            url: 'https://alternativeto.net',
            description: 'Find free and open-source alternatives to popular software',
        },
        {
            title: 'Ninite',
            url: 'https://ninite.com',
            description: 'Install and update multiple free programs at once',
        },
        {
            title: 'SourceForge',
            url: 'https://sourceforge.net',
            description: 'Open-source software repository and distribution platform',
        },
        {
            title: 'F-Droid',
            url: 'https://f-droid.org',
            description: 'Free and open-source Android app repository',
        },
        {
            title: 'Open Source Alternative',
            url: 'https://www.opensourcealternative.to',
            description: 'Directory of open-source alternatives to proprietary software',
        },
    ],
    tools: [
        {
            title: 'VS Code',
            url: 'https://code.visualstudio.com',
            description: 'Powerful code editor with extensive extensions',
        },
        {
            title: 'Cursor',
            url: 'https://cursor.sh',
            description: 'AI-powered code editor',
        },
        {
            title: 'Figma',
            url: 'https://www.figma.com',
            description: 'Collaborative design and prototyping tool',
        },
        {
            title: 'Notion',
            url: 'https://www.notion.so',
            description: 'All-in-one workspace for notes and projects',
        },
        {
            title: 'Linear',
            url: 'https://linear.app',
            description: 'Modern issue tracking for software teams',
        },
    ],
};

function ResourceCard({ resource }: { resource: Resource }) {
    return (
        <a href={resource.url} target="_blank" rel="noopener noreferrer" className="block h-full group">
            <NeuromorphicCard className="h-full flex items-start justify-between hover:scale-[1.02] transition-transform duration-300">
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {resource.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {resource.description}
                    </p>
                </div>
                <div className="p-2 ml-4 rounded-full bg-[#e0e5ec] dark:bg-[#1a1c23] shadow-[inset_3px_3px_6px_#b8b9be,inset_-3px_-3px_6px_#ffffff] dark:shadow-[inset_3px_3px_6px_#121318,inset_-3px_-3px_6px_#22252e]">
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                </div>
            </NeuromorphicCard>
        </a>
    );
}

function ResourceSection({ title, icon: Icon, resources }: { title: string; icon: any; resources: Resource[] }) {
    return (
        <section className="mb-16">
            <div className="flex items-center gap-4 mb-8 pl-2">
                <div className="p-3 rounded-full bg-[#e0e5ec] dark:bg-[#1a1c23] shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff] dark:shadow-[inset_4px_4px_8px_#121318,inset_-4px_-4px_8px_#22252e]">
                    <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{title}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {resources.map((resource) => (
                    <ResourceCard key={resource.url} resource={resource} />
                ))}
            </div>
        </section>
    );
}

export default function ResourcesPage() {
    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-[#e0e5ec] dark:bg-[#1a1c23] text-gray-700 dark:text-gray-300 transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-extrabold text-gray-800 dark:text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                        Resources
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        Curated links to tools, courses, and thought leaders that have shaped my journey in AI, engineering, and mathematics.
                    </p>
                </div>

                {/* Resource Sections */}
                <ResourceSection title="AI & Machine Learning" icon={Brain} resources={resources.aiml} />
                <ResourceSection title="Engineering & Development" icon={Code} resources={resources.engineering} />
                <ResourceSection title="Mathematics" icon={BookOpen} resources={resources.mathematics} />
                <ResourceSection title="Influential Voices" icon={Users} resources={resources.personalities} />
                <ResourceSection title="Free & Open-Source Software" icon={Download} resources={resources.software} />
                <ResourceSection title="Tools & Utilities" icon={Wrench} resources={resources.tools} />

                {/* Back to Home */}
                <div className="text-center mt-16">
                    <NeuromorphicButton href="/">
                        ← Back to Home
                    </NeuromorphicButton>
                </div>
            </div>
        </div>
    );
}
