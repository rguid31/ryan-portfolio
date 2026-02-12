import { ReactNode } from 'react';
import Link from 'next/link';

interface NeuromorphicButtonProps {
    children: ReactNode;
    onClick?: () => void;
    href?: string;
    className?: string;
    active?: boolean;
}

export default function NeuromorphicButton({ children, onClick, href, className = '', active = false }: NeuromorphicButtonProps) {
    const baseStyles = `
    inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all duration-300
    active:scale-95 text-gray-700 dark:text-gray-300
    bg-[#e0e5ec] dark:bg-[#1a1c23]
  `;

    const shadowStyles = active
        ? "shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff] dark:shadow-[inset_4px_4px_8px_#121318,inset_-4px_-4px_8px_#22252e] text-blue-600 dark:text-blue-400"
        : "shadow-[6px_6px_12px_#b8b9be,-6px_-6px_12px_#ffffff] dark:shadow-[6px_6px_12px_#121318,-6px_-6px_12px_#22252e] hover:shadow-[8px_8px_16px_#b8b9be,-8px_-8px_16px_#ffffff] dark:hover:shadow-[8px_8px_16px_#121318,-8px_-8px_16px_#22252e] hover:-translate-y-0.5";

    const styles = `${baseStyles} ${shadowStyles} ${className}`;

    if (href) {
        return (
            <Link href={href} className={styles}>
                {children}
            </Link>
        );
    }

    return (
        <button onClick={onClick} className={styles}>
            {children}
        </button>
    );
}
