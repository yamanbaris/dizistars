import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

interface DashboardStatsProps {
  title: string;
  value: number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  loading?: boolean;
  trend?: string;
  trendDirection?: 'up' | 'down';
}

export default function DashboardStats({ 
  title, 
  value, 
  icon: Icon, 
  loading,
  trend,
  trendDirection 
}: DashboardStatsProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          {loading ? (
            <div className="h-8 flex items-center">
              <div className="animate-pulse bg-gray-700 h-6 w-16 rounded"></div>
            </div>
          ) : (
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-white">{value.toLocaleString()}</p>
              {trend && trendDirection && (
                <span className={`ml-2 text-sm font-medium ${
                  trendDirection === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {trend}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="p-3 bg-gray-900/50 rounded-lg">
          <Icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
} 