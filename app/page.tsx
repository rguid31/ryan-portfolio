import { getFeaturedProjects, getSummary, getPersonalInfo } from '@/lib/masterReport';
import { generatePersonSchema, generateWebSiteSchema } from '@/lib/structuredData';
import ProjectCard from '@/components/ProjectCard';
import Link from 'next/link';

export default function HomePage() {
  const summary = getSummary();
  const personal = getPersonalInfo();
  const featuredProjects = getFeaturedProjects();

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
