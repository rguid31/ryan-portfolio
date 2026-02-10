import { getFeaturedProjects, getSummary, getPersonalInfo } from '@/lib/masterReport';
import { generatePersonSchema, generateWebSiteSchema } from '@/lib/structuredData';
import { getPortfolioStats } from '@/lib/stats';
import ProjectCard from '@/components/ProjectCard';
import StatsCard from '@/components/StatsCard';
import Link from 'next/link';
import { Briefcase, Code, GraduationCap, Award, FolderGit2, Star } from 'lucide-react';

export default function HomePage() {
  const summary = getSummary();
  const personal = getPersonalInfo();
  const featuredProjects = getFeaturedProjects();
  const stats = getPortfolioStats();

  const personSchema = generatePersonSchema();
  const websiteSchema = generateWebSiteSchema();

  return (
    <div>
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
      <section className="container mx-auto px-4 py-24">
        <h1 className="text-6xl font-bold mb-6">{personal.fullName}</h1>
        <p className="text-2xl text-gray-600 mb-4">{summary.headline}</p>
        <p className="text-xl text-gray-500 mb-8">{summary.tagline}</p>
        <p className="text-lg text-gray-700 max-w-3xl mb-8">{summary.description}</p>

        <div className="flex gap-4">
          <Link
            href="/projects"
            className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-lg font-medium"
          >
            View Projects
          </Link>
          <a
            href={`mailto:${personal.contact.email}`}
            className="px-8 py-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-lg font-medium"
          >
            Contact Me
          </a>
        </div>
      </section>

      {/* Stats Dashboard */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Portfolio at a Glance
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Self-documenting metrics from the Digital Twin architecture
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatsCard
            icon={FolderGit2}
            value={stats.totalProjects}
            label="Total Projects"
            description="Full-stack, AI/ML, and automation projects"
          />
          <StatsCard
            icon={Star}
            value={stats.featuredProjects}
            label="Featured Projects"
            description="Highlighted portfolio pieces"
          />
          <StatsCard
            icon={Briefcase}
            value={`${stats.yearsExperience}+`}
            label="Years Experience"
            description="Professional and academic experience"
          />
          <StatsCard
            icon={Code}
            value={stats.totalSkills}
            label="Technical Skills"
            description="Across all technology categories"
          />
          <StatsCard
            icon={GraduationCap}
            value={`${stats.educationProgress.percentage}%`}
            label="Degree Progress"
            description={`${stats.educationProgress.completed}/${stats.educationProgress.total} credits complete`}
          />
          <StatsCard
            icon={Award}
            value={stats.activeCertifications}
            label="Active Certifications"
            description="Professional credentials"
          />
        </div>
      </section>

      {/* Featured Projects */}
      <section className="bg-gray-50 py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4">Featured Projects</h2>
          <p className="text-xl text-gray-600 mb-12">
            Showcasing {featuredProjects.length} projects demonstrating AI/ML, full-stack development, and modern web technologies.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/projects"
              className="inline-block px-8 py-4 border border-gray-300 rounded-lg hover:bg-white transition text-lg font-medium"
            >
              View All Projects →
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
