import { ImageUpload } from '@/components/ui/ImageUpload';
import { toast } from 'sonner';

interface NewsImageUploadProps {
  newsId: string;
  currentImageUrl?: string;
  onUpdate: (imageUrl: string) => void;
}

export function NewsImageUpload({ newsId, currentImageUrl, onUpdate }: NewsImageUploadProps) {
  return (
    <ImageUpload
      bucket="news_images"
      path={newsId}
      currentImageUrl={currentImageUrl}
      maxSize={5 * 1024 * 1024} // 5MB
      aspectRatio={16/9} // Widescreen aspect ratio for news images
      onUploadComplete={(url) => {
        onUpdate(url);
        toast.success('News image updated successfully');
      }}
      onError={(error) => toast.error(error)}
      className="w-full max-w-2xl mx-auto"
    />
  );
} 