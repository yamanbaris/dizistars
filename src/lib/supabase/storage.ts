import { supabase } from './client'

// Always use the Supabase project URL, even in development
const STORAGE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL

export const BUCKET_NAMES = {
  STAR_IMAGES: 'star_images',
  NEWS_IMAGES: 'news_images',
  USER_AVATARS: 'user_avatars',
  GALLERY_IMAGES: 'gallery_images'
} as const

type BucketName = (typeof BUCKET_NAMES)[keyof typeof BUCKET_NAMES]

export const getPublicUrl = (bucket: BucketName, path: string) => {
  if (!path) return null
  if (path.startsWith('http')) return path // If already a full URL, return as is
  
  // Remove any leading slashes from the path
  const cleanPath = path.replace(/^\/+/, '')
  return `${STORAGE_URL}/storage/v1/object/public/${bucket}/${cleanPath}`
}

export const uploadImage = async (
  bucket: BucketName,
  file: File,
  path: string
) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (error) throw error
    return getPublicUrl(bucket, data.path)
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}

export const deleteImage = async (
  bucket: BucketName,
  path: string
) => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting image:', error)
    throw error
  }
}

// Helper to get star image URL (profile or cover)
export const getStarImageUrl = (path?: string) => {
  if (!path) return '/img/star-placeholder.jpeg'
  // If path starts with /img/, return as is since it's in public folder
  if (path.startsWith('/img/')) return path
  // Otherwise, try to get from Supabase storage
  return getPublicUrl(BUCKET_NAMES.STAR_IMAGES, path)
}

// Helper to get news image URL
export const getNewsImageUrl = (path?: string) => 
  path ? getPublicUrl(BUCKET_NAMES.NEWS_IMAGES, path) : '/img/cover-placeholder.jpeg'

// Helper to get user avatar URL
export const getUserAvatarUrl = (path?: string) => 
  path ? getPublicUrl(BUCKET_NAMES.USER_AVATARS, path) : '/img/avatar-placeholder.jpeg'

// Helper to get gallery image URL
export const getGalleryImageUrl = (path?: string) => 
  path ? getPublicUrl(BUCKET_NAMES.GALLERY_IMAGES, path) : '/img/gallery-placeholder.jpeg' 