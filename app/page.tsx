import { getFeaturedProjects, getSummary, getPersonalInfo } from '@/lib/masterReport';
import ProjectCard from '@/components/ProjectCard';
import Link from 'next/link';

export default function HomePage() {
  const summary = getSummary();
  const personal = getPersonalInfo();
  const featuredProjects = getFeaturedProjects();

  return (
    <div>
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

      {/* Truth Engine CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-blue-600 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Create Your Own Privacy-First Profile</h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Truth Engine lets you publish your professional profile with complete control over your data.
              Field-level privacy, structured data for SEO, and immutable versioning.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/onboarding"
                className="group px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 text-lg font-medium shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started Free
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
              <Link
                href="/u/ryan"
                className="px-8 py-4 bg-white text-gray-900 rounded-lg hover:bg-gray-50 transition text-lg font-medium border border-gray-200"
              >
                See Example Profile
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
