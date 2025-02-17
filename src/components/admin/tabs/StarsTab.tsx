'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardCard from '../DashboardCard';
import { 
  PencilIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const mockStars = [
  { id: 1, name: 'Çağatay Ulusoy', type: 'Actor', featured: true, lastUpdated: '2024-02-15', totalViews: '125K' },
  { id: 2, name: 'Hande Erçel', type: 'Actress', featured: true, lastUpdated: '2024-02-14', totalViews: '98K' },
  { id: 3, name: 'Burak Özçivit', type: 'Actor', featured: true, lastUpdated: '2024-02-13', totalViews: '145K' },
  { id: 4, name: 'Demet Özdemir', type: 'Actress', featured: false, lastUpdated: '2024-02-12', totalViews: '87K' },
];

export default function StarsTab() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const handleEdit = (id: number) => {
    router.push(`/admin/stars/${id}/edit`);
  };

  const handleDelete = (id: number) => {
    // Here you would typically make an API call to delete the star
    console.log('Deleting star:', id);
  };

  return (
    <div className="space-y-6">
      {/* Search and Add */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Search stars..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => router.push('/admin/stars/new')}
          className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Add New Star
        </button>
      </div>

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
                  Total Views
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-700 flex items-center justify-center">
                        <StarIcon className="h-5 w-5 text-indigo-400" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-200">{star.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                    {star.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      star.featured ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {star.featured ? 'Featured' : 'Not Featured'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                    {star.totalViews}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                    {star.lastUpdated}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => handleEdit(star.id)}
                        className="text-indigo-400 hover:text-indigo-300"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(star.id)}
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