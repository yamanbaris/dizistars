'use client';

/* cSpell:words supabase sonner */

import { useState, useEffect, useTransition } from 'react';
import DashboardCard from '../DashboardCard';
import Modal from '../Modal';
import ArticleForm, { ArticleFormData } from '../forms/ArticleForm';
import { 
  PencilIcon, 
  TrashIcon, 
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline';
import { getNews, createNews, updateNews } from '@/lib/database';
import type { TableRow } from '@/lib/supabase';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useAuth } from '@/app/auth/AuthContext';

type News = TableRow<'news'>;

export default function NewsTab() {
  const { user } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [news, setNews] = useState<News[]>([]);
  const [totalNews, setTotalNews] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  const loadNews = async () => {
    try {
      setLoading(true);
      const { data, count } = await getNews(currentPage, 10);
      setNews(data as News[]);
      setTotalNews(count);
    } catch (error) {
      console.error('Error loading news:', error);
      toast.error('Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, [currentPage, searchTerm]);

  async function handleAddFormAction(formData: FormData) {
    const articleData = JSON.parse(formData.get('formData') as string) as ArticleFormData;
    
    startTransition(async () => {
      try {
        await createNews({
          ...articleData,
          author_id: user?.id || ''
        });
        setIsAddModalOpen(false);
        await loadNews();
        toast.success('Article added successfully');
      } catch (error) {
        console.error('Error adding article:', error);
        toast.error('Failed to add article');
      }
    });
  }

  async function handleEditFormAction(formData: FormData) {
    if (!selectedArticle) return;
    
    const articleData = JSON.parse(formData.get('formData') as string) as ArticleFormData;
    
    startTransition(async () => {
      try {
        await updateNews(selectedArticle.id, {
          ...articleData,
          author_id: selectedArticle.author_id
        });
        setIsEditModalOpen(false);
        setSelectedArticle(null);
        await loadNews();
        toast.success('Article updated successfully');
      } catch (error) {
        console.error('Error updating article:', error);
        toast.error('Failed to update article');
      }
    });
  }

  const openEditModal = (article: News) => {
    setSelectedArticle(article);
    setIsEditModalOpen(true);
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
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Add New Article
        </button>
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
                  Author
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Published At
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
              ) : news.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-400">
                    No articles found
                  </td>
                </tr>
              ) : (
                news.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                      {article.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                      {article.users?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        article.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : article.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                      {article.published_at ? format(new Date(article.published_at), 'MMM d, yyyy') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => openEditModal(article)}
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
        {totalNews > 0 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-700">
            <div className="text-sm text-gray-400">
              Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, totalNews)} of {totalNews} articles
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
                disabled={currentPage * 10 >= totalNews}
                className="px-3 py-1 rounded bg-gray-800 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </DashboardCard>

      {/* Add Article Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Article"
      >
        <form action={handleAddFormAction}>
          <ArticleForm
            onSubmitId="add-article-form"
            onCancelId="add-article-cancel"
            initialData={{
              title: '',
              content: '',
              excerpt: '',
              slug: '',
              cover_image: '',
              author_id: user?.id || '',
              status: 'draft',
              published_at: undefined
            }}
          />
        </form>
      </Modal>

      {/* Edit Article Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedArticle(null);
        }}
        title="Edit Article"
      >
        {selectedArticle && (
          <form action={handleEditFormAction}>
            <ArticleForm
              initialData={{
                title: selectedArticle.title,
                content: selectedArticle.content,
                excerpt: selectedArticle.excerpt,
                slug: selectedArticle.slug,
                cover_image: selectedArticle.cover_image,
                status: selectedArticle.status,
                published_at: selectedArticle.published_at,
                author_id: selectedArticle.author_id
              }}
              onSubmitId="edit-article-form"
              onCancelId="edit-article-cancel"
              isEdit
            />
          </form>
        )}
      </Modal>
    </div>
  );
} 