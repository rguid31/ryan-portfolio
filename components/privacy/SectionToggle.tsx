'use client';

import { useState } from 'react';

export interface SectionToggleProps {
  section: string;
  label: string;
  description?: string;
  isPublic: boolean;
  itemCount?: number;
  onToggle: (section: string, newValue: boolean) => Promise<void> | void;
  disabled?: boolean;
  children?: React.ReactNode;
}

export function SectionToggle({
  section,
  label,
  description,
  isPublic,
  itemCount,
  onToggle,
  disabled = false,
  children
}: SectionToggleProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    if (disabled || isToggling) return;

    setIsToggling(true);
    try {
      await onToggle(section, !isPublic);
    } finally {
      setIsToggling(false);
    }
  };

  const hasChildren = !!children;

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-3 flex-1">
          {hasChildren && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
            >
              <svg
                className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform ${
                  isExpanded ? 'transform rotate-90' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {label}
              </h3>
              {itemCount !== undefined && itemCount > 0 && (
                <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </span>
              )}
            </div>
            {description && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={isPublic}
          disabled={disabled || isToggling}
          onClick={handleToggle}
          className={`
            relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent
            transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            ${isPublic ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
            ${(disabled || isToggling) ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <span className="sr-only">{isPublic ? 'Make section private' : 'Make section public'}</span>
          <span
            aria-hidden="true"
            className={`
              pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0
              transition duration-200 ease-in-out
              ${isPublic ? 'translate-x-5' : 'translate-x-0'}
            `}
          />
        </button>
      </div>

      {hasChildren && isExpanded && (
        <div className="p-4 space-y-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          {children}
        </div>
      )}
    </div>
  );
}
