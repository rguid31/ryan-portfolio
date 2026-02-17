import { getFeaturedProjects, getSummary, getPersonalInfo } from '@/lib/masterReport';
import { generatePersonSchema, generateWebSiteSchema } from '@/lib/structuredData';
import { getPortfolioStats } from '@/lib/stats';
import ProjectCard from '@/components/ProjectCard';
import StatsCard from '@/components/StatsCard';
import Philosophy from '@/components/Philosophy';
import Link from 'next/link';
import { Briefcase, Code, GraduationCap, Award, FolderGit2, Star, ArrowRight } from 'lucide-react';

export default async function HomePage() {
  const [summary, personal, featuredProjects, stats] = await Promise.all([
    getSummary(),
    getPersonalInfo(),
    getFeaturedProjects(),
    getPortfolioStats()
  ]);

  const personSchema = await generatePersonSchema();
  const websiteSchema = generateWebSiteSchema();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-gray-900 dark:text-white">
              {personal.fullName}
            </h1>
            <p className="text-2xl md:text-3xl font-medium text-blue-600 dark:text-blue-400 mb-6">
              {summary.headline}
            </p>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-2xl">
              {summary.tagline}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/projects"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                aria-label="View Projects"
              >
                View Projects
              </Link>
              <Link
                href={`mailto:${personal.contact.email}`}
                className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                aria-label="Contact Me"
              >
                Contact Me
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <Philosophy />

      {/* Stats Dashboard */}
      <section className="py-20 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Portfolio at a Glance
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
              Key metrics from my professional and academic journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatsCard
              icon={FolderGit2}
              value={stats.totalProjects}
              label="Total Projects"
              subtext="Full-stack & AI/ML"
            />
            <StatsCard
              icon={Star}
              value={stats.featuredProjects}
              label="Featured Projects"
              subtext="Top portfolio pieces"
            />
            <StatsCard
              icon={Briefcase}
              value={`${stats.yearsExperience}+`}
              label="Years Experience"
              subtext="Professional & Academic"
            />
            <StatsCard
              icon={Code}
              value={stats.totalSkills}
              label="Technical Skills"
              subtext="Across all categories"
            />
            <StatsCard
              icon={GraduationCap}
              value={`${stats.educationProgress.percentage}%`}
              label="Degree Progress"
              subtext={`${stats.educationProgress.completed}/${stats.educationProgress.total} credits`}
            />
            <StatsCard
              icon={Award}
              value={stats.activeCertifications}
              label="Active Certifications"
              subtext="Professional credentials"
            />
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Featured Projects</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                A selection of my best work in AI/ML and full-stack development.
              </p>
            </div>
            <div className="hidden md:block">
              <Link
                href="/projects"
                className="inline-flex items-center font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                aria-label="View all projects"
              >
                View All Projects <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          <div className="text-center md:hidden">
            <Link
              href="/projects"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label="View all projects"
            >
              View All Projects
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
