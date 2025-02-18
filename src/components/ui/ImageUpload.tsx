import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Loader2, Upload, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

interface ImageUploadProps {
  bucket: 'star_images' | 'news_images' | 'user_avatars' | 'gallery_images';
  path: string;
  onUploadComplete: (url: string) => void;
  onError: (error: string) => void;
  maxSize?: number; // in bytes
  aspectRatio?: number; // width/height
  className?: string;
  currentImageUrl?: string;
}

export function ImageUpload({
  bucket,
  path,
  onUploadComplete,
  onError,
  maxSize = 5 * 1024 * 1024, // 5MB default
  aspectRatio,
  className = '',
  currentImageUrl,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (!file) {
        onError('No file selected');
        return;
      }

      if (file.size > maxSize) {
        onError(`File size must be less than ${maxSize / 1024 / 1024}MB`);
        return;
      }

      try {
        setIsUploading(true);
        
        // Check if we have an authenticated session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          throw new Error('You must be logged in to upload images');
        }
        
        // Create object URL for preview
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        // Generate a unique filename to prevent conflicts
        const fileExt = file.name.split('.').pop();
        const fileName = `${path}_${Date.now()}.${fileExt}`;
        
        console.log('Uploading to bucket:', bucket);
        console.log('File path:', fileName);

        // Upload to Supabase Storage
        const { data, error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(fileName, file, {
            upsert: true,
            contentType: file.type,
          });

        if (uploadError) {
          console.error('Supabase upload error:', uploadError);
          throw new Error(uploadError.message || 'Failed to upload image');
        }

        if (!data) {
          throw new Error('No data returned from upload');
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(fileName);

        console.log('Public URL:', publicUrl);
        
        // If there was a previous image, try to delete it
        if (currentImageUrl) {
          try {
            const oldFileName = currentImageUrl.split('/').pop();
            if (oldFileName) {
              await supabase.storage
                .from(bucket)
                .remove([oldFileName]);
            }
          } catch (deleteError) {
            console.warn('Failed to delete old image:', deleteError);
          }
        }

        onUploadComplete(publicUrl);
        
      } catch (error: any) {
        console.error('Upload error:', error);
        setPreview(null);
        onError(error?.message || 'Failed to upload image. Please try again.');
      } finally {
        setIsUploading(false);
      }
    },
    [bucket, path, maxSize, onUploadComplete, onError, currentImageUrl]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': [],
    },
    maxFiles: 1,
  });

  const removeImage = async () => {
    if (currentImageUrl) {
      try {
        const fileName = currentImageUrl.split('/').pop();
        if (fileName) {
          await supabase.storage
            .from(bucket)
            .remove([fileName]);
        }
      } catch (error) {
        console.warn('Failed to delete image:', error);
      }
    }
    setPreview(null);
    onUploadComplete('');
  };

  return (
    <div className={`relative ${className}`}>
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
          transition-colors duration-200 ease-in-out
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}
          ${preview ? 'border-none p-0' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {isUploading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="ml-2">Uploading...</span>
          </div>
        ) : preview ? (
          <div className="relative group">
            <Image
              src={preview?.startsWith('/') ? preview : `/${preview}`}
              alt="Upload preview"
              width={400}
              height={400 / (aspectRatio || 1)}
              className="rounded-lg object-cover w-full"
              onError={(e) => {
                console.error('Image load error:', e);
                setPreview(null);
                onError('Failed to load image preview');
              }}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage();
                }}
                className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              Drag & drop an image here, or click to select
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Supported formats: JPEG, PNG, WebP
            </p>
            <p className="text-xs text-gray-400">
              Max size: {maxSize / 1024 / 1024}MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 