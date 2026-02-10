'use client';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && (
        <div className="mb-4 text-6xl opacity-50">
          {icon}
        </div>
      )}

      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>

      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
        {description}
      </p>

      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3">
          {action && (
            <button
              onClick={action.onClick}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {action.label}
            </button>
          )}

          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Preset empty states for common scenarios
export function DashboardEmptyState({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <EmptyState
      icon="🎯"
      title="Let's Build Your Profile"
      description="Your profile is empty. Start by adding your basic information, then build out your experience, skills, and projects to create a complete professional profile."
      action={{
        label: "Get Started",
        onClick: onGetStarted
      }}
    />
  );
}

export function SectionEmptyState({
  section,
  onAdd
}: {
  section: 'experience' | 'education' | 'skills' | 'projects' | 'links';
  onAdd: () => void;
}) {
  const content = {
    experience: {
      icon: "💼",
      title: "No Experience Added",
      description: "Add your work history to showcase your professional journey and accomplishments."
    },
    education: {
      icon: "🎓",
      title: "No Education Added",
      description: "Add your educational background, degrees, and certifications."
    },
    skills: {
      icon: "⚡",
      title: "No Skills Added",
      description: "List your technical and professional skills to highlight your expertise."
    },
    projects: {
      icon: "🚀",
      title: "No Projects Added",
      description: "Showcase your portfolio projects and side work to demonstrate your abilities."
    },
    links: {
      icon: "🔗",
      title: "No Links Added",
      description: "Add your website and social media profiles to help people connect with you."
    }
  };

  const { icon, title, description } = content[section];

  return (
    <EmptyState
      icon={icon}
      title={title}
      description={description}
      action={{
        label: `Add ${section.charAt(0).toUpperCase() + section.slice(1)}`,
        onClick: onAdd
      }}
    />
  );
}
