'use client';

import { useState, useEffect } from 'react';
import { PhotoIcon } from '@heroicons/react/24/outline';

// This would typically come from an API call
const mockStars = [
  { id: 1, name: 'Çağatay Ulusoy' },
  { id: 2, name: 'Hande Erçel' },
  { id: 3, name: 'Burak Özçivit' },
  { id: 4, name: 'Demet Özdemir' },
];

interface ArticleFormData {
  title: string;
  content: string;
  starId: number;
  status: 'Draft' | 'Published' | 'Scheduled';
  publishDate: string;
  featuredImage?: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
}

interface ArticleFormProps {
  initialData?: ArticleFormData;
  onSubmit: (data: ArticleFormData) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

export default function ArticleForm({ initialData, onSubmit, onCancel, isEdit = false }: ArticleFormProps) {
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    content: '',
    starId: mockStars[0].id,
    status: 'Draft',
    publishDate: new Date().toISOString().split('T')[0],
    excerpt: '',
    metaTitle: '',
    metaDescription: ''
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
        {/* Featured Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Featured Image
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
          <div className="sm:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-200">
              Article Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 text-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
              required
            />
          </div>

          <div>
            <label htmlFor="star" className="block text-sm font-medium text-gray-200">
              Related Star
            </label>
            <select
              id="star"
              value={formData.starId}
              onChange={(e) => setFormData({ ...formData, starId: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 text-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
              required
            >
              {mockStars.map((star) => (
                <option key={star.id} value={star.id}>
                  {star.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-200">
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as ArticleFormData['status'] })}
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 text-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
              <option value="Scheduled">Scheduled</option>
            </select>
          </div>

          {formData.status === 'Scheduled' && (
            <div>
              <label htmlFor="publishDate" className="block text-sm font-medium text-gray-200">
                Publish Date
              </label>
              <input
                type="date"
                id="publishDate"
                value={formData.publishDate}
                onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 text-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
                required
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-200">
            Article Content
          </label>
          <textarea
            id="content"
            rows={10}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 text-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
            required
          />
        </div>

        {/* Excerpt */}
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-200">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            rows={3}
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 text-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
            required
          />
          <p className="mt-1 text-sm text-gray-400">
            A short summary of the article that appears in previews and search results.
          </p>
        </div>

        {/* SEO Section */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-200">SEO Settings</h4>
          <div>
            <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-200">
              Meta Title
            </label>
            <input
              type="text"
              id="metaTitle"
              value={formData.metaTitle}
              onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 text-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-200">
              Meta Description
            </label>
            <textarea
              id="metaDescription"
              rows={2}
              value={formData.metaDescription}
              onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 text-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
            />
          </div>
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
          {isEdit ? 'Update Article' : 'Create Article'}
        </button>
      </div>
    </form>
  );
} 