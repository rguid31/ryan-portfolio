'use client';

import { useEffect, useState } from 'react';
import { PublicProfile, CanonicalProfile, VisibilitySettings } from '@/lib/truth-engine/types';

interface PublishPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  profile: CanonicalProfile;
  visibility: VisibilitySettings;
  isPublishing: boolean;
}

export function PublishPreviewModal({
  isOpen,
  onClose,
  onConfirm,
  profile,
  visibility,
  isPublishing
}: PublishPreviewModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Generate preview of what will be public
  const publicSections = Object.entries(visibility.sections)
    .filter(([_, level]) => level === 'public')
    .map(([section]) => section);

  const hasPII = (visibility.overrides['/contact/emails'] === 'public' ||
                  visibility.overrides['/contact/phone'] === 'public');

  const stats = {
    name: profile.identity.name,
    handle: profile.handle,
    sections: publicSections.length,
    experience: visibility.sections.experience === 'public' ? (profile.experience?.length || 0) : 0,
    education: visibility.sections.education === 'public' ? (profile.education?.length || 0) : 0,
    skills: visibility.sections.skills === 'public' ? (profile.skills?.reduce((sum, cat) => sum + cat.items.length, 0) || 0) : 0,
    projects: visibility.sections.projects === 'public' ? (profile.projects?.length || 0) : 0,
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="publish-preview-title"
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2
                id="publish-preview-title"
                className="text-2xl font-bold text-gray-900 dark:text-white"
              >
                Ready to Publish?
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Review what will be publicly visible before publishing
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Profile Summary */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white text-xl font-bold">
                {profile.identity.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {stats.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  @{stats.handle}
                </p>
              </div>
            </div>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Your profile will be published at: <strong>/u/{stats.handle}</strong>
            </p>
          </div>

          {/* Public Content Stats */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              What's Being Published
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                icon="📊"
                label="Public Sections"
                value={stats.sections}
                active={stats.sections > 0}
              />
              <StatCard
                icon="💼"
                label="Experience"
                value={stats.experience}
                active={stats.experience > 0}
              />
              <StatCard
                icon="🎓"
                label="Education"
                value={stats.education}
                active={stats.education > 0}
              />
              <StatCard
                icon="⚡"
                label="Skills"
                value={stats.skills}
                active={stats.skills > 0}
              />
              <StatCard
                icon="🚀"
                label="Projects"
                value={stats.projects}
                active={stats.projects > 0}
              />
              <StatCard
                icon="🔗"
                label="Links"
                value={visibility.sections.links === 'public' ? 1 : 0}
                active={visibility.sections.links === 'public'}
              />
            </div>
          </div>

          {/* Public Sections List */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Public Sections:
            </h3>
            <div className="flex flex-wrap gap-2">
              {publicSections.length > 0 ? (
                publicSections.map(section => (
                  <span
                    key={section}
                    className="inline-flex items-center px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm"
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  No sections are public yet
                </span>
              )}
            </div>
          </div>

          {/* PII Warning */}
          {hasPII && (
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <h4 className="text-sm font-semibold text-orange-900 dark:text-orange-200">
                    Contact Information Public
                  </h4>
                  <p className="mt-1 text-sm text-orange-800 dark:text-orange-300">
                    You've chosen to publish contact information. This may increase spam or unwanted contact.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Reminder */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Privacy Reminders:
            </h4>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Private notes are never published</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>You can update or unpublish anytime</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Only selected sections will be visible</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-6 flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isPublishing}
            className="px-6 py-3 text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPublishing || stats.sections === 0}
            className="px-6 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center gap-2"
          >
            {isPublishing ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Publishing...
              </>
            ) : (
              <>
                Publish Profile
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  active
}: {
  icon: string;
  label: string;
  value: number;
  active: boolean;
}) {
  return (
    <div
      className={`
        p-3 rounded-lg border transition-all
        ${active
          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
          : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
        }
      `}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{icon}</span>
        <span className={`text-2xl font-bold ${active ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
          {value}
        </span>
      </div>
      <p className={`text-xs ${active ? 'text-green-700 dark:text-green-300' : 'text-gray-500 dark:text-gray-400'}`}>
        {label}
      </p>
    </div>
  );
}
