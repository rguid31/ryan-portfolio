'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

export default function DashboardSettingsPage() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [profileMeta, setProfileMeta] = useState<{
        handle: string | null;
        published: boolean;
    }>({ handle: null, published: false });
    const [status, setStatus] = useState<string | null>(null);
    const [isWorking, setIsWorking] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const loadProfile = useCallback(async () => {
        try {
            const res = await fetch('/api/profile/me');
            if (res.status === 401) {
                setIsAuthenticated(false);
                return;
            }
            setIsAuthenticated(true);
            const data = await res.json();
            setProfileMeta({ handle: data.handle, published: data.published });
        } catch {
            setIsAuthenticated(false);
        }
    }, []);

    useEffect(() => { loadProfile(); }, [loadProfile]);

    const unpublish = async () => {
        setIsWorking(true);
        setStatus(null);
        try {
            const res = await fetch('/api/profile/unpublish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ confirm: true }),
            });
            if (res.ok) {
                setStatus('✅ Profile unpublished. Public URLs will now return 404.');
                setProfileMeta(prev => ({ ...prev, published: false }));
            } else {
                const data = await res.json();
                setStatus(`❌ ${data.message}`);
            }
        } catch {
            setStatus('❌ Failed to unpublish.');
        } finally {
            setIsWorking(false);
        }
    };

    const deleteAccount = async () => {
        setIsWorking(true);
        setStatus(null);
        try {
            const res = await fetch('/api/profile', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ confirm: true }),
            });
            if (res.ok) {
                setStatus('✅ Account deleted. Redirecting...');
                setTimeout(() => { window.location.href = '/'; }, 2000);
            } else {
                const data = await res.json();
                setStatus(`❌ ${data.message}`);
            }
        } catch {
            setStatus('❌ Failed to delete account.');
        } finally {
            setIsWorking(false);
            setShowDeleteConfirm(false);
        }
    };

    const logout = async () => {
        await fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'logout' }),
        });
        window.location.href = '/';
    };

    const exportData = async () => {
        if (!profileMeta.handle) return;
        try {
            const res = await fetch(`/api/u/${profileMeta.handle}/json`);
            if (res.ok) {
                const data = await res.json();
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${profileMeta.handle}-public-profile.json`;
                a.click();
                URL.revokeObjectURL(url);
                setStatus('✅ Public dataset exported.');
            } else {
                setStatus('❌ No published profile to export.');
            }
        } catch {
            setStatus('❌ Export failed.');
        }
    };

    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="animate-pulse text-gray-400 text-lg">Loading...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">You need to be logged in.</p>
                    <Link href="/dashboard" className="text-blue-600 hover:underline">Go to Dashboard →</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    {/* Header handled by Layout */}
                </div>

                {/* Status */}
                {status && (
                    <div className={`mb-6 p-4 rounded-lg text-sm ${status.startsWith('✅')
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                        : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                        }`}>
                        {status}
                    </div>
                )}

                <div className="space-y-6">
                    {/* Profile Info */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Status</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Handle</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {profileMeta.handle ? `@${profileMeta.handle}` : 'Not set'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Published</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${profileMeta.published
                                    ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                                    }`}>
                                    {profileMeta.published ? '● Live' : '○ Not published'}
                                </span>
                            </div>
                            {profileMeta.published && profileMeta.handle && (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Public URL</span>
                                    <Link
                                        href={`/u/${profileMeta.handle}`}
                                        className="text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        /u/{profileMeta.handle}
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Instant Portfolio Engine</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            Download a single-file premium mirror of your profile that you can host on any platform (Github Pages, Netlify, GoDaddy).
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={exportData}
                                disabled={!profileMeta.published}
                                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition disabled:opacity-50"
                            >
                                📊 JSON Dataset
                            </button>
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
                                disabled={!profileMeta.handle}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                            >
                                🚀 Download HTML Website
                            </button>
                        </div>
                    </div>

                    {/* Unpublish */}
                    {profileMeta.published && (
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Unpublish Profile</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                Remove your profile from public access. Your draft data will be kept, and public URLs will return 404.
                            </p>
                            <button
                                onClick={unpublish}
                                disabled={isWorking}
                                className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700 transition disabled:opacity-50"
                            >
                                {isWorking ? 'Unpublishing...' : '🔒 Unpublish'}
                            </button>
                        </div>
                    )}

                    {/* Danger Zone */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-red-200 dark:border-red-800 p-6">
                        <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">Danger Zone</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            Permanently delete your account and all associated data. This cannot be undone.
                        </p>
                        {!showDeleteConfirm ? (
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
                            >
                                🗑️ Delete Account
                            </button>
                        ) : (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                                <p className="text-sm text-red-700 dark:text-red-300 mb-3 font-medium">
                                    Are you absolutely sure? This will delete:
                                </p>
                                <ul className="text-sm text-red-600 dark:text-red-400 space-y-1 mb-4 ml-4 list-disc">
                                    <li>Your profile draft</li>
                                    <li>All published snapshots</li>
                                    <li>Your search index entry</li>
                                    <li>Your account</li>
                                </ul>
                                <div className="flex gap-3">
                                    <button
                                        onClick={deleteAccount}
                                        disabled={isWorking}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition disabled:opacity-50"
                                    >
                                        {isWorking ? 'Deleting...' : 'Yes, Delete Everything'}
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Logout */}
                    <div className="text-center pt-4">
                        <button
                            onClick={logout}
                            className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
