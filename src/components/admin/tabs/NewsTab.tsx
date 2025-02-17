'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardCard from '../DashboardCard';
import { 
  PencilIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  EyeIcon,
  NewspaperIcon
} from '@heroicons/react/24/outline';

// This would typically come from an API call
const mockStars = [
  { id: 1, name: 'Çağatay Ulusoy' },
  { id: 2, name: 'Hande Erçel' },
  { id: 3, name: 'Burak Özçivit' },
  { id: 4, name: 'Demet Özdemir' },
];

const mockNews = [
  { 
    id: 1, 
    title: 'New Turkish Drama Announcement', 
    star: 'Çağatay Ulusoy', 
    status: 'Published', 
    publishDate: '2024-02-15',
    views: '45K',
    author: 'Admin'
  },
  { 
    id: 2, 
    title: 'Award Show Coverage', 
    star: 'Hande Erçel', 
    status: 'Draft', 
    publishDate: '2024-02-14',
    views: '32K',
    author: 'Editor'
  },
  { 
    id: 3, 
    title: 'Exclusive Interview', 
    star: 'Burak Özçivit', 
    status: 'Published', 
    publishDate: '2024-02-13',
    views: '78K',
    author: 'Senior Editor'
  },
  { 
    id: 4, 
    title: 'Behind the Scenes: New Series', 
    star: 'Demet Özdemir', 
    status: 'Scheduled', 
    publishDate: '2024-02-16',
    views: '0',
    author: 'Content Writer'
  }
];

export default function NewsTab() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStar, setSelectedStar] = useState('All');

  const handleEdit = (id: number) => {
    router.push(`/admin/news/${id}/edit`);
  };

  const handleDelete = (id: number) => {
    // Here you would typically make an API call to delete the article
    console.log('Deleting article:', id);
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedStar('All')}
            className={`px-4 py-2 rounded-lg ${
              selectedStar === 'All'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-gray-200'
            }`}
          >
            All Stars
          </button>
          {mockStars.map((star) => (
            <button
              key={star.id}
              onClick={() => setSelectedStar(star.name)}
              className={`px-4 py-2 rounded-lg ${
                selectedStar === star.name
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-gray-200'
              }`}
            >
              {star.name}
            </button>
          ))}
        </div>
        <button 
          onClick={() => router.push('/admin/news/new')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Create Article
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Search articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <DashboardCard title="News Management">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Star
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Author
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Views
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
              {mockNews
                .filter(article => selectedStar === 'All' || article.star === selectedStar)
                .map((article) => (
                <tr key={article.id} className="hover:bg-gray-750">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded bg-gray-700 flex items-center justify-center">
                        <NewspaperIcon className="h-5 w-5 text-indigo-400" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-200 max-w-md truncate">
                          {article.title}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                    {article.star}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                    {article.author}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                    <div className="flex items-center">
                      <EyeIcon className="h-4 w-4 mr-1 text-gray-400" />
                      {article.views}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      article.status === 'Published' 
                        ? 'bg-green-100 text-green-800'
                        : article.status === 'Draft'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {article.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                    {article.publishDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => handleEdit(article.id)}
                        className="text-indigo-400 hover:text-indigo-300"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(article.id)}
                        className="text-red-400 hover:text-red-300"
                      >
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
    </div>
  );
} 