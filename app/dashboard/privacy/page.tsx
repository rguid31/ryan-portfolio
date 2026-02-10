'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  CanonicalProfile,
  VisibilitySettings,
  PublicProfile,
  DEFAULT_VISIBILITY
} from '@/lib/truth-engine/types';
import {
  FieldToggle,
  SectionToggle,
  PIIWarningModal,
  PublicProfilePreview,
  BulkActionButtons,
  PrivacySearchBox
} from '@/components/privacy';

export default function PrivacyControlDashboard() {
  const [profile, setProfile] = useState<CanonicalProfile | null>(null);
  const [visibility, setVisibility] = useState<VisibilitySettings>(DEFAULT_VISIBILITY);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showPIIModal, setShowPIIModal] = useState(false);
  const [pendingToggle, setPendingToggle] = useState<{ field: string; value: boolean } | null>(null);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load profile data
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await fetch('/api/profile/me');
      if (response.ok) {
        const data = await response.json();
        setProfile(data.draft);
        setVisibility(data.visibility || DEFAULT_VISIBILITY);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate public profile preview
  const publicProfile = useMemo<PublicProfile | null>(() => {
    if (!profile) return null;

    const pub: any = {
      schemaVersion: '1.0.0',
      handle: profile.handle,
      versionId: 'preview',
      lastUpdated: new Date().toISOString(),
      contentHash: 'preview',
      identity: visibility.sections.identity === 'public' ? {
        ...profile.identity,
        dateOfBirth: undefined // Always redact
      } : { name: profile.identity.name }
    };

    if (visibility.sections.links === 'public' && profile.links) {
      pub.links = profile.links;
    }

    if (visibility.sections.contact === 'public' && profile.contact) {
      pub.contact = {};
      const publicEmail = profile.contact.emails?.find(e => e.type === 'public');
      if (publicEmail && (visibility.overrides['/contact/emails'] === 'public' || visibility.sections.contact === 'public')) {
        pub.contact.publicEmail = publicEmail.email;
      }
      if (profile.contact.phone && visibility.overrides['/contact/phone'] === 'public') {
        pub.contact.phone = profile.contact.phone;
      }
      if (Object.keys(pub.contact).length === 0) {
        delete pub.contact;
      }
    }

    if (visibility.sections.experience === 'public' && profile.experience) {
      pub.experience = profile.experience.map(exp => {
        const { privateNotes, ...rest } = exp;
        return rest;
      });
    }

    if (visibility.sections.education === 'public' && profile.education) {
      pub.education = profile.education;
    }

    if (visibility.sections.skills === 'public' && profile.skills) {
      pub.skills = profile.skills;
    }

    if (visibility.sections.projects === 'public' && profile.projects) {
      pub.projects = profile.projects.map(proj => {
        const { privateNotes, role, highlights, ...rest } = proj;
        return rest;
      });
    }

    return pub;
  }, [profile, visibility]);

  // PII field detection
  const isPIIField = (field: string): boolean => {
    return [
      'contact/phone',
      'contact/emails',
      'identity/dateOfBirth',
      'address'
    ].some(pii => field.includes(pii));
  };

  const getPIIType = (field: string): 'email' | 'phone' | 'address' | 'dateOfBirth' | 'other' => {
    if (field.includes('email')) return 'email';
    if (field.includes('phone')) return 'phone';
    if (field.includes('address')) return 'address';
    if (field.includes('dateOfBirth')) return 'dateOfBirth';
    return 'other';
  };

  // Toggle handlers
  const handleToggle = (field: string, newValue: boolean) => {
    const isPII = isPIIField(field);

    // If making PII public, show warning
    if (isPII && newValue) {
      setPendingToggle({ field, value: newValue });
      setShowPIIModal(true);
      return;
    }

    applyToggle(field, newValue);
  };

  const applyToggle = (field: string, newValue: boolean) => {
    const newVisibility = { ...visibility };
    const level: 'public' | 'private' = newValue ? 'public' : 'private';

    // Handle section toggles
    if (field in visibility.sections) {
      newVisibility.sections = {
        ...newVisibility.sections,
        [field]: level
      };
    } else {
      // Handle field overrides
      const pointer = field.startsWith('/') ? field : `/${field.replace(/\//g, '/')}`;
      newVisibility.overrides = {
        ...newVisibility.overrides,
        [pointer]: level
      };
    }

    setVisibility(newVisibility);
    setHasChanges(true);
  };

  const handlePIIConfirm = () => {
    if (pendingToggle) {
      applyToggle(pendingToggle.field, pendingToggle.value);
    }
    setPendingToggle(null);
  };

  // Bulk actions
  const handlePublishAll = () => {
    const newVisibility: VisibilitySettings = {
      sections: {
        identity: 'public',
        links: 'public',
        experience: 'public',
        education: 'public',
        skills: 'public',
        projects: 'public',
        contact: 'private' // Keep contact private by default
      },
      overrides: {
        '/contact/emails': 'private',
        '/contact/phone': 'private'
      }
    };
    setVisibility(newVisibility);
    setHasChanges(true);
  };

  const handleHideAll = () => {
    const newVisibility: VisibilitySettings = {
      sections: {
        identity: 'private',
        links: 'private',
        experience: 'private',
        education: 'private',
        skills: 'private',
        projects: 'private',
        contact: 'private'
      },
      overrides: {}
    };
    setVisibility(newVisibility);
    setHasChanges(true);
  };

  const handlePublishSection = (section: string) => {
    const newVisibility = { ...visibility };
    newVisibility.sections = {
      ...newVisibility.sections,
      [section]: 'public'
    };
    setVisibility(newVisibility);
    setHasChanges(true);
  };

  const handleHideSection = (section: string) => {
    const newVisibility = { ...visibility };
    newVisibility.sections = {
      ...newVisibility.sections,
      [section]: 'private'
    };
    setVisibility(newVisibility);
    setHasChanges(true);
  };

  // Save changes
  const handleSave = async () => {
    if (!profile) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const response = await fetch('/api/profile/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draft: profile,
          visibility: visibility
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save changes');
      }

      setHasChanges(false);
      setSaveMessage({ type: 'success', text: 'Privacy settings saved successfully!' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Save error:', error);
      setSaveMessage({ type: 'error', text: 'Failed to save changes. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  // Filter fields based on search
  const matchesSearch = (text: string) => {
    if (!searchQuery) return true;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600 dark:text-gray-400">No profile found. Please create a profile first.</p>
          <button
            onClick={() => window.location.href = '/onboarding'}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Start Onboarding
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          {/* Header handled by Layout */}
        </div>

        {/* Save Message */}
        {saveMessage && (
          <div className={`mb-6 p-4 rounded-lg ${saveMessage.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
            }`}>
            {saveMessage.text}
          </div>
        )}

        {/* Split View Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Controls */}
          <div className="space-y-6">
            {/* Search */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <PrivacySearchBox onSearch={setSearchQuery} />
            </div>

            {/* Bulk Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Quick Actions
              </h2>
              <BulkActionButtons
                onPublishAll={handlePublishAll}
                onHideAll={handleHideAll}
                onPublishSection={handlePublishSection}
                onHideSection={handleHideSection}
                disabled={isSaving}
              />
            </div>

            {/* Section Controls */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Field Controls
              </h2>

              {/* Identity */}
              {matchesSearch('identity') && (
                <SectionToggle
                  section="identity"
                  label="Identity"
                  description="Your name, headline, summary, photo, and location"
                  isPublic={visibility.sections.identity === 'public'}
                  onToggle={handleToggle}
                />
              )}

              {/* Links */}
              {matchesSearch('links') && profile.links && (
                <SectionToggle
                  section="links"
                  label="Links"
                  description="Website and social media profiles"
                  isPublic={visibility.sections.links === 'public'}
                  itemCount={1 + (profile.links.sameAs?.length || 0)}
                  onToggle={handleToggle}
                />
              )}

              {/* Contact */}
              {matchesSearch('contact') && profile.contact && (
                <SectionToggle
                  section="contact"
                  label="Contact"
                  description="Email and phone number (PII - use caution)"
                  isPublic={visibility.sections.contact === 'public'}
                  onToggle={handleToggle}
                >
                  {profile.contact.emails?.filter(e => e.type === 'public').map((email, index) => (
                    <FieldToggle
                      key={index}
                      field="contact/emails"
                      label="Public Email"
                      description={email.email}
                      isPII={true}
                      isPublic={(visibility.overrides['/contact/emails'] || visibility.sections.contact) === 'public'}
                      onToggle={handleToggle}
                      disabled={visibility.sections.contact === 'private'}
                    />
                  ))}
                  {profile.contact.phone && (
                    <FieldToggle
                      field="contact/phone"
                      label="Phone Number"
                      description={profile.contact.phone}
                      isPII={true}
                      isPublic={(visibility.overrides['/contact/phone'] || visibility.sections.contact) === 'public'}
                      onToggle={handleToggle}
                      disabled={visibility.sections.contact === 'private'}
                    />
                  )}
                </SectionToggle>
              )}

              {/* Experience */}
              {matchesSearch('experience') && profile.experience && profile.experience.length > 0 && (
                <SectionToggle
                  section="experience"
                  label="Experience"
                  description="Your work history and accomplishments"
                  isPublic={visibility.sections.experience === 'public'}
                  itemCount={profile.experience.length}
                  onToggle={handleToggle}
                />
              )}

              {/* Education */}
              {matchesSearch('education') && profile.education && profile.education.length > 0 && (
                <SectionToggle
                  section="education"
                  label="Education"
                  description="Your academic background"
                  isPublic={visibility.sections.education === 'public'}
                  itemCount={profile.education.length}
                  onToggle={handleToggle}
                />
              )}

              {/* Skills */}
              {matchesSearch('skills') && profile.skills && profile.skills.length > 0 && (
                <SectionToggle
                  section="skills"
                  label="Skills"
                  description="Your technical and professional skills"
                  isPublic={visibility.sections.skills === 'public'}
                  itemCount={profile.skills.reduce((sum, cat) => sum + cat.items.length, 0)}
                  onToggle={handleToggle}
                />
              )}

              {/* Projects */}
              {matchesSearch('projects') && profile.projects && profile.projects.length > 0 && (
                <SectionToggle
                  section="projects"
                  label="Projects"
                  description="Your portfolio and side projects"
                  isPublic={visibility.sections.projects === 'public'}
                  itemCount={profile.projects.length}
                  onToggle={handleToggle}
                />
              )}
            </div>

            {/* Save Button */}
            <div className="sticky bottom-0 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <button
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
                className="w-full px-6 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                {isSaving ? 'Saving...' : hasChanges ? 'Save Changes' : 'No Changes'}
              </button>
              {hasChanges && (
                <p className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
                  You have unsaved changes
                </p>
              )}
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow h-full flex flex-col">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Public Profile Preview
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  This is what others will see
                </p>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <PublicProfilePreview profile={publicProfile} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PII Warning Modal */}
      <PIIWarningModal
        isOpen={showPIIModal}
        onClose={() => {
          setShowPIIModal(false);
          setPendingToggle(null);
        }}
        onConfirm={handlePIIConfirm}
        fieldLabel={pendingToggle?.field || ''}
        fieldType={pendingToggle ? getPIIType(pendingToggle.field) : 'other'}
      />
    </div>
  );
}
