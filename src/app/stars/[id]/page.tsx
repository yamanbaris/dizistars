'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { format } from 'date-fns'
import { useUserFeatures } from '@/app/features/UserFeaturesContext'
import { createClient } from '@/lib/supabase/client'
import { getStarNews } from '@/lib/database'
import { useAuth } from '@/app/auth/AuthContext'

interface Star {
  id: string;
  full_name: string;
  profile_image_url?: string;
  star_type: 'actor' | 'actress';
  current_project?: string;
  birth_date: string;
  birth_place: string;
  biography: string;
  education: string;
  cover_image_url?: string;
  is_featured: boolean;
  is_trending: boolean;
  is_rising: boolean;
  is_influential: boolean;
  filmography?: {
    title: string;
    role: string;
    year: number;
    streaming_on?: string;
  }[];
  gallery_images?: string[];
  slug: string;
  created_at: string;
  updated_at: string;
}

interface SocialMedia {
  id: string;
  star_id: string;
  platform: 'instagram' | 'twitter' | 'facebook' | 'tiktok';
  url: string;
  created_at: string;
  updated_at: string;
}

type NewsArticle = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image: string;
  author_id: string;
  status: 'published' | 'draft' | 'archived';
  published_at?: string;
  created_at: string;
  updated_at: string;
};

interface Comment {
  id: string;
  user_id: string;
  target_type: 'star' | 'news';
  target_id: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  user?: {
    name: string;
    avatar_url?: string;
  };
}

export default function StarProfile() {
  const params = useParams()
  const id = Array.isArray(params.id) ? params.id[0] : params.id
  const { user } = useAuth()
  const [isFavorited, setIsFavorited] = useState(false)
  const [star, setStar] = useState<Star | null>(null)
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  type TabType = 'overview' | 'biography' | 'filmography' | 'photos'
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [selectedPhoto, setSelectedPhoto] = useState<{ src: string; index: number } | null>(null)
  const [starNews, setStarNews] = useState<NewsArticle[]>([])
  const [comments, setComments] = useState<Comment[]>([])

  useEffect(() => {
    const loadStarData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch star data
        const { data: starData, error: starError } = await createClient()
          .from('stars')
          .select('*')
          .eq('slug', id)
          .single()

        if (starError) throw starError

        if (!starData) {
          setError('Star not found')
          return
        }

        setStar(starData)

        // Check if star is favorited by current user
        if (user) {
          const { data: favoriteData, error: favoriteError } = await createClient()
            .from('favorites')
            .select('id')
            .eq('user_id', user.id)
            .eq('star_id', starData.id)
            .single()

          if (favoriteError && favoriteError.code !== 'PGRST116') {
            throw favoriteError
          }
          
          setIsFavorited(!!favoriteData)
        }

        // Fetch social media data
        const { data: socialMediaData, error: socialMediaError } = await createClient()
          .from('social_media')
          .select('*')
          .eq('star_id', starData.id)

        if (socialMediaError) throw socialMediaError
        setSocialMedia(socialMediaData || [])

        // Fetch star news
        const newsData = await getStarNews(starData.id)
        setStarNews(newsData)

        // Fetch comments
        const { data: commentsData, error: commentsError } = await createClient()
          .from('comments')
          .select(`
            *,
            users (
              name,
              avatar_url
            )
          `)
          .eq('target_type', 'star')
          .eq('target_id', starData.id)
          .eq('status', 'approved')
          .order('created_at', { ascending: false })
          .limit(10)

        if (commentsError) throw commentsError
        setComments(commentsData || [])

      } catch (error) {
        console.error('Error fetching star data:', error)
        setError('Failed to load star data')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadStarData()
    }
  }, [id, user])

  const handleFavoriteToggle = async () => {
    if (!user || !star) return

    try {
      if (isFavorited) {
        // Remove from favorites
        const { error } = await createClient()
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('star_id', star.id)

        if (error) throw error
        setIsFavorited(false)
      } else {
        // Add to favorites
        const { error } = await createClient()
          .from('favorites')
          .insert([
            {
              user_id: user.id,
              star_id: star.id
            }
          ])

        if (error) throw error
        setIsFavorited(true)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const renderSocialMedia = () => {
    if (!socialMedia.length) return null;

    return (
      <div className="flex justify-center gap-4">
        {socialMedia.map((social) => (
          <a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center hover:bg-primary/20 transition-colors group"
          >
            {social.platform === 'instagram' && (
              <svg className="w-4 h-4 text-white/60 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
              </svg>
            )}
          </a>
        ))}
      </div>
    );
  };

  const renderBiographyDetails = () => {
    if (!star?.biography) {
      return (
        <div className="text-white/60 text-center py-8">
          No biography content available
        </div>
      );
    }
    return (
      <div className="prose prose-invert max-w-none">
        <p className="text-white/80">{star.biography}</p>
      </div>
    );
  };

  const renderFilmography = () => {
    if (!star?.filmography || star.filmography.length === 0) {
      return (
        <div className="text-white/60 text-center py-8">
          No filmography content available
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {star.filmography.map((project, index) => (
            <div key={index} className="bg-white/5 rounded-xl p-4 space-y-2">
              <h4 className="text-lg font-medium text-white">{project.title}</h4>
              <div className="text-white/60 text-sm space-y-1">
                <p>Role: {project.role}</p>
                <p>Year: {project.year}</p>
                {project.streaming_on && <p>Streaming on: {project.streaming_on}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPhotos = () => {
    if (!star) return null;
    
    if (!star.gallery_images || star.gallery_images.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 mb-4 rounded-full bg-white/5 flex items-center justify-center">
            <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-white mb-2">No Photos Yet</h3>
          <p className="text-white/60 text-center max-w-md">
            Stay tuned for photos of {star.full_name}. We'll be adding them soon.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {star.gallery_images.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="relative aspect-square rounded-lg overflow-hidden"
            onClick={() => setSelectedPhoto({ src: image, index })}
          >
            <Image
              src={image}
              alt={`${star.full_name} gallery image ${index + 1}`}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover hover:scale-105 transition-transform"
            />
          </motion.div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !star) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-500">{error || 'Star not found'}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-[#0A0A0A]">
      <div className="container mx-auto px-4 md:px-8 pt-24 pb-24 space-y-8">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-8">
          {/* Left Sidebar - Profile Info */}
          <aside className="lg:self-start">
            <div className="flex flex-col items-center lg:items-start pt-2">
              {/* Profile Image with Favorite Button */}
              <div className="relative w-[280px] h-[325px] mx-auto lg:mx-0">
                {/* Border Container */}
                <div className="absolute -inset-[2px] bg-primary/20 rounded-xl" />
                <div className="absolute inset-0 rounded-xl overflow-hidden">
                  <Image
                    src={star.profile_image_url || '/img/placeholder-profile.jpg'}
                    alt={star.full_name}
                    width={280}
                    height={420}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
                {/* Favorite Button */}
                {user && (
                  <button
                    onClick={handleFavoriteToggle}
                    className={`absolute top-4 right-4 px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                      isFavorited
                        ? 'bg-primary text-black'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    {isFavorited ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        Be Fan
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="space-y-4 mt-6 w-full">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <h1 className="text-3xl font-bold text-white">{star.full_name}</h1>
                  </div>
                </div>

                {/* Social Media Icons */}
                <div className="flex justify-center gap-4">
                  {renderSocialMedia()}
                </div>

                {/* Profile Info */}
                <div className="w-full bg-white/5 rounded-xl p-6 backdrop-blur-sm">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-white">
                      <svg className="w-5 h-5 text-primary/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-white/80">{new Date(star.birth_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                  </div>

                  {star.current_project && (
                    <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm text-white/60">Current Series</div>
                          <div className="text-lg font-medium text-white">{star.current_project}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div>
            {/* Navigation and Tab Content */}
            <main>
              {/* Navigation */}
              <nav className="bg-white/5 rounded-xl backdrop-blur-sm">
                <div className="flex flex-wrap">
                  {(['overview', 'biography', 'filmography', 'photos'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-4 text-sm font-medium capitalize relative flex-1 min-w-[120px] ${
                        activeTab === tab 
                          ? 'text-primary'
                          : 'text-third/60 hover:text-primary'
                      }`}
                    >
                      {tab}
                      {activeTab === tab && (
                        <motion.div
                          layoutId="tab-indicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </nav>

              {/* Tab Content */}
              <div className="mt-6">
                <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm">
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-8"
                    >
                      {/* Biography */}
                      <div>
                        {renderBiographyDetails()}
                      </div>
                    </motion.div>
                  )}

                  {/* Biography Tab */}
                  {activeTab === 'biography' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-16"
                    >
                      {/* Full Biography */}
                      <div>
                        <h2 className="text-2xl font-semibold text-white mb-6">Biography</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-8">
                          <div className="prose prose-invert max-w-none">
                            {star.biography ? (
                              <div className="text-white/80 leading-relaxed whitespace-pre-wrap">
                                {star.biography}
                              </div>
                            ) : (
                              <div className="text-white/60 text-center py-8">
                                No biography content available
                              </div>
                            )}
                          </div>
                          
                          {/* Quick Facts */}
                          <div className="space-y-4">
                            <div className="bg-dark/50 rounded-xl p-6 border border-primary/10">
                              <h3 className="text-lg font-semibold text-white mb-4">Quick Facts</h3>
                              <div className="grid grid-cols-1 gap-4">
                                <div className="p-4 rounded-lg bg-[#1A1A1A] flex items-start gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                  <div className="flex-1">
                                    <div className="text-sm text-gray-400 mb-1">Birth Date</div>
                                    <div className="text-lg text-white">
                                      {star.birth_date ? format(new Date(star.birth_date), 'MMM d, yyyy') : 'Not Available'}
                                    </div>
                                  </div>
                                </div>
                                <div className="p-4 rounded-lg bg-[#1A1A1A] flex items-start gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                  </div>
                                  <div className="flex-1">
                                    <div className="text-sm text-gray-400 mb-1">Birth Place</div>
                                    <div className="text-lg text-white">
                                      {star.birth_place || 'Not Available'}
                                    </div>
                                  </div>
                                </div>
                                <div className="p-4 rounded-lg bg-[#1A1A1A] flex items-start gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                  </div>
                                  <div className="flex-1">
                                    <div className="text-sm text-gray-400 mb-1">Education</div>
                                    <div className="text-lg text-white">
                                      {star.education || 'Not Available'}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Filmography Tab */}
                  {activeTab === 'filmography' && star && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-8"
                    >
                      {/* Filmography Content */}
                      <div className="space-y-8">
                        {renderFilmography()}
                      </div>
                    </motion.div>
                  )}

                  {/* Photos Tab */}
                  {activeTab === 'photos' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-8"
                    >
                      {renderPhotos()}

                      {/* Full Screen Photo View */}
                      {selectedPhoto && star?.gallery_images && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="fixed inset-0 bg-black z-[60] overflow-hidden"
                        >
                          <div className="absolute inset-0 flex items-center justify-center">
                            {/* Close Button */}
                            <button
                              onClick={() => setSelectedPhoto(null)}
                              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center z-50"
                            >
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>

                            {/* Navigation Buttons */}
                            {selectedPhoto.index > 0 && (
                              <button
                                onClick={() => {
                                  if (star.gallery_images) {
                                    const prevImage = star.gallery_images[selectedPhoto.index - 1];
                                    setSelectedPhoto({ src: prevImage, index: selectedPhoto.index - 1 })
                                  }
                                }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center z-50"
                              >
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                              </button>
                            )}
                            {selectedPhoto.index < (star.gallery_images.length - 1) && (
                              <button
                                onClick={() => {
                                  if (star.gallery_images) {
                                    const nextImage = star.gallery_images[selectedPhoto.index + 1];
                                    setSelectedPhoto({ src: nextImage, index: selectedPhoto.index + 1 })
                                  }
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center z-50"
                              >
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            )}

                            {/* Main Photo */}
                            <div className="relative w-full h-full flex items-center justify-center">
                              <Image
                                src={selectedPhoto.src}
                                alt={`${star.full_name} gallery image`}
                                width={1200}
                                height={800}
                                className="max-w-full max-h-[90vh] object-contain"
                              />
                            </div>

                            {/* Photo Counter */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
                              <p className="text-white text-sm">
                                {selectedPhoto.index + 1} / {star.gallery_images.length}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>

        {/* Latest News Section - Full Width */}
        <section className="bg-white/5 rounded-xl backdrop-blur-sm">
          <div className="px-6 py-5 border-b border-white/5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H14" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white">Latest News</h2>
                <p className="text-white/60 text-sm">Stay updated with {star?.full_name}'s latest activities and achievements</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-white/40">{starNews.length} articles</span>
                {starNews.length > 0 && (
                  <>
                    <span className="text-sm text-white/40">•</span>
                    <span className="text-sm text-white/40">
                      Last updated {starNews[0].published_at 
                        ? format(new Date(starNews[0].published_at), 'MMM d, yyyy') 
                        : 'N/A'}
                    </span>
                  </>
                )}
              </div>
              {starNews.length > 0 && (
                <button 
                  onClick={() => window.location.href = `/stars/${id}/news`}
                  className="text-primary hover:text-primary/80 transition-colors text-sm font-medium flex items-center gap-2"
                >
                  View all news
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
            {starNews.length > 0 ? (
              starNews.map((article) => (
                <div key={article.id} className="group cursor-pointer">
                  <div className="aspect-video rounded-lg overflow-hidden mb-3">
                    <Image
                      src={article.cover_image}
                      alt={article.title}
                      width={320}
                      height={180}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <time className="text-white/40 text-sm">
                    {article.published_at 
                      ? format(new Date(article.published_at), 'MMMM d, yyyy')
                      : 'Date not available'}
                  </time>
                  <h4 className="text-white font-medium mt-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h4>
                </div>
              ))
            ) : (
              <div className="col-span-4 py-16 flex flex-col items-center justify-center">
                <div className="w-16 h-16 mb-4 rounded-full bg-white/5 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H14" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-white mb-2">No News Yet</h3>
                <p className="text-white/60 text-center max-w-md">
                  Stay tuned for the latest updates and news about {star?.full_name}. We'll keep you posted on their upcoming projects and achievements.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Comments Section */}
        <section className="bg-white/5 rounded-xl backdrop-blur-sm">
          <div className="px-6 py-5 border-b border-white/5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white">Fan Comments</h2>
                  <p className="text-white/60 text-sm">Join the conversation about {star.full_name}</p>
                </div>
              </div>
              <div className="text-white/60 text-sm">
                {comments.length} comments
              </div>
            </div>
          </div>

          <div className="p-6">
            {user ? (
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden flex-shrink-0">
                        {comment.user?.avatar_url ? (
                          <Image
                            src={comment.user.avatar_url}
                            alt={comment.user.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/40">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-white">{comment.user?.name || 'Anonymous'}</h4>
                          <time className="text-sm text-white/40">
                            {format(new Date(comment.created_at), 'MMM d, yyyy')}
                          </time>
                        </div>
                        <p className="text-white/80">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-white mb-1">Want to Join the Discussion?</h3>
                    <p className="text-white/60 mb-4">Log in to share your thoughts about {star.full_name} and connect with other fans.</p>
                    <div className="flex gap-3">
                      <a href="/login" className="px-6 py-2 bg-[#C8AA6E] text-black rounded-lg text-sm font-medium hover:bg-[#D4B87A] transition-colors">
                        Sign In
                      </a>
                      <a href="/register" className="px-6 py-2 bg-white/10 text-white rounded-lg text-sm font-medium hover:bg-white/20 transition-colors">
                        Create Account
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
  