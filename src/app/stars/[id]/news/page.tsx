'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { format } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import { getStar, getStarNews } from '@/lib/database'
import { toast } from 'sonner'
import type { TableRow } from '@/types/supabase'

type Star = {
  id: string;
  full_name: string;
  profile_image_url?: string;
};

type NewsArticle = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image: string;
  author_id: string;
  status: 'draft' | 'published' | 'archived';
  published_at?: string;
  created_at: string;
  updated_at: string;
  users: {
    name: string;
    avatar_url: string | null | undefined;
  };
};

export default function StarNews() {
  const { id } = useParams()
  const [star, setStar] = useState<TableRow<'stars'> | null>(null)
  const [news, setNews] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadStarNews = async () => {
      try {
        setLoading(true)
        setError(null)

        // Ensure id is a string
        const slugId = Array.isArray(id) ? id[0] : id

        // Fetch star data first
        const starData = await getStar(slugId)
        if (!starData) {
          toast.error('Star not found')
          return
        }

        setStar(starData)

        // Fetch star news
        const newsData = await getStarNews(starData.id)
        if (newsData) {
          setNews(newsData.map(article => ({
            ...article,
            published_at: article.published_at || article.created_at // Fallback to created_at if published_at is null
          })))
        }
      } catch (error) {
        console.error('Error loading star and news:', error)
        toast.error('Failed to load star and news data')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadStarNews()
    }
  }, [id])

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
      <div className="container mx-auto px-4 md:px-8 pt-24 pb-24">
        {/* Header */}
        <div className="bg-white/5 rounded-xl backdrop-blur-sm mb-8">
          <div className="px-6 py-5 border-b border-white/5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H14" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-white">Latest News</h1>
                <p className="text-white/60 text-sm">All news and updates about {star.full_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <span className="text-sm text-white/40">{news.length} articles</span>
              {news.length > 0 && (
                <>
                  <span className="text-sm text-white/40">•</span>
                  <span className="text-sm text-white/40">
                    Last updated {news[0].published_at 
                      ? format(new Date(news[0].published_at), 'MMM d, yyyy') 
                      : 'N/A'}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* News Grid */}
        {news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((article) => (
              <div key={article.id} className="bg-white/5 rounded-xl overflow-hidden group">
                <div className="aspect-video relative">
                  <Image
                    src={article.cover_image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <time className="text-white/40 text-sm">
                    {article.published_at 
                      ? format(new Date(article.published_at), 'MMMM d, yyyy')
                      : 'Date not available'}
                  </time>
                  <h2 className="text-xl font-medium text-white mt-2 mb-3 group-hover:text-primary transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-white/60 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <button className="mt-4 text-primary hover:text-primary/80 transition-colors text-sm font-medium flex items-center gap-2">
                    Read more
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/5 rounded-xl py-16 flex flex-col items-center justify-center">
            <div className="w-16 h-16 mb-4 rounded-full bg-white/5 flex items-center justify-center">
              <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H14" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No News Yet</h3>
            <p className="text-white/60 text-center max-w-md">
              Stay tuned for the latest updates and news about {star.full_name}. We'll keep you posted on their upcoming projects and achievements.
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 