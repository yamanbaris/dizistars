import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

interface DashboardStatsProps {
  title: string;
  value: number;
  icon: React.ElementType;
  trend: string;
  trendDirection: 'up' | 'down';
}

export default function DashboardStats({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendDirection 
}: DashboardStatsProps) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400 truncate">{title}</p>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold text-white">{value.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-gray-700 rounded-lg p-3">
          <Icon className="h-6 w-6 text-indigo-400" aria-hidden="true" />
        </div>
      </div>
      <div className="mt-4">
        <div className="flex items-center">
          {trendDirection === 'up' ? (
            <ArrowUpIcon className="h-4 w-4 text-emerald-400" />
          ) : (
            <ArrowDownIcon className="h-4 w-4 text-red-400" />
          )}
          <span className={`text-sm font-medium ${
            trendDirection === 'up' ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {trend}
          </span>
          <span className="text-sm text-gray-400 ml-2">from last month</span>
        </div>
      </div>
    </div>
  );
} 