'use client';

import { useEffect } from 'react';

export interface PIIWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fieldLabel: string;
  fieldType: 'email' | 'phone' | 'address' | 'dateOfBirth' | 'other';
}

const PII_WARNINGS = {
  email: {
    title: 'Publish Email Address?',
    warning: 'Making your email address public will allow anyone to contact you and may increase spam.',
    risks: [
      'Spam and unsolicited emails',
      'Potential phishing attempts',
      'Email address harvesting by bots'
    ]
  },
  phone: {
    title: 'Publish Phone Number?',
    warning: 'Making your phone number public is not recommended. It may lead to unwanted calls and messages.',
    risks: [
      'Unwanted calls and text messages',
      'Potential harassment or scams',
      'Phone number harvesting by bots',
      'Loss of privacy'
    ]
  },
  address: {
    title: 'Publish Address?',
    warning: 'Publishing your street address is strongly discouraged for privacy and safety reasons.',
    risks: [
      'Physical safety concerns',
      'Identity theft risk',
      'Stalking or harassment',
      'Unwanted visitors'
    ]
  },
  dateOfBirth: {
    title: 'Publish Date of Birth?',
    warning: 'Your date of birth is sensitive information often used for identity verification.',
    risks: [
      'Identity theft risk',
      'Account takeover attempts',
      'Social engineering attacks'
    ]
  },
  other: {
    title: 'Publish Sensitive Information?',
    warning: 'This field contains personally identifiable information (PII).',
    risks: [
      'Privacy concerns',
      'Potential misuse of data'
    ]
  }
};

export function PIIWarningModal({
  isOpen,
  onClose,
  onConfirm,
  fieldLabel,
  fieldType
}: PIIWarningModalProps) {
  const warningContent = PII_WARNINGS[fieldType];

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

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pii-warning-title"
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-orange-50 dark:bg-orange-900/20 border-b border-orange-200 dark:border-orange-800 p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <svg
                className="w-6 h-6 text-orange-600 dark:text-orange-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3
                id="pii-warning-title"
                className="text-lg font-semibold text-gray-900 dark:text-gray-100"
              >
                {warningContent.title}
              </h3>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                Field: <span className="font-medium">{fieldLabel}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              {warningContent.warning}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Potential Risks:
            </h4>
            <ul className="space-y-2">
              {warningContent.risks.map((risk, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <svg
                    className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Recommendation:</strong> Consider using a public email address or contact form instead of
              publishing personal contact information.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
          >
            I Understand, Publish Anyway
          </button>
        </div>
      </div>
    </div>
  );
}
