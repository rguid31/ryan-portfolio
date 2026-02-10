'use client';

import { CanonicalProfile } from '@/lib/truth-engine/types';
import { useMemo } from 'react';

interface ProfileCompletionProps {
  profile: CanonicalProfile;
  onSectionClick?: (section: string) => void;
}

interface CompletionItem {
  section: string;
  label: string;
  completed: boolean;
  required: boolean;
  icon: string;
}

export function ProfileCompletion({ profile, onSectionClick }: ProfileCompletionProps) {
  const completionItems = useMemo<CompletionItem[]>(() => {
    return [
      {
        section: 'identity',
        label: 'Basic Info',
        completed: !!(profile.handle && profile.identity?.name && profile.identity?.headline),
        required: true,
        icon: '👤'
      },
      {
        section: 'identity',
        label: 'Profile Photo',
        completed: !!profile.identity?.image,
        required: false,
        icon: '📸'
      },
      {
        section: 'identity',
        label: 'Summary',
        completed: !!(profile.identity?.summary && profile.identity.summary.length > 50),
        required: false,
        icon: '📝'
      },
      {
        section: 'links',
        label: 'Links',
        completed: !!(profile.links?.website || profile.links?.sameAs?.length),
        required: false,
        icon: '🔗'
      },
      {
        section: 'experience',
        label: 'Experience',
        completed: !!(profile.experience && profile.experience.length > 0),
        required: false,
        icon: '💼'
      },
      {
        section: 'education',
        label: 'Education',
        completed: !!(profile.education && profile.education.length > 0),
        required: false,
        icon: '🎓'
      },
      {
        section: 'skills',
        label: 'Skills',
        completed: !!(profile.skills && profile.skills.length > 0),
        required: false,
        icon: '⚡'
      },
      {
        section: 'projects',
        label: 'Projects',
        completed: !!(profile.projects && profile.projects.length > 0),
        required: false,
        icon: '🚀'
      }
    ];
  }, [profile]);

  const completed = completionItems.filter(item => item.completed).length;
  const total = completionItems.length;
  const percentage = Math.round((completed / total) * 100);
  const requiredCompleted = completionItems.filter(item => item.required && item.completed).length;
  const requiredTotal = completionItems.filter(item => item.required).length;

  const isReadyToPublish = requiredCompleted === requiredTotal;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Profile Completion
        </h2>
        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          {percentage}%
        </span>
      </div>

      {/* Circular Progress */}
      <div className="flex items-center gap-6 mb-6">
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg className="transform -rotate-90 w-24 h-24">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - percentage / 100)}`}
              className="text-blue-600 dark:text-blue-400 transition-all duration-500 ease-out"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">
              {percentage === 100 ? '🎉' : percentage >= 75 ? '🌟' : percentage >= 50 ? '💪' : '🚀'}
            </span>
          </div>
        </div>

        <div className="flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {completed} of {total} sections completed
          </p>
          {!isReadyToPublish && (
            <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">
              Complete required fields to publish
            </p>
          )}
          {isReadyToPublish && percentage < 100 && (
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
              Ready to publish! Add more to stand out.
            </p>
          )}
          {percentage === 100 && (
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
              Profile complete! Looking great!
            </p>
          )}
        </div>
      </div>

      {/* Completion Checklist */}
      <div className="space-y-2">
        {completionItems.map((item, index) => (
          <button
            key={index}
            onClick={() => onSectionClick?.(item.section)}
            className={`
              w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all
              ${item.completed
                ? 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30'
                : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
              }
            `}
          >
            <span className="text-lg">{item.icon}</span>
            <span className={`
              flex-1 text-sm font-medium
              ${item.completed
                ? 'text-green-700 dark:text-green-300'
                : 'text-gray-700 dark:text-gray-300'
              }
            `}>
              {item.label}
              {item.required && (
                <span className="ml-1 text-xs text-red-500">*</span>
              )}
            </span>
            {item.completed ? (
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>
        ))}
      </div>

      {/* Motivational Message */}
      {percentage < 100 && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-xs text-blue-800 dark:text-blue-200">
            {percentage < 25 && "Just getting started! Fill out your basic info to make a great first impression."}
            {percentage >= 25 && percentage < 50 && "Good progress! Add your experience and skills to showcase your expertise."}
            {percentage >= 50 && percentage < 75 && "You're halfway there! Keep going to build a complete profile."}
            {percentage >= 75 && percentage < 100 && "Almost done! Just a few more sections to complete."}
          </p>
        </div>
      )}
    </div>
  );
}
