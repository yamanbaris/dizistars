'use client';

import { useState, useEffect } from 'react';
import { PhotoIcon } from '@heroicons/react/24/outline';

interface StarFormData {
  name: string;
  type: 'Actor' | 'Actress';
  birthDate: string;
  birthPlace: string;
  biography: string;
  featured: boolean;
  socialMedia: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
  imageUrl?: string;
}

interface StarFormProps {
  initialData?: StarFormData;
  onSubmit: (data: StarFormData) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

export default function StarForm({ initialData, onSubmit, onCancel, isEdit = false }: StarFormProps) {
  const [formData, setFormData] = useState<StarFormData>({
    name: '',
    type: 'Actor',
    birthDate: '',
    birthPlace: '',
    biography: '',
    featured: false,
    socialMedia: {},
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Profile Image
          </label>
          <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-lg">
            <div className="space-y-1 text-center">
              <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-400">
                <label htmlFor="image-upload" className="relative cursor-pointer rounded-md bg-gray-800 font-medium text-indigo-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-300">
                  <span>Upload a file</span>
                  <input id="image-upload" name="image-upload" type="file" className="sr-only" accept="image/*" />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-400">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-200">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 text-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
              required
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-200">
              Type
            </label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'Actor' | 'Actress' })}
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 text-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
            >
              <option value="Actor">Actor</option>
              <option value="Actress">Actress</option>
            </select>
          </div>

          <div>
            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-200">
              Birth Date
            </label>
            <input
              type="date"
              id="birthDate"
              value={formData.birthDate}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 text-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
              required
            />
          </div>

          <div>
            <label htmlFor="birthPlace" className="block text-sm font-medium text-gray-200">
              Birth Place
            </label>
            <input
              type="text"
              id="birthPlace"
              value={formData.birthPlace}
              onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 text-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
              required
            />
          </div>
        </div>

        {/* Biography */}
        <div>
          <label htmlFor="biography" className="block text-sm font-medium text-gray-200">
            Biography
          </label>
          <textarea
            id="biography"
            rows={5}
            value={formData.biography}
            onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 text-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
            required
          />
        </div>

        {/* Social Media */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-200">Social Media Links</h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="instagram" className="block text-sm font-medium text-gray-200">
                Instagram
              </label>
              <input
                type="url"
                id="instagram"
                value={formData.socialMedia.instagram || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  socialMedia: { ...formData.socialMedia, instagram: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 text-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
                placeholder="https://instagram.com/username"
              />
            </div>

            <div>
              <label htmlFor="twitter" className="block text-sm font-medium text-gray-200">
                Twitter
              </label>
              <input
                type="url"
                id="twitter"
                value={formData.socialMedia.twitter || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  socialMedia: { ...formData.socialMedia, twitter: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 text-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
                placeholder="https://twitter.com/username"
              />
            </div>

            <div>
              <label htmlFor="facebook" className="block text-sm font-medium text-gray-200">
                Facebook
              </label>
              <input
                type="url"
                id="facebook"
                value={formData.socialMedia.facebook || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  socialMedia: { ...formData.socialMedia, facebook: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 text-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
                placeholder="https://facebook.com/username"
              />
            </div>
          </div>
        </div>

        {/* Featured Toggle */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="featured"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="featured" className="ml-2 block text-sm font-medium text-gray-200">
            Featured Star
          </label>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-700 text-gray-300 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {isEdit ? 'Update Star' : 'Create Star'}
        </button>
      </div>
    </form>
  );
} 