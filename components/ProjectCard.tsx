import Image from 'next/image';
import Link from 'next/link';
import { Github, Globe, ArrowRight } from 'lucide-react';
import type { Project } from '@/lib/types';

export default function ProjectCard({ project }: { project: Project }) {
  const imageSrc = project.images && project.images.length > 0 ? project.images[0] : "/images/placeholder-project.png";

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full">
      <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-900">
        <Image
          src={imageSrc}
          alt={project.projectName}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
          {project.projectName}
        </h3>

        <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow line-clamp-3">
          {project.shortDescription}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.techStack?.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800"
            >
              {tech}
            </span>
          ))}
          {project.techStack && project.techStack.length > 3 && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
              +{project.techStack.length - 3}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
          <div className="flex gap-3">
            {project.repoURL && (
              <a
                href={project.repoURL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                aria-label="View Source Code"
              >
                <Github size={20} />
              </a>
            )}
            {project.projectURL && (
              <a
                href={project.projectURL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                aria-label="View Live Demo"
              >
                <Globe size={20} />
              </a>
            )}
          </div>

          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            Details <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
