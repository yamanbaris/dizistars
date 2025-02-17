'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import { getArticleBySlug, getRelatedArticles } from '@/data/news'
import ArticleCard from '@/components/ui/ArticleCard'

export default function ArticlePage({
  params
}: {
  params: { slug: string }
}) {
  const router = useRouter()
  const article = getArticleBySlug(params.slug)

  if (!article) {
    router.push('/news')
    return null
  }

  const relatedArticles = getRelatedArticles(article)

  return (
    <div className="min-h-screen bg-[#101114] pt-20">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] max-h-[700px]">
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#101114] via-[#101114]/70 to-transparent" />
        
        {/* Content */}
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-8 md:pb-12">
            <div className="max-w-3xl">
              <Link
                href="/news"
                className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 text-sm group"
              >
                <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to News
              </Link>

              <div className="space-y-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="px-3 py-1 text-xs font-medium bg-[#C8AA6E] text-black rounded">
                    {article.category}
                  </span>
                  <time className="text-sm text-white/60">
                    {format(new Date(article.publishedAt), 'MMMM d, yyyy')}
                  </time>
                </div>

                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                  {article.title}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <div className="prose prose-lg prose-invert">
              {article.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-base md:text-lg text-white/80 leading-relaxed mb-6">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Social Share */}
            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="flex items-center gap-4">
                <span className="text-sm text-white/60">Share this article:</span>
                <div className="flex gap-3">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      typeof window !== 'undefined' ? window.location.href : ''
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-[#1877F2] text-white rounded-lg text-sm hover:bg-[#1877F2]/90 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                    </svg>
                    Share
                  </a>
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `${article.title}\n${typeof window !== 'undefined' ? window.location.href : ''}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-lg text-sm hover:bg-[#25D366]/90 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Share
                  </a>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/news?tag=${encodeURIComponent(tag)}`}
                    className="px-3 py-1.5 bg-[#1E1E1E] text-white/60 rounded-lg text-sm border border-white/10 hover:border-white/20 hover:text-white transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="mt-12 pt-12 border-t border-white/10">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Related Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} variant="simple" />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-8">
              {/* Popular Articles */}
              <div className="bg-[#1E1E1E] rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-6">Popular Articles</h3>
                <div className="space-y-6">
                  {relatedArticles.slice(0, 3).map((article) => (
                    <Link
                      key={article.id}
                      href={`/news/${article.slug}`}
                      className="flex gap-4 group"
                    >
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={article.coverImage}
                          alt={article.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          sizes="80px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-white group-hover:text-[#C8AA6E] transition-colors line-clamp-2">
                          {article.title}
                        </h4>
                        <time className="text-sm text-white/60 mt-1 block">
                          {format(new Date(article.publishedAt), 'MMM d, yyyy')}
                        </time>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="bg-[#1E1E1E] rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-2">Newsletter</h3>
                <p className="text-sm text-white/60 mb-6">
                  Get the latest news from Turkish entertainment industry
                </p>
                <form className="space-y-4">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-4 py-3 bg-[#101114] rounded-lg text-white placeholder-white/40 border border-white/10 focus:ring-2 focus:ring-[#C8AA6E] focus:border-transparent text-sm"
                  />
                  <button
                    type="submit"
                    className="w-full px-4 py-3 bg-[#C8AA6E] text-black rounded-lg font-medium hover:bg-[#D4B87A] transition-colors text-sm"
                  >
                    Subscribe
                  </button>
                </form>
              </div>

              {/* Categories */}
              <div className="bg-[#1E1E1E] rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-6">Categories</h3>
                <div className="space-y-2">
                  {['Series', 'Actors', 'Industry', 'Interviews', 'Behind The Scenes'].map((category) => (
                    <Link
                      key={category}
                      href={`/news?category=${category}`}
                      className="flex items-center justify-between group"
                    >
                      <span className="text-sm text-white/60 group-hover:text-white transition-colors">
                        {category}
                      </span>
                      <svg
                        className="w-4 h-4 text-white/40 group-hover:text-[#C8AA6E] transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 