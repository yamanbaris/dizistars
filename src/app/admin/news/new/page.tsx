'use client';

import { useRouter } from 'next/navigation';
import ArticleForm from '@/components/admin/forms/ArticleForm';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function NewArticlePage() {
  const router = useRouter();

  const handleSubmit = (data: any) => {
    // Here you would typically make an API call to create the article
    console.log('Creating article:', data);
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-400 hover:text-gray-200"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to News
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-700">
            <h3 className="text-lg font-medium leading-6 text-white">
              Create New Article
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              Fill in the information below to create a new article.
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <ArticleForm
              onSubmit={handleSubmit}
              onCancel={() => router.back()}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 