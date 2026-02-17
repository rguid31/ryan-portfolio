import { cn } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';

interface SuggestionChipProps {
    label: string;
    onClick?: () => void;
    className?: string;
}

export default function SuggestionChip({ label, onClick, className }: SuggestionChipProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "group flex items-center justify-between gap-3 px-6 py-4 bg-[var(--omni-surface)] border border-[var(--omni-border)] rounded-2xl text-sm font-medium text-[var(--foreground)] hover:bg-[var(--omni-bg)] hover:border-[var(--omni-accent)]/50 hover:shadow-md transition-all duration-200 active:scale-95 text-left w-full h-full",
                className
            )}
        >
            <span className="line-clamp-2">{label}</span>
            <ArrowUpRight className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--omni-accent)] transition-colors opacity-0 group-hover:opacity-100" />
        </button>
    );
}
