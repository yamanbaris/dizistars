import React, { useState } from 'react'
import Image from 'next/image'
import { useAuth } from '@/app/auth/AuthContext'
import { uploadImage, BUCKET_NAMES } from '@/lib/supabase/storage'
import { toast } from 'sonner'

interface AvatarUploadProps {
  currentAvatarUrl?: string | null
  onUploadComplete?: (url: string) => void
}

export function AvatarUpload({ currentAvatarUrl, onUploadComplete }: AvatarUploadProps) {
  const { user, updateProfile } = useAuth()
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    // Preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload
    try {
      setIsUploading(true)
      const path = `${user.id}/${file.name}`
      const url = await uploadImage(BUCKET_NAMES.USER_AVATARS, file, path)

      if (url) {
        await updateProfile({ avatar_url: url })
        onUploadComplete?.(url)
        toast.success('Avatar updated successfully')
      }
    } catch (error) {
      console.error('Error uploading avatar:', error)
      toast.error('Failed to upload avatar')
      setPreviewUrl(null)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="relative group">
      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#101114] bg-[#1E1E1E]">
        <Image
          src={previewUrl || currentAvatarUrl || '/img/avatar-placeholder.jpg'}
          alt="Avatar"
          width={128}
          height={128}
          className="object-cover w-full h-full"
        />
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      
      <label 
        className="absolute bottom-0 right-0 p-2 rounded-full bg-[#C8AA6E] text-black hover:bg-[#D4B87A] transition-colors cursor-pointer"
        htmlFor="avatar-upload"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
      </label>
    </div>
  )
} 