import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    icon: LucideIcon;
    value: string | number;
    label: string;
    description?: string;
    trend?: {
        value: string;
        positive: boolean;
    };
}

export default function StatsCard({ icon: Icon, value, label, description, trend }: StatsCardProps) {
    return (
        <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all hover:shadow-lg group">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/20 opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Content */}
            <div className="relative">
                <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                        <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    {trend && (
                        <span className={`text-sm font-medium ${trend.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {trend.value}
                        </span>
                    )}
                </div>

                <div className="space-y-1">
                    <div className="text-4xl font-extrabold text-gray-900 dark:text-white">
                        {value}
                    </div>
                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                        {label}
                    </div>
                    {description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            {description}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
