import { Mic, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function OmniHeroInput() {
    return (
        <div className="mx-auto max-w-3xl w-full bg-[var(--omni-surface)] border border-[var(--omni-border)] rounded-[2rem] px-8 py-6 shadow-2xl transition-all duration-300 group focus-within:ring-4 focus-within:ring-[var(--omni-accent)]/10">
            <div className="flex items-center gap-4">
                <input
                    type="text"
                    className="w-full bg-transparent text-[1.375rem] leading-relaxed outline-none placeholder:text-[var(--text-secondary)] font-medium text-[var(--foreground)]"
                    placeholder="Ask anything..."
                />
                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <button className="p-3 rounded-full hover:bg-[var(--omni-bg)] transition-colors">
                        <Mic className="w-6 h-6" />
                    </button>
                    <button className="p-3 rounded-full bg-[var(--omni-accent)] text-white hover:bg-[var(--omni-accent)]/90 transition-all duration-200 opacity-0 group-focus-within:opacity-100 scale-90 group-focus-within:scale-100">
                        <ArrowUp className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
}
