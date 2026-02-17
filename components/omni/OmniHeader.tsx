import Link from 'next/link';
import { Search, Mic, Plus, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function OmniHeader() {
    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-[var(--omni-bg)]/80 backdrop-blur-md z-50 border-b border-[var(--omni-border)] flex items-center justify-between px-6 transition-all duration-300">
            {/* Left: Logo */}
            <div className="flex items-center gap-2">
                <Link href="/omni" className="font-bold text-xl tracking-tight flex items-center gap-2 text-[var(--foreground)]">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[var(--omni-accent)] to-indigo-400 shadow-lg shadow-[var(--omni-accent)]/20"></div>
                    Omni
                </Link>
            </div>

            {/* Center: Mode Pills */}
            <div className="hidden md:flex items-center bg-[var(--omni-surface)] border border-[var(--omni-border)] rounded-full p-1 shadow-sm">
                <button className="px-4 py-1.5 rounded-full text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors">
                    Search
                </button>
                <button className="px-4 py-1.5 rounded-full text-sm font-medium bg-[var(--omni-bg)] text-[var(--foreground)] shadow-sm ring-1 ring-[var(--omni-border)]">
                    Chat
                </button>
                <button className="px-4 py-1.5 rounded-full text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors">
                    Create
                </button>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 md:gap-4">
                <button className="p-2 rounded-full hover:bg-[var(--omni-surface)] text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors" aria-label="Voice Input">
                    <Mic className="w-5 h-5" />
                </button>
                <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--omni-accent)]/10 text-[var(--omni-accent)] hover:bg-[var(--omni-accent)]/20 transition-colors font-medium text-sm">
                    <Plus className="w-4 h-4" />
                    <span>New Chat</span>
                </button>
                <button className="w-9 h-9 rounded-full bg-[var(--omni-surface)] border border-[var(--omni-border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors" aria-label="User Menu">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-gray-200 to-gray-400"></div>
                </button>
            </div>
        </header>
    );
}
