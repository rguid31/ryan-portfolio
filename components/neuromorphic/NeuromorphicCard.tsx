import { ReactNode } from 'react';

interface NeuromorphicCardProps {
    children: ReactNode;
    className?: string;
    inset?: boolean;
}

export default function NeuromorphicCard({ children, className = '', inset = false }: NeuromorphicCardProps) {
    const baseStyles = "bg-[#e0e5ec] dark:bg-[#1a1c23] rounded-2xl p-6 transition-all duration-300";

    const shadowStyles = inset
        ? "shadow-[inset_6px_6px_10px_#b8b9be,inset_-6px_-6px_10px_#ffffff] dark:shadow-[inset_6px_6px_10px_#121318,inset_-6px_-6px_10px_#22252e]"
        : "shadow-[8px_8px_16px_#b8b9be,-8px_-8px_16px_#ffffff] dark:shadow-[8px_8px_16px_#121318,-8px_-8px_16px_#22252e]";

    return (
        <div className={`${baseStyles} ${shadowStyles} ${className}`}>
            {children}
        </div>
    );
}
