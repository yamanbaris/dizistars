'use client';

import { ImageUpload } from '@/components/ui/ImageUpload';
import { toast } from 'sonner';

interface StarProfileImageProps {
  starId: string;
  currentImageUrl?: string;
  onUpdate: (imageUrl: string) => void;
  name: string;
  type: 'actor' | 'actress';
}

export function StarProfileImage({ 
  starId, 
  currentImageUrl, 
  onUpdate,
  name,
  type
}: StarProfileImageProps) {
  return (
    <div className="p-4 border-b border-gray-700">
      <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-4">
        <ImageUpload
          bucket="star_images"
          path={starId}
          currentImageUrl={currentImageUrl}
          maxSize={5 * 1024 * 1024} // 5MB
          aspectRatio={1} // Square images for stars
          onUploadComplete={(url) => {
            onUpdate(url);
            toast.success('Profile image updated successfully');
          }}
          onError={(error) => toast.error(error)}
          className="w-full"
        />
      </div>
      <h2 className="text-lg font-medium text-white truncate">{name || 'New Star'}</h2>
      <p className="text-sm text-gray-400">{type}</p>
    </div>
  );
} 