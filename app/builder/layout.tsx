'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const navLinks = [
        { href: '/builder', label: 'Editor', icon: '📝' },
        { href: '/builder/privacy', label: 'Privacy', icon: '🔒' },
        { href: '/builder/settings', label: 'Settings', icon: '⚙️' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Dashboard Sub-Nav */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-16 z-40">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex items-center gap-8 h-12">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center gap-2 text-sm font-medium transition-colors h-full border-b-2 px-1 ${isActive
                                        ? 'text-blue-600 border-blue-600'
                                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 border-transparent'
                                        }`}
                                >
                                    <span>{link.icon}</span>
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            <main>{children}</main>
        </div>
    );
}
