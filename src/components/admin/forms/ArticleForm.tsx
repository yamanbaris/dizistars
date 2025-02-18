'use client';

import { useState } from 'react';
import { useAuth } from '@/app/auth/AuthContext';

export interface ArticleFormData {
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  cover_image: string;
  author_id: string;
  status: 'published' | 'draft' | 'archived';
  published_at?: string;
}

interface ArticleFormProps {
  initialData?: ArticleFormData;
  onSubmitId: string; // Using an ID to identify the form submission action
  onCancelId: string; // Using an ID to identify the cancel action
  isEdit?: boolean;
}

export default function ArticleForm({ initialData, onSubmitId, onCancelId, isEdit = false }: ArticleFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<ArticleFormData>(initialData || {
    title: '',
    content: '',
    excerpt: '',
    slug: '',
    cover_image: '',
    author_id: user?.id || '',
    status: 'draft',
    published_at: undefined
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Use the form action pattern for Next.js
    const formAction = document.getElementById(onSubmitId) as HTMLFormElement;
    if (formAction) {
      formAction.value = JSON.stringify(formData);
      formAction.form?.submit();
    }
  };

  const handleCancel = () => {
    // Use the form action pattern for Next.js
    const cancelAction = document.getElementById(onCancelId) as HTMLFormElement;
    if (cancelAction) {
      cancelAction.form?.submit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  return (
    <form action={onSubmitId} method="POST" onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="formData" id={onSubmitId} value="" />
      <input type="hidden" name="cancelAction" id={onCancelId} value="" />
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-200">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleTitleChange}
          className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 text-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-200">
          Excerpt
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          value={formData.excerpt}
          onChange={handleChange}
          rows={2}
          className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 text-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-200">
          Content
        </label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows={10}
          className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 text-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="cover_image" className="block text-sm font-medium text-gray-200">
          Cover Image URL
        </label>
        <input
          type="url"
          id="cover_image"
          name="cover_image"
          value={formData.cover_image}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 text-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-200">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 text-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {formData.status === 'published' && (
        <div>
          <label htmlFor="published_at" className="block text-sm font-medium text-gray-200">
            Publish Date
          </label>
          <input
            type="datetime-local"
            id="published_at"
            name="published_at"
            value={formData.published_at || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 text-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 text-sm font-medium text-gray-200 bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isEdit ? 'Update' : 'Create'} Article
        </button>
      </div>
    </form>
  );
} 