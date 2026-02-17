import { Plus, Mic, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function OmniBottomInput() {
    return (
        <div className="w-full max-w-3xl mx-auto bg-surface border border-border rounded-3xl p-4 shadow-2xl flex items-end gap-3 transition-all">
            <button className="p-3 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-text-secondary transition-colors" aria-label="Attach">
                <Plus className="w-6 h-6" />
            </button>

            <textarea
                className="flex-1 bg-transparent text-lg outline-none placeholder:text-text-secondary resize-none py-3 max-h-[120px]"
                placeholder="Ask a follow-up..."
                rows={1}
                style={{ minHeight: '52px' }}
            />

            <div className="flex items-center gap-2">
                <button className="p-3 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-text-secondary transition-colors" aria-label="Voice Input">
                    <Mic className="w-6 h-6" />
                </button>
                <button className="p-3 rounded-full bg-accent text-white hover:bg-accent-hover hover:rotate-90 transition-all duration-300" aria-label="Send">
                    <ArrowUp className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}
