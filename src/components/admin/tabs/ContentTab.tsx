'use client';

import { useState } from 'react';
import DashboardCard from '../DashboardCard';
import { 
  PencilIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  StarIcon,
  NewspaperIcon
} from '@heroicons/react/24/outline';

const mockStars = [
  { id: 1, name: 'Çağatay Ulusoy', type: 'Actor', featured: true, lastUpdated: '2024-02-15' },
  { id: 2, name: 'Hande Erçel', type: 'Actress', featured: true, lastUpdated: '2024-02-14' },
];

const mockNews = [
  { id: 1, title: 'New Turkish Drama Announcement', category: 'TV Series', status: 'Published', publishDate: '2024-02-15' },
  { id: 2, title: 'Award Show Coverage', category: 'Events', status: 'Draft', publishDate: '2024-02-14' },
];

export default function ContentTab() {
  const [activeSection, setActiveSection] = useState<'stars' | 'news'>('stars');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      {/* Section Toggle */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveSection('stars')}
          className={`flex items-center px-4 py-2 rounded-lg ${
            activeSection === 'stars'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:text-gray-200'
          }`}
        >
          <StarIcon className="h-5 w-5 mr-2" />
          Stars
        </button>
        <button
          onClick={() => setActiveSection('news')}
          className={`flex items-center px-4 py-2 rounded-lg ${
            activeSection === 'news'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:text-gray-200'
          }`}
        >
          <NewspaperIcon className="h-5 w-5 mr-2" />
          News
        </button>
      </div>

      {/* Search and Add */}
      <div className="flex items-center justify-between">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder={`Search ${activeSection}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          Add New {activeSection === 'stars' ? 'Star' : 'Article'}
        </button>
      </div>

      {/* Content Tables */}
      {activeSection === 'stars' ? (
        <DashboardCard title="Stars Management">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Featured
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {mockStars.map((star) => (
                  <tr key={star.id} className="hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                      {star.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                      {star.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                      {star.featured ? 'Yes' : 'No'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                      {star.lastUpdated}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button className="text-indigo-400 hover:text-indigo-300">
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button className="text-red-400 hover:text-red-300">
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>
      ) : (
        <DashboardCard title="News Management">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Publish Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {mockNews.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                      {article.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                      {article.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        article.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {article.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                      {article.publishDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button className="text-indigo-400 hover:text-indigo-300">
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button className="text-red-400 hover:text-red-300">
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>
      )}
    </div>
  );
} 