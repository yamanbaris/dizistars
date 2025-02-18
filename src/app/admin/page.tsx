'use client';

import { useState, useEffect } from 'react';
import { 
  UserGroupIcon, 
  NewspaperIcon, 
  StarIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  BellIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import DashboardCard from '@/components/admin/DashboardCard';
import DashboardStats from '@/components/admin/DashboardStats';
import RecentActivity from '@/components/admin/RecentActivity';
import UsersTab from '@/components/admin/tabs/UsersTab';
import StarsTab from '@/components/admin/tabs/StarsTab';
import NewsTab from '@/components/admin/tabs/NewsTab';
import CommentsTab from '@/components/admin/tabs/CommentsTab';
import ModerationTab from '@/components/admin/tabs/ModerationTab';
import { getDashboardStats, getRecentActivity } from '@/lib/admin';
import type { Activity } from '@/components/admin/RecentActivity';
import { toast } from 'sonner';

const tabs = [
  { name: 'Overview', icon: ChartBarIcon },
  { name: 'Users', icon: UsersIcon },
  { name: 'Stars', icon: StarIcon },
  { name: 'News', icon: NewspaperIcon },
  { name: 'Comments', icon: ChatBubbleLeftRightIcon },
  { name: 'Moderation', icon: ShieldCheckIcon },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    stars: 0,
    news: 0,
    comments: 0
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('Overview');

  useEffect(() => {
    if (currentTab === 'Overview') {
      loadDashboardData();
    }
  }, [currentTab]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, activitiesData] = await Promise.all([
        getDashboardStats(),
        getRecentActivity(10)
      ]);
      setStats(statsData);
      setActivities(activitiesData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (currentTab) {
      case 'Users':
        return <UsersTab />;
      case 'Stars':
        return <StarsTab />;
      case 'News':
        return <NewsTab />;
      case 'Comments':
        return <CommentsTab />;
      case 'Moderation':
        return <ModerationTab />;
      default:
        return (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <DashboardStats
                title="Total Users"
                value={stats.users}
                icon={UserGroupIcon}
                loading={loading}
              />
              <DashboardStats
                title="Stars"
                value={stats.stars}
                icon={StarIcon}
                loading={loading}
              />
              <DashboardStats
                title="News Articles"
                value={stats.news}
                icon={NewspaperIcon}
                loading={loading}
              />
              <DashboardStats
                title="Comments"
                value={stats.comments}
                icon={ChartBarIcon}
                loading={loading}
              />
            </div>

            {/* Recent Activity */}
            <div className="space-y-8">
              <DashboardCard title="Recent Activity">
                {loading ? (
                  <div className="flex justify-center items-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                  </div>
                ) : (
                  <RecentActivity activities={activities} />
                )}
              </DashboardCard>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-white">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-200">
                <BellIcon className="h-6 w-6" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-200">
                <Cog6ToothIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700">
        <nav className="px-4 sm:px-6 lg:px-8 flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.name}
                onClick={() => setCurrentTab(tab.name)}
                className={`
                  group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                  ${currentTab === tab.name
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="h-5 w-5 mr-2" aria-hidden="true" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </div>
    </div>
  );
} 