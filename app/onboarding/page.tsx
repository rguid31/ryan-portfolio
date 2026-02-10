'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CanonicalProfile,
  VisibilitySettings,
  DEFAULT_VISIBILITY
} from '@/lib/truth-engine/types';
import { FieldToggle, SectionToggle, PIIWarningModal, PublicProfilePreview } from '@/components/privacy';

// Step components
function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="max-w-2xl mx-auto text-center space-y-6">
      <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        Welcome to Truth Engine
      </h1>

      <p className="text-lg text-gray-700 dark:text-gray-300">
        Take control of your professional data with privacy-first publishing.
      </p>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-left space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Privacy-First Principles
        </h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <strong className="text-gray-900 dark:text-gray-100">Everything Private by Default</strong>
              <p className="text-sm text-gray-600 dark:text-gray-400">Your data stays private unless you explicitly publish it.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <strong className="text-gray-900 dark:text-gray-100">Field-Level Control</strong>
              <p className="text-sm text-gray-600 dark:text-gray-400">Choose exactly which fields to share, down to individual items.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <strong className="text-gray-900 dark:text-gray-100">PII Protection</strong>
              <p className="text-sm text-gray-600 dark:text-gray-400">Extra warnings before publishing sensitive information like email or phone.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <strong className="text-gray-900 dark:text-gray-100">Change Anytime</strong>
              <p className="text-sm text-gray-600 dark:text-gray-400">Update your privacy settings whenever you want.</p>
            </div>
          </li>
        </ul>
      </div>

      <div className="space-y-3">
        <button
          onClick={onNext}
          className="w-full px-6 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Get Started
        </button>
        <button
          onClick={() => window.location.href = '/builder'}
          className="w-full px-6 py-3 text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
        >
          Skip for Now
        </button>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-500">
        This wizard takes about 5 minutes to complete
      </p>
    </div>
  );
}

function IdentityStep({
  profile,
  visibility,
  onUpdate,
  onNext,
  onBack
}: StepProps) {
  const [showPIIModal, setShowPIIModal] = useState(false);
  const [pendingField, setPendingField] = useState<string | null>(null);

  const handleToggle = async (field: string, newValue: boolean) => {
    // No PII in identity section for MVP
    const newVisibility = { ...visibility };
    if (field === 'identity') {
      newVisibility.sections.identity = newValue ? 'public' : 'private';
    }
    onUpdate(profile, newVisibility);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Identity</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Control what basic information about you is public. Your name will always be visible on your public profile.
        </p>
      </div>

      <div className="space-y-4">
        <SectionToggle
          section="identity"
          label="Identity Section"
          description="Your name, headline, bio, photo, and location"
          isPublic={visibility.sections.identity === 'public'}
          itemCount={1}
          onToggle={handleToggle}
        />

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Preview:</h3>
          <div className="text-sm space-y-2">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Name:</span>{' '}
              <span className="text-gray-900 dark:text-gray-100">{profile.identity.name}</span>
            </div>
            {profile.identity.headline && (
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Headline:</span>{' '}
                <span className="text-gray-900 dark:text-gray-100">{profile.identity.headline}</span>
              </div>
            )}
            {profile.identity.summary && (
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Summary:</span>{' '}
                <span className="text-gray-900 dark:text-gray-100">{profile.identity.summary.substring(0, 100)}...</span>
              </div>
            )}
            {profile.identity.location && (
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Location:</span>{' '}
                <span className="text-gray-900 dark:text-gray-100">
                  {[profile.identity.location.city, profile.identity.location.region, profile.identity.location.country].filter(Boolean).join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <StepNavigation onNext={onNext} onBack={onBack} />
    </div>
  );
}

function ContactStep({
  profile,
  visibility,
  onUpdate,
  onNext,
  onBack
}: StepProps) {
  const [showPIIModal, setShowPIIModal] = useState(false);
  const [pendingField, setPendingField] = useState<{ field: string; value: boolean } | null>(null);

  const handleToggle = async (field: string, newValue: boolean) => {
    const isPII = ['contact/phone', 'contact/emails'].includes(field);

    if (isPII && newValue) {
      setPendingField({ field, value: newValue });
      setShowPIIModal(true);
      return;
    }

    applyToggle(field, newValue);
  };

  const applyToggle = (field: string, newValue: boolean) => {
    const newVisibility = { ...visibility };

    if (field === 'contact') {
      newVisibility.sections.contact = newValue ? 'public' : 'private';
    } else if (field === 'contact/phone') {
      newVisibility.overrides['/contact/phone'] = newValue ? 'public' : 'private';
    } else if (field === 'contact/emails') {
      newVisibility.overrides['/contact/emails'] = newValue ? 'public' : 'private';
    }

    onUpdate(profile, newVisibility);
  };

  const handlePIIConfirm = () => {
    if (pendingField) {
      applyToggle(pendingField.field, pendingField.value);
    }
    setPendingField(null);
  };

  const publicEmail = profile.contact?.emails?.find(e => e.type === 'public');
  const hasPhone = !!profile.contact?.phone;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Contact Information</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Be careful with contact information. Publishing your email or phone may increase spam.
        </p>
      </div>

      <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h3 className="text-sm font-semibold text-orange-900 dark:text-orange-200">Recommended</h3>
            <p className="mt-1 text-sm text-orange-800 dark:text-orange-300">
              Keep all contact information private, or use a public email address created specifically for your profile.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <SectionToggle
          section="contact"
          label="Contact Section"
          description="Keep this private to avoid spam and unwanted contact"
          isPublic={visibility.sections.contact === 'public'}
          onToggle={handleToggle}
        >
          {publicEmail && (
            <FieldToggle
              field="contact/emails"
              label="Public Email"
              description={publicEmail.email}
              isPII={true}
              isPublic={(visibility.overrides['/contact/emails'] || visibility.sections.contact) === 'public'}
              onToggle={handleToggle}
              disabled={visibility.sections.contact === 'private'}
            />
          )}
          {hasPhone && (
            <FieldToggle
              field="contact/phone"
              label="Phone Number"
              description={profile.contact?.phone}
              isPII={true}
              isPublic={(visibility.overrides['/contact/phone'] || visibility.sections.contact) === 'public'}
              onToggle={handleToggle}
              disabled={visibility.sections.contact === 'private'}
            />
          )}
        </SectionToggle>
      </div>

      <PIIWarningModal
        isOpen={showPIIModal}
        onClose={() => {
          setShowPIIModal(false);
          setPendingField(null);
        }}
        onConfirm={handlePIIConfirm}
        fieldLabel={pendingField?.field === 'contact/phone' ? 'Phone Number' : 'Email Address'}
        fieldType={pendingField?.field === 'contact/phone' ? 'phone' : 'email'}
      />

      <StepNavigation onNext={onNext} onBack={onBack} />
    </div>
  );
}

function ExperienceStep({
  profile,
  visibility,
  onUpdate,
  onNext,
  onBack
}: StepProps) {
  const handleToggle = async (field: string, newValue: boolean) => {
    const newVisibility = { ...visibility };
    newVisibility.sections.experience = newValue ? 'public' : 'private';
    onUpdate(profile, newVisibility);
  };

  const experienceCount = profile.experience?.length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Work Experience</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Show your professional experience. Private notes are never published.
        </p>
      </div>

      <div className="space-y-4">
        <SectionToggle
          section="experience"
          label="Experience Section"
          description="Your work history and accomplishments"
          isPublic={visibility.sections.experience === 'public'}
          itemCount={experienceCount}
          onToggle={handleToggle}
        />

        {experienceCount > 0 && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Your Experience ({experienceCount} positions):
            </h3>
            <div className="space-y-2">
              {profile.experience?.slice(0, 3).map((exp, index) => (
                <div key={index} className="text-sm border-l-2 border-blue-500 pl-3">
                  <div className="font-medium text-gray-900 dark:text-gray-100">{exp.title}</div>
                  <div className="text-gray-600 dark:text-gray-400">{exp.organization}</div>
                </div>
              ))}
              {experienceCount > 3 && (
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  ...and {experienceCount - 3} more
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <StepNavigation onNext={onNext} onBack={onBack} />
    </div>
  );
}

function ProjectsStep({
  profile,
  visibility,
  onUpdate,
  onNext,
  onBack
}: StepProps) {
  const handleToggle = async (field: string, newValue: boolean) => {
    const newVisibility = { ...visibility };
    newVisibility.sections.projects = newValue ? 'public' : 'private';
    onUpdate(profile, newVisibility);
  };

  const projectCount = profile.projects?.length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Projects</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Showcase your work. Projects help demonstrate your skills and experience.
        </p>
      </div>

      <div className="space-y-4">
        <SectionToggle
          section="projects"
          label="Projects Section"
          description="Your portfolio projects and side work"
          isPublic={visibility.sections.projects === 'public'}
          itemCount={projectCount}
          onToggle={handleToggle}
        />

        {projectCount > 0 && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Your Projects ({projectCount}):
            </h3>
            <div className="space-y-3">
              {profile.projects?.slice(0, 3).map((project, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded p-3">
                  <div className="font-medium text-gray-900 dark:text-gray-100">{project.name}</div>
                  {project.description && (
                    <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                      {project.description.substring(0, 100)}...
                    </div>
                  )}
                  {project.tech && project.tech.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {project.tech.slice(0, 5).map((tech, tIndex) => (
                        <span
                          key={tIndex}
                          className="inline-flex items-center px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {projectCount > 3 && (
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  ...and {projectCount - 3} more
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <StepNavigation onNext={onNext} onBack={onBack} />
    </div>
  );
}

function SkillsEducationStep({
  profile,
  visibility,
  onUpdate,
  onNext,
  onBack
}: StepProps) {
  const handleToggle = async (field: string, newValue: boolean) => {
    const newVisibility = { ...visibility };
    if (field === 'skills') {
      newVisibility.sections.skills = newValue ? 'public' : 'private';
    } else if (field === 'education') {
      newVisibility.sections.education = newValue ? 'public' : 'private';
    }
    onUpdate(profile, newVisibility);
  };

  const skillCount = profile.skills?.reduce((sum, cat) => sum + cat.items.length, 0) || 0;
  const educationCount = profile.education?.length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Skills & Education</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Share your technical skills and educational background.
        </p>
      </div>

      <div className="space-y-4">
        <SectionToggle
          section="skills"
          label="Skills Section"
          description="Your technical and professional skills"
          isPublic={visibility.sections.skills === 'public'}
          itemCount={skillCount}
          onToggle={handleToggle}
        />

        <SectionToggle
          section="education"
          label="Education Section"
          description="Your academic background and certifications"
          isPublic={visibility.sections.education === 'public'}
          itemCount={educationCount}
          onToggle={handleToggle}
        />

        {skillCount > 0 && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Your Skills ({skillCount} total):
            </h3>
            <div className="space-y-2">
              {profile.skills?.slice(0, 3).map((skillGroup, index) => (
                <div key={index}>
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {skillGroup.category}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {skillGroup.items.slice(0, 8).map((skill, sIndex) => (
                      <span
                        key={sIndex}
                        className="inline-flex items-center px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <StepNavigation onNext={onNext} onBack={onBack} />
    </div>
  );
}

function ReviewStep({
  profile,
  visibility,
  onUpdate,
  onNext,
  onBack
}: StepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate preview of public profile
  const generatePublicProfile = () => {
    // This is a simplified preview - the actual privacy engine will do the full transformation
    const publicProfile: any = {
      schemaVersion: '1.0.0',
      handle: profile.handle,
      versionId: 'preview',
      lastUpdated: new Date().toISOString(),
      contentHash: 'preview',
      identity: visibility.sections.identity === 'public' ? profile.identity : { name: profile.identity.name }
    };

    if (visibility.sections.links === 'public' && profile.links) {
      publicProfile.links = profile.links;
    }

    if (visibility.sections.contact === 'public' && profile.contact) {
      publicProfile.contact = {};
      const publicEmail = profile.contact.emails?.find(e => e.type === 'public');
      if (publicEmail && visibility.overrides['/contact/emails'] === 'public') {
        publicProfile.contact.publicEmail = publicEmail.email;
      }
      if (profile.contact.phone && visibility.overrides['/contact/phone'] === 'public') {
        publicProfile.contact.phone = profile.contact.phone;
      }
    }

    if (visibility.sections.experience === 'public' && profile.experience) {
      publicProfile.experience = profile.experience.map(exp => {
        const { privateNotes, ...rest } = exp;
        return rest;
      });
    }

    if (visibility.sections.education === 'public' && profile.education) {
      publicProfile.education = profile.education;
    }

    if (visibility.sections.skills === 'public' && profile.skills) {
      publicProfile.skills = profile.skills;
    }

    if (visibility.sections.projects === 'public' && profile.projects) {
      publicProfile.projects = profile.projects.map(proj => {
        const { privateNotes, ...rest } = proj;
        return rest;
      });
    }

    return publicProfile;
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      // Save draft with visibility settings
      const response = await fetch('/api/profile/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draft: profile,
          visibility: visibility
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }

      // Redirect to dashboard
      window.location.href = '/builder';
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const publicSections = Object.entries(visibility.sections).filter(([_, v]) => v === 'public').map(([k]) => k);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Review & Confirm</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Review your privacy settings and preview your public profile.
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
          Privacy Summary
        </h3>
        <div className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
          <p><strong>Public Sections:</strong> {publicSections.length > 0 ? publicSections.join(', ') : 'None'}</p>
          <p><strong>Private by Default:</strong> All personal contact information</p>
        </div>
      </div>

      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Public Profile Preview
          </h3>
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
            This is what others will see when they view your profile
          </p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-900 max-h-96 overflow-y-auto">
          <PublicProfilePreview profile={generatePublicProfile()} />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleFinish}
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          {isSubmitting ? 'Saving...' : 'Save & Continue'}
        </button>
      </div>
    </div>
  );
}

function StepNavigation({
  onNext,
  onBack,
  nextLabel = 'Next',
  backLabel = 'Back'
}: {
  onNext: () => void;
  onBack?: () => void;
  nextLabel?: string;
  backLabel?: string;
}) {
  return (
    <div className="flex gap-3 pt-4">
      {onBack && (
        <button
          onClick={onBack}
          className="flex-1 px-6 py-3 text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
        >
          {backLabel}
        </button>
      )}
      <button
        onClick={onNext}
        className="flex-1 px-6 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        {nextLabel}
      </button>
    </div>
  );
}

interface StepProps {
  profile: CanonicalProfile;
  visibility: VisibilitySettings;
  onUpdate: (profile: CanonicalProfile, visibility: VisibilitySettings) => void;
  onNext: () => void;
  onBack?: () => void;
}

const STEPS = [
  { id: 'welcome', label: 'Welcome', component: WelcomeStep },
  { id: 'identity', label: 'Identity', component: IdentityStep },
  { id: 'contact', label: 'Contact', component: ContactStep },
  { id: 'experience', label: 'Experience', component: ExperienceStep },
  { id: 'projects', label: 'Projects', component: ProjectsStep },
  { id: 'skills', label: 'Skills & Education', component: SkillsEducationStep },
  { id: 'review', label: 'Review', component: ReviewStep }
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState<CanonicalProfile>({
    schemaVersion: '1.0.0',
    handle: 'sample-user',
    identity: {
      name: 'Sample User',
      headline: 'Professional Title',
      summary: 'A brief summary about yourself...',
      location: {
        city: 'City',
        region: 'State',
        country: 'Country'
      }
    }
  });
  const [visibility, setVisibility] = useState<VisibilitySettings>(DEFAULT_VISIBILITY);

  const handleUpdate = (newProfile: CanonicalProfile, newVisibility: VisibilitySettings) => {
    setProfile(newProfile);
    setVisibility(newVisibility);
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const CurrentStepComponent = STEPS[currentStep].component;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        {currentStep > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-3">
              <span className="font-medium">Step {currentStep} of {STEPS.length - 1}</span>
              <span className="text-blue-600 dark:text-blue-400 font-medium">{STEPS[currentStep].label}</span>
            </div>
            <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out shadow-sm"
                style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              {STEPS.slice(1).map((step, idx) => (
                <div
                  key={idx}
                  className={`text-xs transition-colors ${idx + 1 <= currentStep
                      ? 'text-blue-600 dark:text-blue-400 font-medium'
                      : 'text-gray-400 dark:text-gray-600'
                    }`}
                >
                  {idx + 1 < currentStep ? '✓' : idx + 1 === currentStep ? '●' : '○'}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transition-all duration-300 animate-fadeIn">
          <CurrentStepComponent
            profile={profile}
            visibility={visibility}
            onUpdate={handleUpdate}
            onNext={handleNext}
            onBack={currentStep > 1 ? handleBack : undefined}
          />
        </div>
      </div>
    </div>
  );
}
