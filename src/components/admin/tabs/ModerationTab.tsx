'use client';

import { useState } from 'react';
import DashboardCard from '../DashboardCard';
import { 
  ShieldExclamationIcon,
  UserIcon,
  ChatBubbleLeftIcon,
  DocumentTextIcon,
  CheckIcon,
  XMarkIcon,
  NoSymbolIcon
} from '@heroicons/react/24/outline';

const mockReports = [
  {
    id: 1,
    type: 'comment',
    reporter: 'Jane Smith',
    reported: 'John Doe',
    reason: 'Inappropriate content',
    content: 'This is the reported content...',
    date: '2024-02-15',
    status: 'Pending'
  },
  {
    id: 2,
    type: 'user',
    reporter: 'Admin System',
    reported: 'SpamUser123',
    reason: 'Spam activity',
    content: 'Multiple spam comments detected',
    date: '2024-02-14',
    status: 'Under Review'
  }
];

const reportTypeIcons = {
  comment: ChatBubbleLeftIcon,
  user: UserIcon,
  content: DocumentTextIcon
};

export default function ModerationTab() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'resolved'>('all');

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard title="Pending Reports">
          <div className="p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShieldExclamationIcon className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-semibold text-gray-200">12</h4>
                <p className="text-sm text-gray-400">Awaiting review</p>
              </div>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Banned Users">
          <div className="p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <NoSymbolIcon className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-semibold text-gray-200">5</h4>
                <p className="text-sm text-gray-400">Total banned</p>
              </div>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Resolved Reports">
          <div className="p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-semibold text-gray-200">45</h4>
                <p className="text-sm text-gray-400">This month</p>
              </div>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Filter Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-lg ${
            activeFilter === 'all'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:text-gray-200'
          }`}
        >
          All Reports
        </button>
        <button
          onClick={() => setActiveFilter('pending')}
          className={`px-4 py-2 rounded-lg ${
            activeFilter === 'pending'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:text-gray-200'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setActiveFilter('resolved')}
          className={`px-4 py-2 rounded-lg ${
            activeFilter === 'resolved'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:text-gray-200'
          }`}
        >
          Resolved
        </button>
      </div>

      {/* Reports Table */}
      <DashboardCard title="Reported Content">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Reporter
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Reported
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Reason
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {mockReports.map((report) => {
                const Icon = reportTypeIcons[report.type as keyof typeof reportTypeIcons];
                return (
                  <tr key={report.id} className="hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Icon className="h-5 w-5 text-gray-400" />
                        <span className="ml-2 text-sm text-gray-200 capitalize">
                          {report.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                      {report.reporter}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                      {report.reported}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      <div className="max-w-xs truncate">
                        {report.reason}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        report.status === 'Pending' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button className="text-green-400 hover:text-green-300">
                          <CheckIcon className="h-5 w-5" />
                        </button>
                        <button className="text-red-400 hover:text-red-300">
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                        <button className="text-yellow-400 hover:text-yellow-300">
                          <NoSymbolIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </DashboardCard>
    </div>
  );
} 