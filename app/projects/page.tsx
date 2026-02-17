import { getProjects } from '@/lib/masterReport';
import ProjectCard from '@/components/ProjectCard';
import NeuromorphicButton from '@/components/neuromorphic/NeuromorphicButton';

export const metadata = {
  title: 'Projects | Ryan Guidry',
  description: 'Showcase of my software engineering projects, featuring AI/ML, full-stack web apps, and data engineering solutions.',
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-[#e0e5ec] dark:bg-[#1a1c23] transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-gray-800 dark:text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Projects
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            A comprehensive list of my work, ranging from enterprise-grade applications to experimental AI implementations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <div className="text-center mt-16">
          <NeuromorphicButton href="/">
            ← Back to Home
          </NeuromorphicButton>
        </div>
      </div>
    </div>
  );
}
