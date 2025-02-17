'use client';

import { useRouter } from 'next/navigation';
import ArticleForm from '@/components/admin/forms/ArticleForm';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

// This would typically come from an API call
const mockArticleData = {
  title: 'Çağatay Ulusoy\'s New Series Announcement',
  content: 'Turkish star Çağatay Ulusoy has been cast in a new Netflix series...',
  starId: 1,
  status: 'Published' as const,
  publishDate: '2024-02-15',
  excerpt: 'Exciting news for fans as Çağatay Ulusoy announces his next project.',
  metaTitle: 'Çağatay Ulusoy Cast in New Netflix Series | DiziStars News',
  metaDescription: 'Turkish actor Çağatay Ulusoy has been cast in an upcoming Netflix series. Get all the details about his new role and the project.'
};

export default function EditArticlePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  const handleSubmit = (data: any) => {
    // Here you would typically make an API call to update the article
    console.log('Updating article:', id, data);
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
              Edit Article
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              Update the information below to modify the article.
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <ArticleForm
              initialData={mockArticleData}
              onSubmit={handleSubmit}
              onCancel={() => router.back()}
              isEdit
            />
          </div>
        </div>
      </div>
    </div>
  );
} 