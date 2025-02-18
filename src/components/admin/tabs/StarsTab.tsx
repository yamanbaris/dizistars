'use client';

/* cSpell:words supabase sonner */

import { useState, useEffect } from 'react';
import DashboardCard from '../DashboardCard';
import { 
  PencilIcon, 
  TrashIcon, 
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline';
import { db } from '@/lib/database';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import type { TableRow } from '@/types/supabase';

type DatabaseStar = TableRow<'stars'>;

type Star = {
  id: string;
  name: string;
  type: 'actor' | 'actress';
  birth_date: string;
  birth_place: string;
  biography: string;
  education: string;
  current_project?: string;
  is_featured: boolean;
  is_trending: boolean;
  is_rising: boolean;
  is_influential: boolean;
  profile_image: string;
  cover_image?: string;
  filmography: {
    title: string;
    role: string;
    year: number;
    streaming_on?: string;
  }[];
  gallery_images: string[];
  slug: string;
};

// Convert database star to display type
function convertDatabaseStar(dbStar: DatabaseStar): Star {
  return {
    id: dbStar.id,
    name: dbStar.full_name,
    type: dbStar.star_type,
    birth_date: dbStar.birth_date,
    birth_place: dbStar.birth_place,
    biography: dbStar.biography,
    education: dbStar.education,
    current_project: dbStar.current_project,
    is_featured: dbStar.is_featured,
    is_trending: dbStar.is_trending,
    is_rising: dbStar.is_rising,
    is_influential: dbStar.is_influential,
    profile_image: dbStar.profile_image_url || '/img/star-placeholder.jpeg',
    cover_image: dbStar.cover_image_url,
    filmography: dbStar.filmography || [],
    gallery_images: dbStar.gallery_images || [],
    slug: dbStar.slug
  };
}

export default function StarsTab() {
  const router = useRouter();
  const [stars, setStars] = useState<Star[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const loadStars = async () => {
    try {
      setLoading(true);
      const { data, count } = await db.stars.getList(currentPage, 10);
      // Transform the raw database data into our Star type
      const transformedStars = data.map(convertDatabaseStar);
      setStars(transformedStars);
      setTotalStars(count || 0);
    } catch (error) {
      console.error('Error loading stars:', error);
      toast.error('Failed to load stars');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStars();
  }, [currentPage, searchTerm]);

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
          onClick={() => router.push('/admin/stars/add')}
          className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Add New Star
        </button>
      </div>

      <DashboardCard title="Star Management">
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
                  Birth Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Featured
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-400">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                    </div>
                  </td>
                </tr>
              ) : stars.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-400">
                    No stars found
                  </td>
                </tr>
              ) : (
                stars.map((star) => (
                  <tr key={star.id} className="hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                      {star.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                      {star.type.charAt(0).toUpperCase() + star.type.slice(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                      {star.birth_date ? format(new Date(star.birth_date), 'MMM d, yyyy') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                      <div className="flex flex-wrap gap-2">
                        {star.is_featured && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Featured
                          </span>
                        )}
                        {star.is_trending && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            Trending
                          </span>
                        )}
                        {star.is_rising && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                            Rising
                          </span>
                        )}
                        {star.is_influential && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Influential
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => router.push(`/admin/stars/${star.id}/edit`)}
                          className="text-indigo-400 hover:text-indigo-300"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalStars > 0 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-700">
            <div className="text-sm text-gray-400">
              Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, totalStars)} of {totalStars} stars
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-gray-800 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={currentPage * 10 >= totalStars}
                className="px-3 py-1 rounded bg-gray-800 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </DashboardCard>
    </div>
  );
} 