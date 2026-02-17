import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    subtext?: string;
}

export default function StatsCard({ label, value, icon: Icon, subtext }: StatsCardProps) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex items-start space-x-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <Icon size={24} />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
                {subtext && <p className="text-xs text-green-600 mt-1">{subtext}</p>}
            </div>
        </div>
    );
}
