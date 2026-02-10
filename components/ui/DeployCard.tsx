'use client';

import { useState } from 'react';

interface DeployCardProps {
    handle: string;
}

export function DeployCard({ handle }: DeployCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // In production, we'd use the actual domain. 
    // For the template, we link to the public GitHub repo.
    const TEMPLATE_URL = 'https://github.com/rguid31/truth-engine-viewer';

    // Construct Vercel Deploy URL with PRE-FILLED values
    const apiBaseUrl = typeof window !== 'undefined' && !window.location.hostname.includes('localhost')
        ? window.location.origin
        : 'https://ryanguidry.com';

    // Correct way to pass multiple env vars to Vercel clone: 
    // &env=KEY1&env=KEY2&KEY1=VAL1&KEY2=VAL2
    const deployUrl = `https://vercel.com/new/clone?repository-url=${encodeURIComponent(TEMPLATE_URL)}` +
        `&env=NEXT_PUBLIC_TRUTH_ENGINE_HANDLE&env=NEXT_PUBLIC_TRUTH_ENGINE_API_URL` +
        `&NEXT_PUBLIC_TRUTH_ENGINE_HANDLE=${encodeURIComponent(handle)}` +
        `&NEXT_PUBLIC_TRUTH_ENGINE_API_URL=${encodeURIComponent(apiBaseUrl)}` +
        `&project-name=${handle}-profile` +
        `&repository-name=${handle}-profile`;

    return (
        <div className="mb-8 p-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl text-white overflow-hidden relative group">
            {/* Background Decoration */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-black/10 rounded-full blur-3xl group-hover:bg-black/20 transition-all duration-700"></div>

            <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 bg-white/20 rounded text-[10px] font-bold tracking-wider uppercase">One-Click Setup</span>
                            <h2 className="text-2xl font-bold">Launch Your Website</h2>
                        </div>
                        <p className="text-blue-100 max-w-xl mb-6">
                            Click Deploy Now. Vercel will show the pre-filled settings below - just click Deploy to confirm.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                            <div className="bg-black/20 p-3 rounded-xl border border-white/10 relative group/item">
                                <label className="block text-[10px] uppercase tracking-widest text-blue-200 mb-1">Handle</label>
                                <div className="flex items-center justify-between">
                                    <code className="text-sm font-mono text-white">{handle}</code>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(handle)}
                                        className="p-1 hover:bg-white/10 rounded transition text-blue-200"
                                        title="Copy Handle"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                    </button>
                                </div>
                            </div>
                            <div className="bg-black/20 p-3 rounded-xl border border-white/10 relative group/item overflow-hidden">
                                <label className="block text-[10px] uppercase tracking-widest text-blue-200 mb-1">API URL</label>
                                <div className="flex items-center gap-2">
                                    <code className="text-xs font-mono text-white overflow-x-auto whitespace-nowrap flex-1">{apiBaseUrl.replace('https://', '')}</code>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(apiBaseUrl)}
                                        className="p-1 hover:bg-white/10 rounded transition text-blue-200 flex-shrink-0"
                                        title="Copy API URL"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 min-w-[220px]">
                        <a
                            href={deployUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-5 bg-white text-blue-700 rounded-xl font-black text-center hover:bg-blue-50 transition shadow-xl flex flex-col items-center justify-center gap-1 group/btn border-b-4 border-blue-100 active:border-b-0 active:translate-y-1"
                        >
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5 transition-transform group-hover/btn:scale-125" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M24 22.525H0L12 1.475L24 22.525Z" />
                                </svg>
                                DEPLOY NOW
                            </span>
                            <span className="text-[10px] opacity-60 font-medium italic">Pre-filled & Ready</span>
                        </a>
                    </div>
                </div>

                <div className="mt-8 pt-4 border-t border-white/10 flex flex-wrap items-center gap-x-8 gap-y-2 text-[10px] text-blue-200 font-bold tracking-widest uppercase">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)] animate-pulse"></span>
                        LIVE SYNC ACTIVE
                    </div>
                    <div className="flex items-center gap-2">
                        <span>✨</span>
                        UI MIRROR READY
                    </div>
                    <div className="flex items-center gap-2">
                        <span>🚀</span>
                        AUTO-GENERATED REPO
                    </div>
                </div>
            </div>
        </div>
    );
}
