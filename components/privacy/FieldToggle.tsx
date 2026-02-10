'use client';

import { useState } from 'react';

export interface FieldToggleProps {
  field: string;
  label: string;
  description?: string;
  isPII: boolean;
  isPublic: boolean;
  onToggle: (field: string, newValue: boolean) => Promise<void> | void;
  disabled?: boolean;
}

export function FieldToggle({
  field,
  label,
  description,
  isPII,
  isPublic,
  onToggle,
  disabled = false
}: FieldToggleProps) {
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    if (disabled || isToggling) return;

    setIsToggling(true);
    try {
      await onToggle(field, !isPublic);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <label
            htmlFor={`toggle-${field}`}
            className="text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer"
          >
            {label}
          </label>
          {isPII && (
            <span
              className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 rounded"
              title="Personally Identifiable Information - requires confirmation"
            >
              PII
            </span>
          )}
        </div>
        {description && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>

      <button
        id={`toggle-${field}`}
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
        <span className="sr-only">{isPublic ? 'Make private' : 'Make public'}</span>
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
  );
}
