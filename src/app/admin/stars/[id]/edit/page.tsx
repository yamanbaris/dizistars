'use client';

import { useRouter } from 'next/navigation';
import StarForm from '@/components/admin/forms/StarForm';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

// This would typically come from an API call
const mockStarData = {
  name: 'Çağatay Ulusoy',
  type: 'Actor' as const,
  birthDate: '1990-09-23',
  birthPlace: 'Istanbul, Turkey',
  biography: 'Çağatay Ulusoy is a Turkish actor and model who rose to prominence...',
  featured: true,
  socialMedia: {
    instagram: 'https://instagram.com/cagatayulusoy',
    twitter: 'https://twitter.com/cagatayulusoy',
    facebook: 'https://facebook.com/cagatayulusoy'
  }
};

export default function EditStarPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  const handleSubmit = (data: any) => {
    // Here you would typically make an API call to update the star
    console.log('Updating star:', id, data);
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
              initialData={mockStarData}
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