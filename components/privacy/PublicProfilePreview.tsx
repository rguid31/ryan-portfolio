'use client';

import { PublicProfile } from '@/lib/truth-engine/types';

export interface PublicProfilePreviewProps {
  profile: PublicProfile | null;
  isLoading?: boolean;
}

export function PublicProfilePreview({ profile, isLoading = false }: PublicProfilePreviewProps) {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <svg
            className="w-12 h-12 mx-auto mb-4 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          <p className="text-sm">No public data to preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="flex items-start gap-4">
          {profile.identity.image && (
            <img
              src={profile.identity.image}
              alt={profile.identity.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          )}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {profile.identity.name}
            </h2>
            {profile.identity.headline && (
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                {profile.identity.headline}
              </p>
            )}
            {profile.identity.location && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
                {[
                  profile.identity.location.city,
                  profile.identity.location.region,
                  profile.identity.location.country
                ].filter(Boolean).join(', ')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      {profile.identity.summary && (
        <section>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">About</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {profile.identity.summary}
          </p>
        </section>
      )}

      {/* Contact */}
      {profile.contact && (profile.contact.publicEmail || profile.contact.phone) && (
        <section>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Contact</h3>
          <div className="space-y-1 text-sm">
            {profile.contact.publicEmail && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={`mailto:${profile.contact.publicEmail}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                  {profile.contact.publicEmail}
                </a>
              </div>
            )}
            {profile.contact.phone && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">{profile.contact.phone}</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Links */}
      {profile.links && (profile.links.website || (profile.links.sameAs && profile.links.sameAs.length > 0)) && (
        <section>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Links</h3>
          <div className="space-y-1">
            {profile.links.website && (
              <a
                href={profile.links.website}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                {profile.links.website}
              </a>
            )}
            {profile.links.sameAs?.map((url, index) => (
              <a
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                {url}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {profile.experience && profile.experience.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Experience</h3>
          <div className="space-y-4">
            {profile.experience.map((exp, index) => (
              <div key={index} className="border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">{exp.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{exp.organization}</p>
                {exp.location && (
                  <p className="text-xs text-gray-500 dark:text-gray-500">{exp.location}</p>
                )}
                {(exp.startDate || exp.endDate || exp.isCurrent) && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate || 'Present'}
                  </p>
                )}
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {exp.highlights.map((highlight, hIndex) => (
                      <li key={hIndex} className="text-xs text-gray-700 dark:text-gray-300">
                        • {highlight}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {profile.education && profile.education.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Education</h3>
          <div className="space-y-3">
            {profile.education.map((edu, index) => (
              <div key={index}>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">{edu.institution}</h4>
                {edu.degree && <p className="text-sm text-gray-600 dark:text-gray-400">{edu.degree}</p>}
                {edu.program && <p className="text-sm text-gray-600 dark:text-gray-400">{edu.program}</p>}
                {(edu.startDate || edu.endDate) && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {edu.startDate} - {edu.endDate || 'Present'}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {profile.skills && profile.skills.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Skills</h3>
          <div className="space-y-3">
            {profile.skills.map((skillGroup, index) => (
              <div key={index}>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {skillGroup.category}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.items.map((skill, sIndex) => (
                    <span
                      key={sIndex}
                      className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {profile.projects && profile.projects.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Projects</h3>
          <div className="space-y-4">
            {profile.projects.map((project, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">{project.name}</h4>
                {project.description && (
                  <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{project.description}</p>
                )}
                {project.tech && project.tech.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {project.tech.map((tech, tIndex) => (
                      <span
                        key={tIndex}
                        className="inline-flex items-center px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-2 flex gap-3 text-xs">
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View Project
                    </a>
                  )}
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View Code
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
