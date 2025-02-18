'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { format } from 'date-fns'
import { useAuth } from '@/app/auth/AuthContext'
import { useUserFeatures } from '@/app/features/UserFeaturesContext'
import { getStar } from '@/lib/database'
import { toast } from 'sonner'
import type { TableRow } from '@/types/supabase'

type Star = TableRow<'stars'>;

export default function StarProfile() {
  const { id } = useParams()
  const { user } = useAuth()
  const { favorites, addToFavorites, removeFromFavorites } = useUserFeatures()
  const [star, setStar] = useState<Star | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFavorited, setIsFavorited] = useState(false)

  useEffect(() => {
    const loadStar = async () => {
      try {
        setLoading(true)

        // Ensure id is a string
        const slugId = Array.isArray(id) ? id[0] : id

        // Fetch star data
        const starData = await getStar(slugId)
        if (!starData) {
          toast.error('Star not found')
          return
        }

        setStar(starData)

        // Check if star is favorited by current user
        if (user) {
          const isFav = favorites.some(fav => fav.star_id === starData.id)
          setIsFavorited(isFav)
        }
      } catch (error) {
        console.error('Error loading star:', error)
        toast.error('Failed to load star data')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadStar()
    }
  }, [id, user, favorites])

  const handleFavoriteClick = async () => {
    if (!user) {
      toast.error('Please log in to add favorites')
      return
    }

    if (!star) return

    try {
      if (isFavorited) {
        await removeFromFavorites(star.id)
        setIsFavorited(false)
      } else {
        await addToFavorites(star.id)
        setIsFavorited(true)
      }
    } catch (error) {
      console.error('Error updating favorite status:', error)
      toast.error('Failed to update favorite status')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!star) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-500">Star not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-[#0A0A0A]">
      {/* Cover Image */}
      <div className="h-[400px] w-full relative">
        {star.cover_image_url ? (
          <Image
            src={star.cover_image_url}
            alt={`${star.full_name} cover`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-gray-900 to-gray-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
      </div>

      <div className="container mx-auto px-4 md:px-8">
        {/* Profile Section */}
        <div className="relative -mt-32 mb-8">
          <div className="bg-white/5 rounded-xl backdrop-blur-sm p-6 flex flex-col md:flex-row gap-6 items-start">
            {/* Profile Image */}
            <div className="w-40 h-40 rounded-xl overflow-hidden relative flex-shrink-0">
              <Image
                src={star.profile_image_url}
                alt={star.full_name}
                fill
                className="object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-grow">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-3xl font-bold text-white">{star.full_name}</h1>
                <button
                  onClick={handleFavoriteClick}
                  className={`p-2 rounded-lg transition-colors ${
                    isFavorited 
                      ? 'bg-primary/10 text-primary hover:bg-primary/20' 
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  <svg className="w-6 h-6" fill={isFavorited ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {star.birth_date && (
                  <div>
                    <span className="text-white/40 text-sm">Birth Date</span>
                    <p className="text-white">
                      {format(new Date(star.birth_date), 'MMMM d, yyyy')}
                    </p>
                  </div>
                )}
                {star.birth_place && (
                  <div>
                    <span className="text-white/40 text-sm">Birth Place</span>
                    <p className="text-white">{star.birth_place}</p>
                  </div>
                )}
                {star.education && (
                  <div>
                    <span className="text-white/40 text-sm">Education</span>
                    <p className="text-white">{star.education}</p>
                  </div>
                )}
                {star.current_project && (
                  <div>
                    <span className="text-white/40 text-sm">Current Project</span>
                    <p className="text-white">{star.current_project}</p>
                  </div>
                )}
              </div>

              {star.biography && (
                <div>
                  <span className="text-white/40 text-sm">Biography</span>
                  <p className="text-white/80 mt-1">{star.biography}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status Tags */}
        <div className="flex flex-wrap gap-3 mb-8">
          {star.is_featured && (
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/10 text-yellow-500">
              Featured Star
            </span>
          )}
          {star.is_trending && (
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-500/10 text-blue-500">
              Trending
            </span>
          )}
          {star.is_rising && (
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-500/10 text-green-500">
              Rising Star
            </span>
          )}
          {star.is_influential && (
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-500/10 text-purple-500">
              Influential
            </span>
          )}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Overview Section */}
            <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-white mb-4">Overview</h2>
              {star.biography && (
                <p className="text-white/80">{star.biography}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
  