'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { addTouchHandlers, isMobileDevice, optimizedScroll } from '@/lib/mobile-utils'

const banners = [
  {
    id: 1,
    name: 'Serenay Sarıkaya',
    image: '/img/banners/serenay-sarikaya.jpg',
    title: 'Rising Star',
    description: 'Award-winning actress known for her compelling performances'
  },
  {
    id: 2,
    name: 'Burak Özçivit',
    image: '/img/banners/burak-ozcivit.jpg',
    title: 'Leading Man',
    description: 'International sensation and star of historical dramas'
  },
  {
    id: 3,
    name: 'Can Yaman',
    image: '/img/banners/can-yaman.jpeg',
    title: 'Global Icon',
    description: 'Breaking barriers in international entertainment'
  }
]

const topStars = [
  {
    id: 1,
    name: 'Burak Özçivit',
    image: '/img/actor/burak-ozcivit.jpg',
    role: 'Actor',
    awards: 12,
    currentProject: 'Kuruluş Osman',
    followers: '21M'
  },
  {
    id: 2,
    name: 'Can Yaman',
    image: '/img/actor/can-yaman.jpg',
    role: 'Actor',
    awards: 8,
    currentProject: 'El Turco',
    followers: '18M'
  },
  {
    id: 3,
    name: 'Aras Bulut İynemli',
    image: '/img/actor/aras-bulut-iynemli.jpg',
    role: 'Actor',
    awards: 15,
    currentProject: 'Çukur',
    followers: '15M'
  },
  {
    id: 4,
    name: 'Fahriye Evcen',
    image: '/img/actress/fahriye-evcen.jpg',
    role: 'Actress',
    awards: 10,
    currentProject: 'Alparslan',
    followers: '14M'
  },
  {
    id: 5,
    name: 'Bergüzar Korel',
    image: '/img/actress/bergüzar-korel.jpg',
    role: 'Actress',
    awards: 14,
    currentProject: 'Teşkilat',
    followers: '12M'
  },
  {
    id: 6,
    name: 'Demet Evgar',
    image: '/img/actress/demet-evgar.jpg',
    role: 'Actress',
    awards: 16,
    currentProject: 'Alev Alev',
    followers: '11M'
  },
  {
    id: 7,
    name: 'Engin Altan Düzyatan',
    image: '/img/actor/engin-altan-düzyatan.jpg',
    role: 'Actor',
    awards: 13,
    currentProject: 'Barbaroslar',
    followers: '16M'
  },
  {
    id: 8,
    name: 'Alina Boz',
    image: '/img/actress/alina-boz.jpg',
    role: 'Actress',
    awards: 5,
    currentProject: 'Maraşlı',
    followers: '8M'
  }
]

const risingActresses = [
  {
    id: 1,
    name: 'Alina Boz',
    image: '/img/actress/alina-boz.jpg',
    age: 24
  },
  {
    id: 2,
    name: 'Ayça Ayşin Turan',
    image: '/img/actress/ayca-aysin-turan.jpg',
    age: 29
  },
  {
    id: 3,
    name: 'Afra Saraçoğlu',
    image: '/img/actress/afra-saracoglu.jpg',
    age: 25
  },
  {
    id: 4,
    name: 'Demet Evgar',
    image: '/img/actress/demet-evgar.jpg',
    age: 32
  }
]

const risingActors = [
  {
    id: 1,
    name: 'Çağatay Ulusoy',
    image: '/img/actor/cagatay-ulusoy.jpg',
    age: 33
  },
  {
    id: 2,
    name: 'Aras Bulut İynemli',
    image: '/img/actor/aras-bulut-iynemli.jpg',
    age: 32
  },
  {
    id: 3,
    name: 'Can Yaman',
    image: '/img/actor/can-yaman.jpg',
    age: 34
  },
  {
    id: 4,
    name: 'Burak Özçivit',
    image: '/img/actor/burak-ozcivit.jpg',
    age: 38
  }
]

const awardWinners = [
  {
    id: 1,
    name: 'Çağatay Ulusoy',
    image: '/img/actor/cagatay-ulusoy.jpg',
    awards: [
      { name: 'Best Actor', year: 2023 },
      { name: 'International Achievement', year: 2022 }
    ],
    totalAwards: 15,
    quote: 'Every role is a new journey of self-discovery'
  },
  {
    id: 2,
    name: 'Demet Özdemir',
    image: '/img/actress/demet-ozdemir.jpg',
    awards: [
      { name: 'Outstanding Performance', year: 2023 },
      { name: 'Best Actress in Comedy', year: 2022 }
    ],
    totalAwards: 12,
    quote: 'Acting is about touching hearts and telling stories'
  },
  {
    id: 3,
    name: 'Aras Bulut İynemli',
    image: '/img/actor/aras-bulut-iynemli.jpg',
    awards: [
      { name: 'Best Drama Performance', year: 2023 },
      { name: 'Critics Choice Award', year: 2022 }
    ],
    totalAwards: 18,
    quote: 'Each character leaves a piece of themselves with you'
  },
  {
    id: 4,
    name: 'Bergüzar Korel',
    image: '/img/actress/bergüzar-korel.jpg',
    awards: [
      { name: 'Lifetime Achievement', year: 2023 },
      { name: 'Best Leading Actress', year: 2022 }
    ],
    totalAwards: 20,
    quote: 'True artistry comes from the heart'
  }
]

const influentialStars = [
  {
    id: 1,
    name: 'Hande Erçel',
    image: '/img/actress/hande-ercel.jpg',
    socialStats: {
      instagram: '28.5M',
      twitter: '5.2M',
      tiktok: '12.1M'
    },
    brandDeals: ['Dior', 'L\'Oréal', 'Turkish Airlines'],
    influence: 'Fashion & Beauty'
  },
  {
    id: 2,
    name: 'Can Yaman',
    image: '/img/actor/can-yaman.jpg',
    socialStats: {
      instagram: '21.8M',
      twitter: '4.8M',
      tiktok: '9.5M'
    },
    brandDeals: ['Dolce & Gabbana', 'Tudors'],
    influence: 'Fashion & Lifestyle'
  },
  {
    id: 3,
    name: 'Özge Gürel',
    image: '/img/actress/ozge-gurel.jpg',
    socialStats: {
      instagram: '15.2M',
      twitter: '3.1M',
      tiktok: '7.8M'
    },
    brandDeals: ['MAC Cosmetics', 'Pantene'],
    influence: 'Beauty & Wellness'
  },
  {
    id: 4,
    name: 'Fahriye Evcen',
    image: '/img/actress/fahriye-evcen.jpg',
    socialStats: {
      instagram: '19.3M',
      twitter: '4.1M',
      tiktok: '8.7M'
    },
    brandDeals: ['Lancôme', 'Turkish Airlines', 'Vakko'],
    influence: 'Luxury & Lifestyle'
  }
]

const latestNews = [
  {
    id: 1,
    title: 'Çağatay Ulusoy to Star in New Netflix Series',
    excerpt: 'The international star takes on a challenging role in an upcoming psychological thriller',
    image: '/img/actor/cagatay-ulusoy.jpg',
    date: 'March 15, 2024',
    category: 'Series',
    readTime: '3 min read'
  },
  {
    id: 2,
    title: 'Hande Erçel Signs Major International Brand Deal',
    excerpt: 'Turkish actress becomes the new face of luxury fashion house in a groundbreaking partnership',
    image: '/img/actress/hande-ercel.jpg',
    date: 'March 14, 2024',
    category: 'Business',
    readTime: '4 min read'
  },
  {
    id: 3,
    title: 'Burak Özçivit\'s Historical Drama Breaks Records',
    excerpt: 'Latest episode achieves highest viewership ratings in Turkish television history',
    image: '/img/actor/burak-ozcivit.jpg',
    date: 'March 12, 2024',
    category: 'Television',
    readTime: '2 min read'
  },
  {
    id: 4,
    title: 'Can Yaman to Make Hollywood Debut',
    excerpt: 'Turkish heartthrob cast in upcoming international action film alongside A-list stars',
    image: '/img/actor/can-yaman.jpg',
    date: 'March 10, 2024',
    category: 'Movies',
    readTime: '5 min read'
  },
  {
    id: 5,
    title: 'Demet Özdemir Joins International Series Cast',
    excerpt: 'Award-winning actress takes on leading role in major streaming production',
    image: '/img/actress/demet-ozdemir.jpg',
    date: 'March 8, 2024',
    category: 'Series',
    readTime: '4 min read'
  },
  {
    id: 6,
    title: 'Bergüzar Korel Returns to Television',
    excerpt: 'Beloved actress announces comeback in highly anticipated drama series',
    image: '/img/actress/bergüzar-korel.jpg',
    date: 'March 7, 2024',
    category: 'Television',
    readTime: '3 min read'
  }
]

export default function Home() {
  const [currentBanner, setCurrentBanner] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (contentRef.current && isMobileDevice()) {
      const cleanup = addTouchHandlers(contentRef.current, {
        onSwipe: (direction) => {
          if (direction === 'left') {
            setCurrentBanner((prev) => (prev + 1) % banners.length)
          } else if (direction === 'right') {
            setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)
          }
        }
      })

      return () => cleanup()
    }
  }, [])

  return (
    <main className="min-h-screen bg-dark">
      {/* Hero Banner */}
      <section ref={contentRef} className="relative h-[90vh] md:h-screen overflow-hidden">
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
              src={banners[currentBanner].image}
              alt={banners[currentBanner].name}
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
                    {banners[currentBanner].title}
                  </h2>
                  <h1 className="text-4xl md:text-6xl font-bold text-white">
                    {banners[currentBanner].name}
                  </h1>
                  <p className="text-lg md:text-xl text-white/80">
                    {banners[currentBanner].description}
                  </p>
                  <div className="pt-4">
                    <Link
                      href={`/stars/${banners[currentBanner].id}`}
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

        {/* Banner Navigation - Mobile friendly */}
        <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center gap-2">
          {banners.map((_, index) => (
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

        {/* Mobile swipe indicator */}
        <div className="absolute bottom-20 left-0 right-0 z-30 text-center text-white/40 text-sm block md:hidden">
          <span>Swipe to navigate</span>
          <div className="flex justify-center gap-4 mt-2">
            <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
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
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {topStars.slice(0, 8).map((star) => (
                  <Link
                    key={star.id}
                    href={`/stars/${star.id}`}
                    className="group relative aspect-[3/4] rounded-xl overflow-hidden touch-manipulation"
                  >
                    <Image
                      src={star.image}
                      alt={star.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <h3 className="text-white font-medium text-lg">{star.name}</h3>
                      <p className="text-white/70 text-sm">{star.role}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-primary text-sm">{star.followers}</span>
                        <span className="text-white/50 text-xs">followers</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Rising Stars Section */}
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white">Rising Stars</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[...risingActresses, ...risingActors].slice(0, 4).map((star) => (
                  <Link
                    key={star.id}
                    href={`/stars/${star.id}`}
                    className="group relative aspect-square rounded-xl overflow-hidden touch-manipulation"
                  >
                    <Image
                      src={star.image}
                      alt={star.name}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <h3 className="text-white font-medium">{star.name}</h3>
                      <p className="text-white/70 text-sm">Age: {star.age}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Influential Stars Section */}
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white">Most Influential</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {influentialStars.map((star) => (
                  <Link
                    key={star.id}
                    href={`/stars/${star.id}`}
                    className="group bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-colors touch-manipulation"
                  >
                    <div className="relative aspect-square">
                      <Image
                        src={star.image}
                        alt={star.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <h3 className="text-white font-medium text-lg">{star.name}</h3>
                        <p className="text-white/70 text-sm">{star.influence}</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="space-y-1">
                          <p className="text-white/50 text-xs">Instagram</p>
                          <p className="text-white font-medium">{star.socialStats.instagram}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-white/50 text-xs">TikTok</p>
                          <p className="text-white font-medium">{star.socialStats.tiktok}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Latest News Section */}
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white">Latest News</h2>
                <Link
                  href="/news"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  View All
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {latestNews.map((news) => (
                  <Link
                    key={news.id}
                    href={`/news/${news.id}`}
                    className="group bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-colors"
                  >
                    <div className="relative aspect-video">
                      <Image
                        src={news.image}
                        alt={news.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                          {news.category}
                        </span>
                        <span className="text-white/40 text-xs">{news.date}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors line-clamp-2">
                        {news.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Hidden on mobile */}
          <div className="hidden lg:block lg:w-80 space-y-8">
            {/* Trending Now */}
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                Trending Now
              </h3>
              <div className="space-y-4">
                {topStars.slice(0, 5).map((star, index) => (
                  <Link 
                    href={`/stars/${star.id}`} 
                    key={star.id}
                    className="flex items-center gap-3 group cursor-pointer"
                  >
                    <span className="text-primary font-bold">#{index + 1}</span>
                    <div className="relative w-12 h-12 rounded-full overflow-hidden">
                      <Image
                        src={star.image}
                        alt={star.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-sm group-hover:text-primary transition-colors">
                        {star.name}
                      </h4>
                      <p className="text-white/60 text-xs">
                        {star.currentProject}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Fan Rankings */}
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                Fan Rankings
              </h3>
              <div className="space-y-4">
                {topStars.slice(0, 4).map((star, index) => (
                  <div key={star.id} className="relative">
                    <div className="flex items-center gap-3 group cursor-pointer">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden">
                        <Image
                          src={star.image}
                          alt={star.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium text-sm group-hover:text-primary transition-colors">
                          {star.name}
                        </h4>
                        <div className="w-full bg-white/10 h-2 rounded-full mt-1">
                          <div 
                            className="bg-primary h-full rounded-full" 
                            style={{ width: `${100 - (index * 15)}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-primary font-medium text-sm">{star.followers}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Advertisement Area */}
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden">
              <Image
                src="/img/platforms/watch-turks.jpg"
                alt="Popular Turkish Series"
                fill
                sizes="320px"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/50 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <span className="text-xs text-white/60 mb-2">Featured Series</span>
                <h4 className="text-xl font-bold text-white mb-2">Discover Turkish Drama</h4>
                <p className="text-sm text-white/80 mb-4">From historical epics to modern romance - explore the best of Turkish television</p>
                <Link 
                  href="/series"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-dark font-medium px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Explore Series
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Latest Interviews */}
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                Latest Interviews
              </h3>
              <div className="space-y-4">
                {[
                  {
                    star: topStars[0],
                    title: 'Behind the Scenes of Historical Drama',
                    date: '2 days ago',
                    source: 'Turkish Daily'
                  },
                  {
                    star: topStars[1],
                    title: 'International Success Story',
                    date: '3 days ago',
                    source: 'Entertainment Weekly'
                  },
                  {
                    star: topStars[2],
                    title: 'The Art of Character Building',
                    date: '5 days ago',
                    source: 'Cinema Magazine'
                  }
                ].map((interview, index) => (
                  <Link 
                    href={`/stars/${interview.star.id}`}
                    key={index} 
                    className="group block"
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden">
                        <Image
                          src={interview.star.image}
                          alt={interview.star.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-white font-medium text-sm group-hover:text-primary transition-colors">
                          {interview.star.name}
                        </h4>
                        <p className="text-white/80 text-sm line-clamp-2">
                          {interview.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-white/40 text-xs">{interview.date}</span>
                          <span className="text-white/40 text-xs">•</span>
                          <span className="text-primary/80 text-xs">{interview.source}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                Upcoming Events
              </h3>
              <div className="space-y-4">
                {[
                  {
                    title: 'Golden Butterfly Awards',
                    date: 'Dec 15, 2024',
                    location: 'Istanbul',
                    stars: ['Burak Özçivit', 'Hande Erçel']
                  },
                  {
                    title: 'Fan Meet & Greet',
                    date: 'Dec 20, 2024',
                    location: 'Ankara',
                    stars: ['Can Yaman']
                  },
                  {
                    title: 'Series Premiere Gala',
                    date: 'Jan 5, 2025',
                    location: 'Istanbul',
                    stars: ['Çağatay Ulusoy', 'Demet Özdemir']
                  }
                ].map((event, index) => (
                  <div key={index} className="group cursor-pointer">
                    <div className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                      <h4 className="text-white font-medium text-sm group-hover:text-primary transition-colors">
                        {event.title}
                      </h4>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-primary/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-white/60 text-xs">{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-primary/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-white/60 text-xs">{event.location}</span>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {event.stars.map((star, idx) => (
                          <span key={idx} className="px-2 py-1 bg-primary/10 text-primary/90 text-xs rounded-full">
                            {star}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
