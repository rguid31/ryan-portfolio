import { cn } from '@/lib/utils';
import { Sparkles, Copy, ThumbsUp, ThumbsDown, RefreshCcw } from 'lucide-react';

interface MessageBubbleProps {
    role: 'user' | 'ai';
    content: string;
    sources?: string[];
}

export default function MessageBubble({ role, content, sources }: MessageBubbleProps) {
    if (role === 'user') {
        return (
            <div className="flex justify-end mb-8">
                <div className="bg-accent text-white rounded-[2rem] px-8 py-6 max-w-[620px] text-lg font-medium shadow-sm">
                    {content}
                </div>
            </div>
        );
    }

    return (
        <div className="flex gap-5 max-w-[760px] mb-8 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-accent to-violet-500 flex-shrink-0 flex items-center justify-center shadow-lg shadow-accent/20">
                <Sparkles className="w-5 h-5 text-white" />
            </div>

            <div className="flex-1 min-w-0">
                <div className="bg-surface border border-border/50 rounded-[2rem] px-8 py-6 text-foreground text-lg leading-relaxed shadow-sm">
                    {content}
                </div>

                {sources && sources.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2 pl-2">
                        {sources.map((source, i) => (
                            <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded-xl text-xs text-text-secondary hover:text-foreground hover:border-accent/40 transition-colors cursor-pointer">
                                <span className="w-4 h-4 rounded-full bg-gray-200 dark:bg-zinc-700 text-[10px] flex items-center justify-center font-bold">{i + 1}</span>
                                <span className="truncate max-w-[150px]">{source}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex items-center gap-2 mt-3 pl-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button className="p-1.5 text-text-secondary hover:text-foreground rounded-lg hover:bg-surface transition-colors" title="Copy">
                        <Copy className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-text-secondary hover:text-foreground rounded-lg hover:bg-surface transition-colors" title="Regenerate">
                        <RefreshCcw className="w-4 h-4" />
                    </button>
                    <div className="w-px h-4 bg-border mx-1" />
                    <button className="p-1.5 text-text-secondary hover:text-foreground rounded-lg hover:bg-surface transition-colors" title="Good response">
                        <ThumbsUp className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-text-secondary hover:text-foreground rounded-lg hover:bg-surface transition-colors" title="Bad response">
                        <ThumbsDown className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
