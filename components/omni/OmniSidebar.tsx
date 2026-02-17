'use client';

import { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight, LayoutGrid, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function OmniSidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <aside
            className={cn(
                "fixed left-0 top-16 bottom-0 z-40 bg-[var(--omni-surface)] border-r border-[var(--omni-border)] transition-all duration-300 ease-in-out flex flex-col",
                isCollapsed ? "w-16" : "w-[280px] lg:translate-x-0 -translate-x-full lg:w-[280px]"
            )}
        >
            <div className="p-6 flex flex-col h-full gap-6">
                {/* New Chat Button - Full width, accent bg, white text, rounded-3xl */}
                <button
                    className={cn(
                        "flex items-center gap-3 bg-[var(--omni-accent)] hover:bg-[var(--omni-accent)]/90 text-white rounded-3xl transition-all duration-200 shadow-lg shadow-[var(--omni-accent)]/20",
                        isCollapsed ? "justify-center w-10 h-10 p-0" : "w-full py-3 px-6"
                    )}
                >
                    <Plus className="w-5 h-5" />
                    {!isCollapsed && <span className="font-medium">New chat</span>}
                </button>

                {/* History List */}
                <div className="flex-1 overflow-y-auto space-y-6 pr-1 custom-scrollbar">
                    {!isCollapsed && (
                        <>
                            <div className="space-y-2">
                                <div className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider px-2">Today</div>
                                {[
                                    "Project Architecture Review",
                                    "React 19 Server Components",
                                    "Omni Design System Specs"
                                ].map((item, i) => (
                                    <button key={i} className="w-full text-left px-3 py-2 rounded-xl hover:bg-[var(--omni-bg)] text-sm text-[var(--foreground)]/80 hover:text-[var(--foreground)] transition-colors truncate">
                                        {item}
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-2">
                                <div className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider px-2">Yesterday</div>
                                {[
                                    "Next.js Middleware Fix",
                                    "Tailwind v4 Configuration"
                                ].map((item, i) => (
                                    <button key={i} className="w-full text-left px-3 py-2 rounded-xl hover:bg-[var(--omni-bg)] text-sm text-[var(--foreground)]/80 hover:text-[var(--foreground)] transition-colors truncate">
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Bottom Actions */}
                <div className="mt-auto space-y-1">
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--omni-bg)] text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors",
                            isCollapsed && "justify-center"
                        )}
                    >
                        {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                        {!isCollapsed && <span className="text-sm font-medium">Collapse sidebar</span>}
                    </button>
                </div>
            </div>
        </aside>
    );
}
