'use client';

export interface BulkActionButtonsProps {
  onPublishAll: () => Promise<void> | void;
  onHideAll: () => Promise<void> | void;
  onPublishSection?: (section: string) => Promise<void> | void;
  onHideSection?: (section: string) => Promise<void> | void;
  disabled?: boolean;
}

export function BulkActionButtons({
  onPublishAll,
  onHideAll,
  onPublishSection,
  onHideSection,
  disabled = false
}: BulkActionButtonsProps) {
  const sections = [
    { id: 'identity', label: 'Identity' },
    { id: 'contact', label: 'Contact' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' }
  ];

  return (
    <div className="space-y-4">
      {/* Global Actions */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onPublishAll}
          disabled={disabled}
          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Publish All
          </div>
        </button>
        <button
          type="button"
          onClick={onHideAll}
          disabled={disabled}
          className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:bg-gray-100 disabled:cursor-not-allowed rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
            Hide All
          </div>
        </button>
      </div>

      {/* Section-Specific Actions */}
      {(onPublishSection || onHideSection) && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">
            By Section
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {sections.map((section) => (
              <div key={section.id} className="flex gap-1">
                {onPublishSection && (
                  <button
                    type="button"
                    onClick={() => onPublishSection(section.id)}
                    disabled={disabled}
                    className="flex-1 px-2 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 disabled:opacity-50 disabled:cursor-not-allowed rounded focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                    title={`Publish ${section.label}`}
                  >
                    <svg className="w-3 h-3 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                )}
                {onHideSection && (
                  <button
                    type="button"
                    onClick={() => onHideSection(section.id)}
                    disabled={disabled}
                    className="flex-1 px-2 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded focus:outline-none focus:ring-1 focus:ring-gray-500 transition-colors"
                    title={`Hide ${section.label}`}
                  >
                    <svg className="w-3 h-3 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  </button>
                )}
                <span className="text-xs text-gray-600 dark:text-gray-400 py-1.5">
                  {section.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
