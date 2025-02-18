'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { addTouchHandlers, isMobileDevice, optimizedScroll } from '@/lib/mobile-utils'
import { getFeaturedStars, getTrendingStars, getRisingStars, getInfluentialStars, getLatestNews } from '@/lib/database'
import { getStarImageUrl, getNewsImageUrl, getUserAvatarUrl } from '@/lib/supabase/storage'
import { format } from 'date-fns'

type Star = {
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
};

type NewsArticle = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image: string;
  author_id: string;
  star_id?: string;
  status: 'published' | 'draft' | 'archived';
  published_at?: string;
  created_at: string;
  updated_at: string;
  users?: {
    name: string;
    avatar_url?: string;
  };
};

export default function Home() {
  const [currentBanner, setCurrentBanner] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // State for each section with proper types
  const [featuredStars, setFeaturedStars] = useState<Star[]>([])
  const [trendingStars, setTrendingStars] = useState<Star[]>([])
  const [risingStars, setRisingStars] = useState<Star[]>([])
  const [influentialStars, setInfluentialStars] = useState<Star[]>([])
  const [latestNews, setLatestNews] = useState<NewsArticle[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const [featured, trending, rising, influential, news] = await Promise.all([
          getFeaturedStars(),
          getTrendingStars(),
          getRisingStars(),
          getInfluentialStars(),
          getLatestNews()
        ])

        if (featured) setFeaturedStars(featured as Star[])
        if (trending) setTrendingStars(trending as Star[])
        if (rising) setRisingStars(rising as Star[])
        if (influential) setInfluentialStars(influential as Star[])
        if (news) setLatestNews(news as NewsArticle[])
      } catch (err) {
        console.error('Error loading data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load content')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (featuredStars.length > 0) {
        setCurrentBanner((prev) => (prev + 1) % featuredStars.length)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [featuredStars.length])

  useEffect(() => {
    if (contentRef.current && isMobileDevice()) {
      const cleanup = addTouchHandlers(contentRef.current, {
        onSwipe: (direction) => {
          if (direction === 'left') {
            setCurrentBanner((prev) => (prev + 1) % featuredStars.length)
          } else if (direction === 'right') {
            setCurrentBanner((prev) => (prev - 1 + featuredStars.length) % featuredStars.length)
          }
        }
      })

      return () => cleanup()
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-primary">Loading...</div>
      </div>
    )
  }

  const EmptyState = ({ message = "No content yet" }: { message?: string }) => (
    <div className="w-full py-12 flex items-center justify-center">
      <p className="text-white/50 text-lg">{message}</p>
    </div>
  )

  return (
    <main className="min-h-screen bg-dark">
      {/* Hero Banner */}
      <section ref={contentRef} className="relative h-[90vh] md:h-screen overflow-hidden">
        {featuredStars.length > 0 ? (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentBanner}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent z-10" />
                <Image
                  src={getStarImageUrl(featuredStars[currentBanner]?.profile_image_url) || '/img/star-placeholder.jpeg'}
                  alt={featuredStars[currentBanner]?.full_name || 'Featured Star'}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 z-20 flex items-end">
                  <div className="container mx-auto px-4 pb-20 md:pb-32">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="max-w-xl space-y-4"
                    >
                      <h2 className="text-sm md:text-base text-primary font-medium">
                        Featured {featuredStars[currentBanner]?.star_type}
                      </h2>
                      <h1 className="text-4xl md:text-6xl font-bold text-white">
                        {featuredStars[currentBanner]?.full_name}
                      </h1>
                      <p className="text-lg md:text-xl text-white/80">
                        {featuredStars[currentBanner]?.current_project ? 
                          `Currently starring in ${featuredStars[currentBanner].current_project}` : 
                          'Turkish entertainment icon'}
                      </p>
                      <div className="pt-4">
                        <Link
                          href={`/stars/${featuredStars[currentBanner]?.slug}`}
                          className="inline-block px-8 py-4 rounded-lg bg-primary text-dark font-medium hover:bg-primary/90 transition-colors active:bg-primary/80 touch-manipulation"
                        >
                          View Profile
                        </Link>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Banner Navigation */}
            <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center gap-2">
              {featuredStars.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBanner(index)}
                  className={`w-3 h-3 rounded-full transition-all touch-manipulation ${
                    index === currentBanner ? 'bg-primary scale-110' : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <EmptyState message="No featured stars yet" />
          </div>
        )}
      </section>

      {/* Main Content with Sidebar */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 space-y-16 md:space-y-24">
            {/* Top Stars Section */}
            <div className="space-y-8">
              <div className="flex justify-between items-end">
                <h2 className="text-3xl md:text-4xl font-bold text-white">Top Stars</h2>
                <Link
                  href="/stars"
                  className="text-primary hover:text-primary/80 transition-colors touch-manipulation"
                >
                  View All
                </Link>
              </div>
              {trendingStars.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {trendingStars.map((star) => (
                    <Link
                      key={star.id}
                      href={`/stars/${star.slug}`}
                      className="group relative aspect-[3/4] rounded-xl overflow-hidden touch-manipulation"
                    >
                      <Image
                        src={getStarImageUrl(star.profile_image_url) || '/img/star-placeholder.jpeg'}
                        alt={star.full_name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <h3 className="text-white font-medium text-lg">{star.full_name}</h3>
                        <p className="text-white/70 text-sm capitalize">{star.star_type}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-primary text-sm">{star.current_project || 'No current project'}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyState />
              )}
            </div>

            {/* Rising Stars Section */}
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white">Rising Stars</h2>
              {risingStars.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {risingStars.map((star) => (
                    <Link
                      key={star.id}
                      href={`/stars/${star.slug}`}
                      className="group relative aspect-square rounded-xl overflow-hidden touch-manipulation"
                    >
                      <Image
                        src={getStarImageUrl(star.profile_image_url) || '/img/star-placeholder.jpeg'}
                        alt={star.full_name}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <h3 className="text-white font-medium">{star.full_name}</h3>
                        <p className="text-white/70 text-sm">
                          Born: {new Date(star.birth_date).toLocaleDateString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyState />
              )}
            </div>

            {/* Influential Stars Section */}
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white">Most Influential</h2>
              {influentialStars.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {influentialStars.map((star) => (
                    <Link
                      key={star.id}
                      href={`/stars/${star.slug}`}
                      className="group bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-colors touch-manipulation"
                    >
                      <div className="relative aspect-square">
                        <Image
                          src={getStarImageUrl(star.profile_image_url) || '/img/star-placeholder.jpeg'}
                          alt={star.full_name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                        <div className="absolute inset-x-0 bottom-0 p-4">
                          <h3 className="text-white font-medium text-lg">{star.full_name}</h3>
                          <p className="text-white/70 text-sm capitalize">{star.star_type}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-primary text-sm">{star.current_project || 'No current project'}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyState />
              )}
            </div>

            {/* Latest News Section */}
            <div className="space-y-8">
              <div className="flex justify-between items-end">
                <h2 className="text-3xl md:text-4xl font-bold text-white">Latest News</h2>
                <Link
                  href="/news"
                  className="text-primary hover:text-primary/80 transition-colors touch-manipulation"
                >
                  View All
                </Link>
              </div>

              {latestNews.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {latestNews.map((news) => (
                    <Link
                      key={news.id}
                      href={`/news/${news.id}`}
                      className="group bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-colors"
                    >
                      <div className="relative aspect-video">
                        <Image
                          src={getNewsImageUrl(news.cover_image) || '/img/cover-placeholder.jpeg'}
                          alt={news.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-white/40 text-xs">
                            {format(new Date(news.published_at || news.created_at), 'MMMM d, yyyy')}
                          </span>
                          {news.users && (
                            <span className="text-white/60 text-xs">
                              by {news.users.name}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors line-clamp-2">
                          {news.title}
                        </h3>
                        <p className="text-white/70 text-sm line-clamp-2 mt-2">
                          {news.excerpt}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyState message="No news articles available" />
              )}
            </div>
          </div>

          {/* Right Sidebar - Hidden on mobile */}
          <div className="hidden lg:block lg:w-80 space-y-8">
            {/* Trending Now */}
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                Trending Now
              </h3>
              {trendingStars.length > 0 ? (
                <div className="space-y-4">
                  {trendingStars.slice(0, 5).map((star, index) => (
                    <Link 
                      href={`/stars/${star.slug}`} 
                      key={star.id}
                      className="flex items-center gap-3 group cursor-pointer"
                    >
                      <span className="text-primary font-bold">#{index + 1}</span>
                      <div className="relative w-12 h-12 rounded-full overflow-hidden">
                        <Image
                          src={getStarImageUrl(star.profile_image_url) || '/img/star-placeholder.jpeg'}
                          alt={star.full_name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-white font-medium text-sm group-hover:text-primary transition-colors">
                          {star.full_name}
                        </h4>
                        <p className="text-white/60 text-xs">
                          {star.current_project || 'No current project'}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyState message="No trending stars" />
              )}
            </div>

            {/* Fan Rankings */}
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                Fan Rankings
              </h3>
              {trendingStars.length > 0 ? (
                <div className="space-y-4">
                  {trendingStars.slice(0, 4).map((star, index) => (
                    <div key={star.id} className="relative">
                      <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden">
                          <Image
                            src={getStarImageUrl(star.profile_image_url) || '/img/star-placeholder.jpeg'}
                            alt={star.full_name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-medium text-sm group-hover:text-primary transition-colors">
                            {star.full_name}
                          </h4>
                          <div className="w-full bg-white/10 h-2 rounded-full mt-1">
                            <div 
                              className="bg-primary h-full rounded-full" 
                              style={{ width: `${Math.min(100, ((star.filmography?.length || 0) / 20) * 100)}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-primary font-medium text-sm">
                          {star.filmography?.length || 0} projects
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState message="No fan rankings available" />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
