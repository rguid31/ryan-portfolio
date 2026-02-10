import Link from 'next/link';
import { Project } from '@/lib/types';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="block p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
    >
      <div className="mb-4">
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
          {project.category}
        </span>
        {project.featured && (
          <span className="ml-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
            Featured
          </span>
        )}
      </div>

      <h3 className="text-xl font-bold mb-2">{project.projectName}</h3>
      <p className="text-gray-600 mb-4 line-clamp-3">{project.shortDescription}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {project.techStack.slice(0, 3).map((tech) => (
          <span
            key={tech}
            className="px-2 py-1 bg-gray-100 rounded text-xs"
          >
            {tech}
          </span>
        ))}
        {project.techStack.length > 3 && (
          <span className="px-2 py-1 text-gray-500 text-xs">
            +{project.techStack.length - 3} more
          </span>
        )}
      </div>

      <div className="text-blue-600 font-medium text-sm">
        View Project →
      </div>
    </Link>
  );
}
