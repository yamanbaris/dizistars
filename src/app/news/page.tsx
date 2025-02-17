'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'

const FEATURED_NEWS = [
  {
    id: '1',
    title: 'Price of Passion, Fatmagül, and more Kanal D International Dramas To Air in France',
    image: '/img/banners/serenay-sarikaya.jpg',
    category: 'DISTRIBUTION',
    slug: 'price-of-passion-fatmagul-france'
  },
  {
    id: '2',
    title: 'Kanal D International Expands Reach in CIS Region',
    image: '/img/banners/burak-ozcivit.jpg',
    category: 'DISTRIBUTION',
    slug: 'kanal-d-international-cis-region'
  },
  {
    id: '3',
    title: "First Look: 'Esref Rüya' on Kanal D (Cast + Plot Summary)",
    image: '/img/banners/can-yaman.jpeg',
    category: 'IN PRODUCTION',
    slug: 'esref-ruya-first-look'
  }
]

const LATEST_NEWS = [
  {
    id: '4',
    title: 'Valley of Hearts: Inter Medya licenses hit Drama to Multiple Markets',
    image: '/img/banners/serenay-sarikaya.jpg',
    category: 'DISTRIBUTION',
    date: '2024-02-14',
    excerpt: 'The successful drama series continues its international expansion with new licensing deals across multiple territories.',
    slug: 'valley-of-hearts-inter-medya-licenses'
  },
  {
    id: '5',
    title: "Secret of Pearls: Pivotal Week Ahead For Kanal D International's Hit Drama",
    image: '/img/banners/burak-ozcivit.jpg',
    category: 'TV NEWS',
    date: '2024-02-14',
    excerpt: 'The highly anticipated series reaches a crucial point in its storyline, keeping audiences on the edge of their seats.',
    slug: 'secret-of-pearls-pivotal-week'
  }
]

const POPULAR_NEWS = [
  {
    id: '6',
    title: 'Matter of Respect Makes Strong Debut in Prime Time',
    image: '/img/banners/can-yaman.jpeg',
    date: '2024-02-13',
    views: '2.5K',
    slug: 'matter-of-respect-debut'
  },
  {
    id: '7',
    title: 'Kuzey Güney Celebrates 10th Anniversary with Special Event',
    image: '/img/banners/serenay-sarikaya.jpg',
    date: '2024-02-12',
    views: '1.8K',
    slug: 'kuzey-guney-anniversary'
  }
]

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-[#101114] pt-28 pb-16">
      <div className="container mx-auto px-4">
        {/* Featured News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {FEATURED_NEWS.map((article, index) => (
            <Link
              key={article.id}
              href={`/news/${article.slug}`}
              className={`group relative overflow-hidden rounded-2xl h-full ${
                index === 0 ? 'md:col-span-2 lg:col-span-2' : ''
              }`}
            >
              <div className={`relative h-full ${
                index === 0 
                  ? 'aspect-[2/1]' 
                  : index === 1 
                    ? 'aspect-[1/1.2]'
                    : 'aspect-[16/9]'
              }`}>
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes={index === 0 
                    ? "(max-width: 768px) 100vw, (max-width: 1024px) 66vw, 50vw"
                    : "(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
                  }
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent opacity-90 group-hover:opacity-75 transition-opacity" />
              </div>
              <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-end">
                <div className="space-y-3">
                  <span className="inline-block px-2.5 py-1 text-xs font-medium bg-red-500 text-white rounded">
                    {article.category}
                  </span>
                  <h2 className={`font-bold text-white group-hover:text-[#C8AA6E] transition-colors line-clamp-3 ${
                    index === 0 
                      ? 'text-xl md:text-2xl lg:text-3xl leading-tight'
                      : 'text-base md:text-lg leading-snug'
                  }`}>
                    {article.title}
                  </h2>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <div className="space-y-6">
              {LATEST_NEWS.map((article) => (
                <Link
                  key={article.id}
                  href={`/news/${article.slug}`}
                  className="flex flex-col md:flex-row bg-[#1E1E1E] rounded-2xl overflow-hidden group hover:bg-[#252525] transition-colors"
                >
                  {/* Left Side - Image */}
                  <div className="relative md:w-[300px] lg:w-[380px] flex-shrink-0">
                    <div className="relative aspect-[16/9] md:aspect-[4/3] md:h-full">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 380px"
                      />
                    </div>
                  </div>
                  
                  {/* Right Side - Content */}
                  <div className="flex-1 p-6 md:p-8 flex flex-col justify-center min-w-0">
                    <div className="flex items-center gap-4 mb-4 flex-wrap">
                      <span className="px-3 py-1 text-xs font-medium bg-red-500 text-white rounded">
                        {article.category}
                      </span>
                      <time className="text-[15px] text-white/60">
                        {format(new Date(article.date), 'MMMM d, yyyy')}
                      </time>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-4 group-hover:text-[#C8AA6E] transition-colors leading-tight line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-base md:text-[17px] text-white/80 leading-relaxed line-clamp-2 mb-6">
                      {article.excerpt}
                    </p>
                    <div className="mt-auto">
                      <span className="text-[#C8AA6E] group-hover:text-[#D4B87A] transition-colors inline-flex items-center gap-2 text-[15px]">
                        Read More
                        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-[#1E1E1E] rounded-2xl p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-6 md:mb-8">Popular News</h2>
              <div className="space-y-6">
                {POPULAR_NEWS.map((article) => (
                  <Link
                    key={article.id}
                    href={`/news/${article.slug}`}
                    className="flex gap-4 md:gap-5 group"
                  >
                    <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="112px"
                      />
                    </div>
                    <div className="flex-1 py-1 min-w-0">
                      <h3 className="text-base md:text-[17px] font-medium text-white group-hover:text-[#C8AA6E] transition-colors line-clamp-2 leading-snug">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-2 md:gap-3 mt-2 md:mt-3 text-sm md:text-[15px] text-white/60">
                        <time>{format(new Date(article.date), 'MMM d, yyyy')}</time>
                        <span>•</span>
                        <span>{article.views} views</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Newsletter Signup */}
              <div className="mt-8 md:mt-10 pt-6 md:pt-8 border-t border-white/10">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">Newsletter</h2>
                <p className="text-base md:text-[17px] text-white/60 mb-6 leading-relaxed">
                  Get the latest news from Turkish entertainment industry
                </p>
                <form className="space-y-4">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-4 md:px-5 py-3 md:py-4 bg-[#101114] rounded-xl text-white placeholder-white/40 border border-white/10 focus:ring-2 focus:ring-[#C8AA6E] focus:border-transparent text-[15px]"
                  />
                  <button
                    type="submit"
                    className="w-full px-4 md:px-5 py-3 md:py-4 bg-[#C8AA6E] text-black rounded-xl font-medium hover:bg-[#D4B87A] transition-colors text-[15px]"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 