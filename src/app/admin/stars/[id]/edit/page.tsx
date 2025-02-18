'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { getStar } from '@/lib/database';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import StarForm from '@/components/admin/forms/StarForm';
import type { TableRow } from '@/types/supabase';

/* cSpell:words supabase */

export default function EditStarPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [star, setStar] = useState<TableRow<'stars'> | null>(null);

  useEffect(() => {
    async function loadStar() {
      try {
        const data = await getStar(id as string);
        if (data) {
          setStar(data);
        } else {
          toast.error('Star not found');
          router.push('/admin/stars');
        }
      } catch (error) {
        console.error('Error loading star:', error);
        toast.error('Failed to load star data');
      } finally {
        setLoading(false);
      }
    }
    loadStar();
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!star) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-400 hover:text-gray-200"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Stars
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-700">
            <h3 className="text-lg font-medium leading-6 text-white">
              Edit Star Profile
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              Update the information below to modify the star profile.
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <StarForm
              initialData={star}
              onSubmit={() => router.push('/admin/stars')}
              onCancel={() => router.back()}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 