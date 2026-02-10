'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import type { CanonicalProfile, VisibilitySettings, VisibilityLevel, ValidationResult } from '@/lib/truth-engine/types';
import { useToast, ToastContainer } from '@/components/ui/Toast';
import { ProfileCompletion } from '@/components/ui/ProfileCompletion';
import { DashboardEmptyState } from '@/components/ui/EmptyState';
import { PublishPreviewModal } from '@/components/ui/PublishPreviewModal';
import { DeployCard } from '@/components/ui/DeployCard';
import { GitHubImport } from '@/components/social/GitHubImport';

// ─── Default profile template ────────────────────────────────────

const DEFAULT_DRAFT: CanonicalProfile = {
    schemaVersion: '1.0.0',
    handle: '',
    identity: { name: '' },
};

const DEFAULT_VISIBILITY: VisibilitySettings = {
    sections: {
        identity: 'public',
        links: 'public',
        experience: 'public',
        education: 'public',
        skills: 'public',
        projects: 'public',
        contact: 'private',
    },
    overrides: {
        '/contact/emails': 'private',
        '/contact/phone': 'private',
    },
};

type Tab = 'identity' | 'links' | 'experience' | 'education' | 'skills' | 'projects' | 'contact';

const TABS: { key: Tab; label: string; icon: string }[] = [
    { key: 'identity', label: 'Identity', icon: '👤' },
    { key: 'links', label: 'Links', icon: '🔗' },
    { key: 'experience', label: 'Experience', icon: '💼' },
    { key: 'education', label: 'Education', icon: '🎓' },
    { key: 'skills', label: 'Skills', icon: '⚡' },
    { key: 'projects', label: 'Projects', icon: '🚀' },
    { key: 'contact', label: 'Contact', icon: '✉️' },
];

// ─── Main Dashboard Component ────────────────────────────────────

export default function DashboardPage() {
    const [draft, setDraft] = useState<CanonicalProfile>(DEFAULT_DRAFT);
    const [visibility, setVisibility] = useState<VisibilitySettings>(DEFAULT_VISIBILITY);
    const [activeTab, setActiveTab] = useState<Tab>('identity');
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');
    const [publishStatus, setPublishStatus] = useState<string | null>(null);
    const [vercelToken, setVercelToken] = useState('');
    const [deploying, setDeploying] = useState(false);
    const [liveUrl, setLiveUrl] = useState<string | null>(null);

    const handleHeadlessDeploy = async () => {
        if (!vercelToken) return;
        setDeploying(true);
        setPublishStatus('🚀 Mirroring to global edge...');
        try {
            const res = await fetch('/api/profile/deploy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ handle: draft.handle, vercelToken })
            });
            const data = await res.json();
            if (data.success) {
                setLiveUrl(data.url);
                setPublishStatus(`✅ Portal established! Your mirror is live at ${data.url}`);
            } else {
                setPublishStatus(`❌ Setup error: ${data.error}`);
            }
        } catch {
            setPublishStatus('❌ Deployment bridge failed.');
        } finally {
            setDeploying(false);
        }
    };
    const [validation, setValidation] = useState<ValidationResult | null>(null);
    const [profileMeta, setProfileMeta] = useState<{
        handle: string | null;
        published: boolean;
        latestPublished: { versionId: string; publishedAt: string } | null;
    }>({ handle: null, published: false, latestPublished: null });
    const [isAutofillOpen, setIsAutofillOpen] = useState(false);
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);

    const { toasts, showToast, removeToast, success, error, warning, info } = useToast();

    // ─── Auth + Load ─────────────────────────────────────────────

    const loadProfile = useCallback(async () => {
        try {
            const res = await fetch('/api/profile/me');
            if (res.status === 401) {
                setIsAuthenticated(false);
                return;
            }
            setIsAuthenticated(true);
            const data = await res.json();
            if (data.draft) setDraft(data.draft);
            if (data.visibility) setVisibility(data.visibility);
            setProfileMeta({
                handle: data.handle,
                published: data.published,
                latestPublished: data.latestPublished,
            });
        } catch {
            setIsAuthenticated(false);
        }
    }, []);

    useEffect(() => {
        loadProfile();
        // Check if this is first visit
        const hasVisited = localStorage.getItem('dashboard_visited');
        if (!hasVisited) {
            setShowWelcome(true);
            localStorage.setItem('dashboard_visited', 'true');
        }
    }, [loadProfile]);

    // ─── Save Draft ──────────────────────────────────────────────

    const saveDraft = async () => {
        setIsSaving(true);
        setSaveStatus('idle');
        try {
            const res = await fetch('/api/profile/draft', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ draft, visibility }),
            });
            const data = await res.json();
            if (res.ok) {
                setSaveStatus('saved');
                setValidation(data.validation);
                success('Draft saved successfully!');
                setTimeout(() => setSaveStatus('idle'), 3000);
            } else {
                setSaveStatus('error');
                error('Failed to save draft. Please try again.');
            }
        } catch {
            setSaveStatus('error');
            error('Network error. Please check your connection.');
        } finally {
            setIsSaving(false);
        }
    };

    // ─── Publish ─────────────────────────────────────────────────

    const handlePublishClick = () => {
        setShowPublishModal(true);
    };

    const publish = async () => {
        setIsPublishing(true);
        setPublishStatus(null);
        try {
            const res = await fetch('/api/profile/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ confirm: true }),
            });
            const data = await res.json();
            if (res.ok) {
                const isFirstPublish = !profileMeta.published;
                setPublishStatus(`✅ Published! View at /u/${data.handle}`);
                setProfileMeta(prev => ({
                    ...prev,
                    published: true,
                    handle: data.handle,
                    latestPublished: { versionId: data.versionId, publishedAt: data.publishedAt },
                }));
                setShowPublishModal(false);
                success(`Profile published successfully! ${isFirstPublish ? '🎉' : ''}`);
                if (isFirstPublish) {
                    setTimeout(() => {
                        info(`Share your profile: /u/${data.handle}`);
                    }, 2000);
                }
            } else {
                setPublishStatus(`❌ ${data.message}`);
                error(data.message || 'Failed to publish profile');
            }
        } catch {
            setPublishStatus('❌ Failed to publish.');
            error('Network error. Failed to publish.');
        } finally {
            setIsPublishing(false);
        }
    };

    // ─── Helpers ─────────────────────────────────────────────────

    const updateDraft = (path: string, value: unknown) => {
        setDraft(prev => {
            const next = JSON.parse(JSON.stringify(prev));
            const keys = path.split('.');
            let obj = next;
            for (let i = 0; i < keys.length - 1; i++) {
                if (!(keys[i] in obj)) obj[keys[i]] = {};
                obj = obj[keys[i]];
            }
            obj[keys[keys.length - 1]] = value;
            return next;
        });
    };

    const toggleSectionVisibility = (section: keyof VisibilitySettings['sections']) => {
        setVisibility(prev => ({
            ...prev,
            sections: {
                ...prev.sections,
                [section]: prev.sections[section] === 'public' ? 'private' : 'public',
            },
        }));
    };

    const handleAutofillApply = (data: Partial<CanonicalProfile>) => {
        setDraft(prev => {
            const next = { ...prev };
            if (data.identity) next.identity = { ...next.identity, ...data.identity };
            if (data.links) next.links = { ...next.links, ...data.links };
            if (data.contact) next.contact = { ...next.contact, ...data.contact };
            if (data.experience?.length) next.experience = data.experience;
            if (data.education?.length) next.education = data.education;
            if (data.skills?.length) next.skills = data.skills;
            if (data.projects?.length) next.projects = data.projects;
            return next;
        });
        setIsAutofillOpen(false);
    };

    // ─── Auth Gate ───────────────────────────────────────────────

    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="animate-pulse text-gray-400 text-lg">Loading...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <LoginRegisterForm onSuccess={loadProfile} />;
    }

    // ─── Main Dashboard ─────────────────────────────────────────

    return (
        <div className="min-h-screen bg-[#07090e] text-white selection:bg-indigo-500/30">
            {/* Top Navigation / Progress */}
            <div className="sticky top-0 z-40 bg-[#07090e]/80 backdrop-blur-xl border-b border-white/5 py-4">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-600/20">
                            TR
                        </div>
                        <div>
                            <h1 className="text-sm font-bold tracking-tight">ENGINE DASHBOARD</h1>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">System Online</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {profileMeta.handle && (
                            <Link
                                href={`/u/${profileMeta.handle}`}
                                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition-all bg-white/5 hover:bg-white/10 rounded-full border border-white/5"
                            >
                                🔗 VIEW PUBLIC PORTAL
                            </Link>
                        )}
                        <button
                            onClick={() => setIsAutofillOpen(true)}
                            className="px-5 py-2 text-xs font-black bg-indigo-600 text-white rounded-full hover:bg-indigo-500 transition shadow-xl shadow-indigo-600/20 flex items-center gap-2"
                        >
                            ✨ AI AUTOFILL
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Fast Track Area */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
                    <div className="md:col-span-4 flex flex-col gap-6">
                        <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 hover:border-white/20 transition-all group">
                            <h3 className="text-xs font-black text-slate-500 tracking-widest uppercase mb-4">Fast-Track Sourcing</h3>
                            <GitHubImport onImport={(data) => {
                                setDraft(prev => ({
                                    ...prev,
                                    identity: { ...prev.identity, ...data.identity },
                                    links: data.links || prev.links,
                                    projects: [...(data.projects || []), ...(prev.projects || [])],
                                }));
                                success('GitHub data imported!');
                                saveDraft();
                            }} />
                            <p className="mt-4 text-[11px] text-slate-500 leading-relaxed italic">
                                "Our engine will crawl your GitHub profile and auto-populate your project data instantly."
                            </p>
                        </div>

                        <div className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-950 rounded-[2rem] border border-white/5">
                            <h3 className="text-xs font-black text-slate-500 tracking-widest uppercase mb-4">Export Engine</h3>
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={async () => {
                                        const res = await fetch('https://raw.githubusercontent.com/rguid31/truth-engine-viewer/main/index.html');
                                        let html = await res.text();
                                        html = html.replace('VITE_PREFILL_HANDLE', profileMeta.handle || '');
                                        const blob = new Blob([html], { type: 'text/html' });
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = 'index.html';
                                        a.click();
                                    }}
                                    className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[11px] font-black tracking-widest uppercase transition border border-white/5"
                                >
                                    💾 DOWNLOAD STATIC MIRROR (.HTML)
                                </button>
                                <button
                                    onClick={() => {/* existing export logic */ }}
                                    className="w-full py-3 bg-white/5 hover:bg-white/10 text-slate-400 rounded-2xl text-[11px] font-black tracking-widest uppercase transition"
                                >
                                    📊 EXPORT RAW DATA (.JSON)
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-8">
                        {/* Portals / Deployment Card */}
                        <div className="h-full bg-gradient-to-br from-indigo-950 to-slate-950 rounded-[3rem] p-10 border border-white/10 relative overflow-hidden flex flex-col justify-center">
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -mr-64 -mt-64"></div>
                            <div className="relative z-10">
                                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-[10px] font-black tracking-widest uppercase mb-6 inline-block">Direct Global Bridge</span>
                                <h2 className="text-5xl font-black text-white mb-4 tracking-tighter leading-none">
                                    {liveUrl ? 'PORTAL ACTIVE' : 'ONE-CLICK PORTAL'}
                                </h2>
                                <p className="text-slate-400 text-lg mb-8 max-w-sm leading-relaxed">
                                    Mirror your Truth Engine directly to a global edge domain in seconds.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 max-w-md">
                                    {!liveUrl ? (
                                        <>
                                            <input
                                                type="password"
                                                placeholder="Enter Vercel API Token"
                                                className="flex-1 px-6 py-4 bg-white/10 border border-white/10 rounded-[1.5rem] text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all font-mono text-sm"
                                                value={vercelToken}
                                                onChange={(e) => setVercelToken(e.target.value)}
                                            />
                                            <button
                                                onClick={handleHeadlessDeploy}
                                                disabled={deploying || !vercelToken}
                                                className="px-10 py-4 bg-white text-black hover:bg-indigo-50 disabled:opacity-50 rounded-[1.5rem] font-black tracking-tighter transition-all shadow-2xl active:scale-95"
                                            >
                                                {deploying ? 'LAUNCHING...' : 'DEPOY NOW'}
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex flex-col gap-4 w-full">
                                            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                                                <span className="text-xs font-mono text-slate-500">{liveUrl}</span>
                                                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[8px] font-black rounded uppercase">Live</span>
                                            </div>
                                            <a
                                                href={liveUrl}
                                                target="_blank"
                                                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-center tracking-widest uppercase hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20"
                                            >
                                                🌌 OPEN GLOBAL PORTAL
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Validation Warnings */}
                {validation && !validation.isValid && (
                    <div className="mb-8 p-6 rounded-3xl bg-red-950/30 border border-red-500/20 backdrop-blur-md">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-red-500 text-xl font-bold">⚠️</span>
                            <p className="font-bold text-red-400 uppercase tracking-widest text-xs">Validation Payload Conflict</p>
                        </div>
                        <ul className="text-sm text-red-300/80 space-y-2 font-mono">
                            {validation.fields.map((f, i) => (
                                <li key={i} className="flex gap-2">
                                    <span className="text-red-500/50">[{i + 1}]</span>
                                    <span>{f.path}: {f.message}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <AutofillModal
                    isOpen={isAutofillOpen}
                    onClose={() => setIsAutofillOpen(false)}
                    onApply={handleAutofillApply}
                />

                <PublishPreviewModal
                    isOpen={showPublishModal}
                    onClose={() => setShowPublishModal(false)}
                    onConfirm={publish}
                    profile={draft}
                    visibility={visibility}
                    isPublishing={isPublishing}
                />

                {/* Welcome Modal */}
                {showWelcome && (
                    <WelcomeModal onClose={() => setShowWelcome(false)} />
                )}

                <div className="grid grid-cols-12 gap-8">
                    {/* Tab Navigation */}
                    <nav className="col-span-12 md:col-span-3">
                        <div className="bg-white/5 p-2 rounded-[2.5rem] border border-white/5 sticky top-24">
                            {TABS.map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`w-full flex items-center justify-between px-6 py-4 rounded-[1.8rem] text-sm font-bold transition-all ${activeTab === tab.key
                                        ? 'bg-white text-black shadow-xl scale-[1.02]'
                                        : 'text-slate-500 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg">{tab.icon}</span>
                                        <span className="tracking-tight">{tab.label}</span>
                                    </div>
                                    <VisibilityBadge level={visibility.sections[tab.key]} />
                                </button>
                            ))}
                        </div>
                    </nav>

                    {/* Editor Panel */}
                    <div className="col-span-12 md:col-span-9 flex flex-col gap-6">
                        <div className="bg-white/5 rounded-[3rem] border border-white/10 p-10 backdrop-blur-3xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>

                            {/* Section header */}
                            <div className="flex items-center justify-between mb-12">
                                <div>
                                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase">
                                        {TABS.find(t => t.key === activeTab)?.label}
                                    </h2>
                                    <p className="text-slate-500 text-xs font-mono mt-1">MODULE_EDIT_SEQUENCE // 0x{activeTab.toUpperCase()}</p>
                                </div>
                                <button
                                    onClick={() => toggleSectionVisibility(activeTab)}
                                    className={`px-6 py-2 text-xs font-black rounded-full transition-all border ${visibility.sections[activeTab] === 'public'
                                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                        : 'bg-white/5 text-slate-500 border-white/5'
                                        }`}
                                >
                                    {visibility.sections[activeTab] === 'public' ? '🔓 PUBLIC VIEW' : '🔒 PRIVATE DATA'}
                                </button>
                            </div>

                            {/* Tab Content */}
                            <div className="min-h-[400px]">
                                {activeTab === 'identity' && (
                                    <IdentityEditor draft={draft} updateDraft={updateDraft} />
                                )}
                                {activeTab === 'links' && (
                                    <LinksEditor draft={draft} updateDraft={updateDraft} />
                                )}
                                {activeTab === 'experience' && (
                                    <ExperienceEditor draft={draft} setDraft={setDraft} />
                                )}
                                {activeTab === 'education' && (
                                    <EducationEditor draft={draft} setDraft={setDraft} />
                                )}
                                {activeTab === 'skills' && (
                                    <SkillsEditor draft={draft} setDraft={setDraft} />
                                )}
                                {activeTab === 'projects' && (
                                    <ProjectsEditor draft={draft} setDraft={setDraft} />
                                )}
                                {activeTab === 'contact' && (
                                    <ContactEditor draft={draft} updateDraft={updateDraft} visibility={visibility} setVisibility={setVisibility} />
                                )}
                            </div>
                        </div>

                        {/* Action Bar */}
                        <div className="flex items-center justify-between bg-indigo-600 p-4 rounded-[2rem] shadow-2xl shadow-indigo-600/30">
                            <div className="flex items-center gap-3 pl-4">
                                <div className={`w-2 h-2 rounded-full ${saveStatus === 'saved' ? 'bg-white animate-ping' : 'bg-white/30'}`}></div>
                                <span className="text-[10px] font-black tracking-widest uppercase text-white/70">
                                    {saveStatus === 'saved' ? 'SYNC COMPLETE' : saveStatus === 'error' ? 'SYNC ERROR' : 'ENGINE READY'}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={saveDraft}
                                    disabled={isSaving}
                                    className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black text-xs tracking-widest transition-all"
                                >
                                    {isSaving ? 'SYNCING...' : 'SAVE DRAFT'}
                                </button>
                                <button
                                    onClick={handlePublishClick}
                                    disabled={isPublishing || !draft.handle || !draft.identity.name}
                                    className="px-12 py-3 bg-white text-indigo-600 rounded-2xl font-black text-xs tracking-widest transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                                >
                                    {profileMeta.published ? 'REPUBLISH' : 'PUBLISH'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast Notifications */}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
    );
}

// ─── Welcome Modal ───────────────────────────────────────────────

function WelcomeModal({ onClose }: { onClose: () => void }) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full p-8"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="text-center mb-6">
                    <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                        <span className="text-4xl">👋</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Welcome to Your Dashboard!
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Let's build your professional profile together
                    </p>
                </div>

                <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                            1
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                Fill Out Your Profile
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Start with basic info, then add your experience, skills, and projects. Watch your completion percentage grow!
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                            2
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                Control Your Privacy
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Choose what's public or private. You have full control over your data at all times.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                            3
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                Publish & Share
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                When you're ready, publish your profile and share it with the world!
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                    Get Started
                </button>
            </div>
        </div>
    );
}

// ─── Sub-Components ──────────────────────────────────────────────

function VisibilityBadge({ level }: { level: VisibilityLevel }) {
    return (
        <span className={`ml-auto text-xs px-1.5 py-0.5 rounded ${level === 'public'
            ? 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
            }`}>
            {level === 'public' ? '🔓' : '🔒'}
        </span>
    );
}

function FieldInput({ label, value, onChange, placeholder, type = 'text', maxLength, required, hint }: {
    label: string; value: string; onChange: (v: string) => void;
    placeholder?: string; type?: string; maxLength?: number; required?: boolean; hint?: string;
}) {
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    {label} {required && <span className="text-indigo-500">*</span>}
                </label>
                {hint && <span className="text-[9px] text-slate-600 font-mono italic">{hint}</span>}
            </div>
            <input
                type={type}
                value={value || ''}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                maxLength={maxLength}
                className="w-full px-6 py-4 rounded-2xl border border-white/5 bg-white/[0.03] text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:bg-white/[0.05] transition-all placeholder:text-slate-700"
            />
        </div>
    );
}

function TextArea({ label, value, onChange, placeholder, maxLength, rows = 4 }: {
    label: string; value: string; onChange: (v: string) => void;
    placeholder?: string; maxLength?: number; rows?: number;
}) {
    return (
        <div className="mb-8">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{label}</label>
            <textarea
                value={value || ''}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                maxLength={maxLength}
                rows={rows}
                className="w-full px-6 py-4 rounded-[2rem] border border-white/5 bg-white/[0.03] text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:bg-white/[0.05] transition-all resize-none placeholder:text-slate-700"
            />
            {maxLength && (
                <div className="flex justify-end mt-2">
                    <span className="text-[9px] font-mono text-slate-600">{(value || '').length} / {maxLength}</span>
                </div>
            )}
        </div>
    );
}

// ─── Section Editors ─────────────────────────────────────────────

function IdentityEditor({ draft, updateDraft }: { draft: CanonicalProfile; updateDraft: (p: string, v: unknown) => void }) {
    return (
        <div>
            <FieldInput label="Handle" value={draft.handle} onChange={v => updateDraft('handle', v.toLowerCase().replace(/[^a-z0-9-]/g, ''))} placeholder="your-handle" maxLength={30} required hint="3-30 characters, lowercase, letters, numbers, dashes" />
            <FieldInput label="Full Name" value={draft.identity.name} onChange={v => updateDraft('identity.name', v)} placeholder="Your Name" maxLength={120} required />
            <FieldInput label="Headline" value={draft.identity.headline || ''} onChange={v => updateDraft('identity.headline', v)} placeholder="e.g. Senior Software Engineer" maxLength={140} />
            <TextArea label="Summary" value={draft.identity.summary || ''} onChange={v => updateDraft('identity.summary', v)} placeholder="A brief professional summary..." maxLength={2000} />
            <FieldInput label="Profile Image URL" value={draft.identity.image || ''} onChange={v => updateDraft('identity.image', v)} placeholder="https://example.com/photo.jpg" type="url" />
            <div className="grid grid-cols-3 gap-4">
                <FieldInput label="City" value={draft.identity.location?.city || ''} onChange={v => updateDraft('identity.location.city', v)} maxLength={80} />
                <FieldInput label="Region / State" value={draft.identity.location?.region || ''} onChange={v => updateDraft('identity.location.region', v)} maxLength={80} />
                <FieldInput label="Country" value={draft.identity.location?.country || ''} onChange={v => updateDraft('identity.location.country', v)} maxLength={80} />
            </div>
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                    🔒 <strong>Date of Birth</strong> is always private and never included in your public profile.
                </p>
            </div>
        </div>
    );
}

function LinksEditor({ draft, updateDraft }: { draft: CanonicalProfile; updateDraft: (p: string, v: unknown) => void }) {
    const sameAs = draft.links?.sameAs || [];

    // EXPERT: Self-healing logic. If the draft has invalid properties (like 'social' from an old import bug), 
    // we strip them immediately to unblock publishing.
    useEffect(() => {
        if (draft.links) {
            const keys = Object.keys(draft.links);
            const validKeys = ['website', 'sameAs'];
            const hasInvalid = keys.some(k => !validKeys.includes(k));

            if (hasInvalid) {
                console.log('✨ Truth Engine: Self-healing profile links...');
                const cleaned: any = {};
                if (draft.links.website) cleaned.website = draft.links.website;
                if (draft.links.sameAs) cleaned.sameAs = draft.links.sameAs;
                updateDraft('links', cleaned);
            }
        }
    }, [draft.links, updateDraft]);

    return (
        <div>
            <FieldInput label="Website" value={draft.links?.website || ''} onChange={v => updateDraft('links.website', v)} placeholder="https://yoursite.com" type="url" />
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Social / Profile Links</label>
                {sameAs.map((url, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                        <input
                            type="url"
                            value={url}
                            onChange={e => {
                                const next = [...sameAs];
                                next[i] = e.target.value;
                                updateDraft('links.sameAs', next);
                            }}
                            placeholder="https://linkedin.com/in/..."
                            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                        <button
                            onClick={() => updateDraft('links.sameAs', sameAs.filter((_, j) => j !== i))}
                            className="px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm transition"
                        >
                            ✕
                        </button>
                    </div>
                ))}
                <button
                    onClick={() => updateDraft('links.sameAs', [...sameAs, ''])}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-1"
                >
                    + Add link
                </button>
            </div>
        </div>
    );
}

function ExperienceEditor({ draft, setDraft }: { draft: CanonicalProfile; setDraft: React.Dispatch<React.SetStateAction<CanonicalProfile>> }) {
    const entries = draft.experience || [];

    const addEntry = () => {
        setDraft(prev => ({
            ...prev,
            experience: [...(prev.experience || []), { organization: '', title: '' }],
        }));
    };

    const updateEntry = (i: number, field: string, value: unknown) => {
        setDraft(prev => {
            const next = [...(prev.experience || [])];
            (next[i] as Record<string, unknown>)[field] = value;
            return { ...prev, experience: next };
        });
    };

    const removeEntry = (i: number) => {
        setDraft(prev => ({
            ...prev,
            experience: (prev.experience || []).filter((_, j) => j !== i),
        }));
    };

    return (
        <div>
            {entries.map((exp, i) => (
                <div key={i} className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg relative">
                    <button
                        onClick={() => removeEntry(i)}
                        className="absolute top-3 right-3 text-red-400 hover:text-red-600 text-sm"
                    >✕</button>
                    <div className="grid grid-cols-2 gap-4">
                        <FieldInput label="Title" value={exp.title} onChange={v => updateEntry(i, 'title', v)} required maxLength={120} />
                        <FieldInput label="Organization" value={exp.organization} onChange={v => updateEntry(i, 'organization', v)} required maxLength={120} />
                    </div>
                    <FieldInput label="Location" value={exp.location || ''} onChange={v => updateEntry(i, 'location', v)} maxLength={120} />
                    <div className="grid grid-cols-3 gap-4">
                        <FieldInput label="Start Date" value={exp.startDate || ''} onChange={v => updateEntry(i, 'startDate', v)} type="date" />
                        <FieldInput label="End Date" value={exp.endDate || ''} onChange={v => updateEntry(i, 'endDate', v)} type="date" />
                        <div className="flex items-end mb-4">
                            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                <input type="checkbox" checked={exp.isCurrent || false} onChange={e => updateEntry(i, 'isCurrent', e.target.checked)} className="rounded" />
                                Current role
                            </label>
                        </div>
                    </div>
                </div>
            ))}
            <button onClick={addEntry} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                + Add experience
            </button>
        </div>
    );
}

function EducationEditor({ draft, setDraft }: { draft: CanonicalProfile; setDraft: React.Dispatch<React.SetStateAction<CanonicalProfile>> }) {
    const entries = draft.education || [];

    const addEntry = () => {
        setDraft(prev => ({
            ...prev,
            education: [...(prev.education || []), { institution: '' }],
        }));
    };

    const updateEntry = (i: number, field: string, value: unknown) => {
        setDraft(prev => {
            const next = [...(prev.education || [])];
            (next[i] as Record<string, unknown>)[field] = value;
            return { ...prev, education: next };
        });
    };

    const removeEntry = (i: number) => {
        setDraft(prev => ({
            ...prev,
            education: (prev.education || []).filter((_, j) => j !== i),
        }));
    };

    return (
        <div>
            {entries.map((edu, i) => (
                <div key={i} className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg relative">
                    <button onClick={() => removeEntry(i)} className="absolute top-3 right-3 text-red-400 hover:text-red-600 text-sm">✕</button>
                    <FieldInput label="Institution" value={edu.institution} onChange={v => updateEntry(i, 'institution', v)} required maxLength={140} />
                    <div className="grid grid-cols-2 gap-4">
                        <FieldInput label="Degree" value={edu.degree || ''} onChange={v => updateEntry(i, 'degree', v)} maxLength={140} />
                        <FieldInput label="Program" value={edu.program || ''} onChange={v => updateEntry(i, 'program', v)} maxLength={140} />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <FieldInput label="Start Date" value={edu.startDate || ''} onChange={v => updateEntry(i, 'startDate', v)} type="date" />
                        <FieldInput label="End Date" value={edu.endDate || ''} onChange={v => updateEntry(i, 'endDate', v)} type="date" />
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                            <select
                                value={edu.status || ''}
                                onChange={e => updateEntry(i, 'status', e.target.value || undefined)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            >
                                <option value="">—</option>
                                <option value="completed">Completed</option>
                                <option value="in-progress">In Progress</option>
                                <option value="incomplete">Incomplete</option>
                                <option value="withdrawn">Withdrawn</option>
                            </select>
                        </div>
                    </div>
                </div>
            ))}
            <button onClick={addEntry} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                + Add education
            </button>
        </div>
    );
}

function SkillsEditor({ draft, setDraft }: { draft: CanonicalProfile; setDraft: React.Dispatch<React.SetStateAction<CanonicalProfile>> }) {
    const categories = draft.skills || [];

    const addCategory = () => {
        setDraft(prev => ({
            ...prev,
            skills: [...(prev.skills || []), { category: '', items: [] }],
        }));
    };

    const updateCategory = (i: number, category: string) => {
        setDraft(prev => {
            const next = [...(prev.skills || [])];
            next[i] = { ...next[i], category };
            return { ...prev, skills: next };
        });
    };

    const updateItems = (i: number, itemsStr: string) => {
        setDraft(prev => {
            const next = [...(prev.skills || [])];
            next[i] = { ...next[i], items: itemsStr.split(',').map(s => s.trim()).filter(Boolean) };
            return { ...prev, skills: next };
        });
    };

    const removeCategory = (i: number) => {
        setDraft(prev => ({
            ...prev,
            skills: (prev.skills || []).filter((_, j) => j !== i),
        }));
    };

    return (
        <div>
            {categories.map((cat, i) => (
                <div key={i} className="mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg relative">
                    <button onClick={() => removeCategory(i)} className="absolute top-3 right-3 text-red-400 hover:text-red-600 text-sm">✕</button>
                    <FieldInput label="Category" value={cat.category} onChange={v => updateCategory(i, v)} required maxLength={80} />
                    <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Skills (comma-separated)</label>
                        <input
                            type="text"
                            value={cat.items.join(', ')}
                            onChange={e => updateItems(i, e.target.value)}
                            placeholder="TypeScript, React, Node.js..."
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                        {cat.items.map((item, j) => (
                            <span key={j} className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            ))}
            <button onClick={addCategory} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                + Add skill category
            </button>
        </div>
    );
}

function ProjectsEditor({ draft, setDraft }: { draft: CanonicalProfile; setDraft: React.Dispatch<React.SetStateAction<CanonicalProfile>> }) {
    const entries = draft.projects || [];

    const addEntry = () => {
        setDraft(prev => ({
            ...prev,
            projects: [...(prev.projects || []), { name: '' }],
        }));
    };

    const updateEntry = (i: number, field: string, value: unknown) => {
        setDraft(prev => {
            const next = [...(prev.projects || [])];
            (next[i] as Record<string, unknown>)[field] = value;
            return { ...prev, projects: next };
        });
    };

    const removeEntry = (i: number) => {
        setDraft(prev => ({
            ...prev,
            projects: (prev.projects || []).filter((_, j) => j !== i),
        }));
    };

    return (
        <div>
            {entries.map((proj, i) => (
                <div key={i} className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg relative">
                    <button onClick={() => removeEntry(i)} className="absolute top-3 right-3 text-red-400 hover:text-red-600 text-sm">✕</button>
                    <FieldInput label="Project Name" value={proj.name} onChange={v => updateEntry(i, 'name', v)} required maxLength={120} />
                    <TextArea label="Description" value={proj.description || ''} onChange={v => updateEntry(i, 'description', v)} maxLength={1200} rows={3} />
                    <div className="grid grid-cols-2 gap-4">
                        <FieldInput label="URL" value={proj.url || ''} onChange={v => updateEntry(i, 'url', v)} type="url" />
                        <FieldInput label="Repo URL" value={proj.repoUrl || ''} onChange={v => updateEntry(i, 'repoUrl', v)} type="url" />
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tech (comma-separated)</label>
                        <input
                            type="text"
                            value={(proj.tech || []).join(', ')}
                            onChange={e => updateEntry(i, 'tech', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                            placeholder="React, TypeScript, Node.js..."
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>
                </div>
            ))}
            <button onClick={addEntry} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                + Add project
            </button>
        </div>
    );
}

function ContactEditor({ draft, updateDraft, visibility, setVisibility }: {
    draft: CanonicalProfile;
    updateDraft: (p: string, v: unknown) => void;
    visibility: VisibilitySettings;
    setVisibility: React.Dispatch<React.SetStateAction<VisibilitySettings>>;
}) {
    const emails = draft.contact?.emails || [];

    const addEmail = () => {
        updateDraft('contact.emails', [...emails, { email: '', type: 'public' }]);
    };

    const updateEmail = (i: number, field: string, value: string) => {
        const next = [...emails];
        (next[i] as Record<string, string>)[field] = value;
        updateDraft('contact.emails', next);
    };

    const removeEmail = (i: number) => {
        updateDraft('contact.emails', emails.filter((_, j) => j !== i));
    };

    return (
        <div>
            <div className="p-3 mb-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                    ⚠️ Contact information is <strong>private by default</strong>. Only public-type emails are shown when this section is published.
                    Phone numbers and personal emails are never shared publicly.
                </p>
            </div>

            <FieldInput label="Phone" value={draft.contact?.phone || ''} onChange={v => updateDraft('contact.phone', v)} maxLength={40} hint="🔒 Private by default — only shared if you explicitly override" />

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Addresses</label>
                {emails.map((email, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                        <input
                            type="email"
                            value={email.email}
                            onChange={e => updateEmail(i, 'email', e.target.value)}
                            placeholder="you@example.com"
                            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                        <select
                            value={email.type}
                            onChange={e => updateEmail(i, 'type', e.target.value)}
                            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        >
                            <option value="public">Public</option>
                            <option value="personal">Personal</option>
                            <option value="work">Work</option>
                            <option value="school">School</option>
                        </select>
                        <button onClick={() => removeEmail(i)} className="px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm transition">✕</button>
                    </div>
                ))}
                <button onClick={addEmail} className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-1">
                    + Add email
                </button>
            </div>

            {/* Override toggles */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Privacy Overrides</h3>
                <div className="space-y-2">
                    <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-sm text-gray-700 dark:text-gray-300">Public emails visible</span>
                        <input
                            type="checkbox"
                            checked={visibility.overrides['/contact/emails'] !== 'private'}
                            onChange={e => setVisibility(prev => ({
                                ...prev,
                                overrides: { ...prev.overrides, '/contact/emails': e.target.checked ? 'public' : 'private' },
                            }))}
                            className="rounded"
                        />
                    </label>
                    <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-sm text-gray-700 dark:text-gray-300">Phone visible (not recommended)</span>
                        <input
                            type="checkbox"
                            checked={visibility.overrides['/contact/phone'] === 'public'}
                            onChange={e => setVisibility(prev => ({
                                ...prev,
                                overrides: { ...prev.overrides, '/contact/phone': e.target.checked ? 'public' : 'private' },
                            }))}
                            className="rounded"
                        />
                    </label>
                </div>
            </div>
        </div>
    );
}

// ─── Login / Register Form ───────────────────────────────────────

function LoginRegisterForm({ onSuccess }: { onSuccess: () => void }) {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: mode, email, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message);
            } else {
                onSuccess();
            }
        } catch (err) {
            if (window.location.hostname.includes('vercel.app')) {
                setError('Database access failed. Note: SQLite local files are not supported in Vercel Serverless. Please move to Turso/Cloud to enable live dashboard features.');
            } else {
                setError('Connection failed. Ensure the dev server is running and the database is accessible.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Truth Engine</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                            {mode === 'login' ? 'Sign in to your profile' : 'Create your profile'}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm border border-red-200 dark:border-red-800">
                            {error}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                minLength={8}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {loading ? '...' : mode === 'login' ? 'Sign In' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null); }}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            {mode === 'login' ? "Don't have an account? Register" : 'Already have an account? Sign in'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}



// ─── Autofill Modal ──────────────────────────────────────────────

function AutofillModal({ isOpen, onClose, onApply }: { isOpen: boolean; onClose: () => void; onApply: (data: Partial<CanonicalProfile>) => void }) {
    const [mode, setMode] = useState<'text' | 'url'>('text');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const process = async () => {
        if (!content.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/profile/autofill', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mode === 'text' ? { text: content } : { url: content }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || 'Failed to process.');
            } else {
                onApply(data.parsed);
            }
        } catch {
            setError('Network error. Failed to reach verification server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200 dark:border-gray-800">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        ✨ AI Autofill
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">✕</button>
                </div>

                <div className="p-6">
                    <div className="flex gap-2 mb-4 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                        <button
                            onClick={() => setMode('text')}
                            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition ${mode === 'text' ? 'bg-white dark:bg-gray-700 shadow text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                        >
                            Paste Text
                        </button>
                        <button
                            onClick={() => setMode('url')}
                            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition ${mode === 'url' ? 'bg-white dark:bg-gray-700 shadow text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                        >
                            Import from URL
                        </button>
                    </div>

                    {mode === 'text' ? (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Paste Resume / Profile Text
                            </label>
                            <textarea
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                placeholder="Paste your resume, LinkedIn 'About' section, or biography here..."
                                rows={8}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Tip: For LinkedIn, go to your profile, select all text (Ctrl+A), copy (Ctrl+C), and paste here.
                            </p>
                        </div>
                    ) : (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Website URL
                            </label>
                            <input
                                type="url"
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                placeholder="https://your-portfolio.com"
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                                Note: Most social media sites (LinkedIn, Facebook) block direct imports. Please use "Paste Text" for those.
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm border border-red-200 dark:border-red-800">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={process}
                        disabled={loading || !content.trim()}
                        className="w-full py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <span className="animate-spin text-lg">⟳</span> Processing with AI...
                            </>
                        ) : (
                            <>
                                ⚡ Process & Autofill
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Deploy Card ─────────────────────────────────────────────────



