import { getProjects } from '@/lib/masterReport';
import ProjectCard from '@/components/ProjectCard';

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-4">Projects</h1>
      <p className="text-xl text-gray-600 mb-12">
        A collection of {projects.length} projects showcasing AI/ML, full-stack development, and automation.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
