import OmniHeader from './OmniHeader';
import OmniSidebar from './OmniSidebar';

export default function OmniLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[var(--omni-bg)] text-[var(--foreground)] flex flex-col font-sans selection:bg-[var(--omni-accent)] selection:text-white">
            <OmniHeader />
            <div className="flex flex-1 pt-16">
                <div className="hidden lg:block w-[280px] shrink-0">
                    {/* Spacer for fixed sidebar */}
                </div>
                <OmniSidebar />
                <main className="flex-1 relative w-full lg:max-w-[calc(100vw-280px)]">
                    {children}
                </main>
            </div>
        </div>
    );
}
