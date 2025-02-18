'use client';

/* cSpell:words sonner supabase */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { starsApi } from '@/lib/database';
import type { TableRow, TableInsert } from '@/types/supabase';

type Star = TableRow<'stars'>;
type StarInput = TableInsert<'stars'>;

interface StarFormProps {
  initialData?: Star;
  onSubmit?: (data: Star) => void;
  onCancel?: () => void;
}

const StarForm = ({ initialData, onSubmit, onCancel }: StarFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<StarInput>({
    full_name: initialData?.full_name || '',
    star_type: initialData?.star_type || 'actor',
    birth_date: initialData?.birth_date || '',
    birth_place: initialData?.birth_place || '',
    biography: initialData?.biography || '',
    education: initialData?.education || '',
    current_project: initialData?.current_project || '',
    is_featured: initialData?.is_featured || false,
    is_trending: initialData?.is_trending || false,
    is_rising: initialData?.is_rising || false,
    is_influential: initialData?.is_influential || false,
    profile_image_url: initialData?.profile_image_url || '',
    cover_image_url: initialData?.cover_image_url || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result: Star;
      
      if (initialData) {
        result = await starsApi.update(initialData.id, formData);
        toast.success('Star updated successfully');
      } else {
        result = await starsApi.create(formData);
        toast.success('Star created successfully');
      }

      if (onSubmit) {
        onSubmit(result);
      } else {
        router.push('/admin/stars');
      }
    } catch (error) {
      console.error('Error saving star:', error);
      toast.error('Error saving star');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-200">
            Full Name
          </label>
          <input
            type="text"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200">
            Star Type
          </label>
          <select
            value={formData.star_type}
            onChange={(e) => setFormData({ ...formData, star_type: e.target.value })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
          >
            <option value="actor">Actor</option>
            <option value="actress">Actress</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200">
            Birth Date
          </label>
          <input
            type="date"
            value={formData.birth_date || ''}
            onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200">
            Birth Place
          </label>
          <input
            type="text"
            value={formData.birth_place || ''}
            onChange={(e) => setFormData({ ...formData, birth_place: e.target.value })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200">
            Education
          </label>
          <input
            type="text"
            value={formData.education || ''}
            onChange={(e) => setFormData({ ...formData, education: e.target.value })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200">
            Current Project
          </label>
          <input
            type="text"
            value={formData.current_project || ''}
            onChange={(e) => setFormData({ ...formData, current_project: e.target.value })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-200">
            Biography
          </label>
          <textarea
            value={formData.biography || ''}
            onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
            rows={4}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200">
            Profile Image URL
          </label>
          <input
            type="url"
            value={formData.profile_image_url}
            onChange={(e) => setFormData({ ...formData, profile_image_url: e.target.value })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200">
            Cover Image URL
          </label>
          <input
            type="url"
            value={formData.cover_image_url || ''}
            onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
          />
        </div>

        <div className="md:col-span-2">
          <h4 className="text-sm font-medium text-gray-200 mb-4">Star Status</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_featured"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="rounded bg-gray-700 border-gray-600 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="is_featured" className="ml-2 text-sm text-gray-200">
                Featured
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_trending"
                checked={formData.is_trending}
                onChange={(e) => setFormData({ ...formData, is_trending: e.target.checked })}
                className="rounded bg-gray-700 border-gray-600 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="is_trending" className="ml-2 text-sm text-gray-200">
                Trending
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_rising"
                checked={formData.is_rising}
                onChange={(e) => setFormData({ ...formData, is_rising: e.target.checked })}
                className="rounded bg-gray-700 border-gray-600 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="is_rising" className="ml-2 text-sm text-gray-200">
                Rising Star
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_influential"
                checked={formData.is_influential}
                onChange={(e) => setFormData({ ...formData, is_influential: e.target.checked })}
                className="rounded bg-gray-700 border-gray-600 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="is_influential" className="ml-2 text-sm text-gray-200">
                Influential
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-400 hover:text-gray-200"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-2 bg-indigo-600 text-white rounded-lg transition-colors ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'
          }`}
        >
          {loading ? 'Saving...' : initialData ? 'Update Star' : 'Create Star'}
        </button>
      </div>
    </form>
  );
};

export default StarForm; 