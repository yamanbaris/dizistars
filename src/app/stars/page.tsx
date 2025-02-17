'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import StarCard from '@/components/ui/StarCard'

type StarType = 'actor' | 'actress'
type SortOption = 'a-z' | 'z-a'

interface Star {
  id: number
  name: string
  image: string
  type: StarType
  currentProject?: string
  genre: string
  experience: number // Years in industry
  debutYear: number
}

// Combined data for both actors and actresses
const stars: Star[] = [
  // Actors
  { id: 1, name: 'Burak Özçivit', image: '/img/actor/burak-ozcivit.jpg', type: 'actor', currentProject: 'Kuruluş Osman', genre: 'Historical', experience: 17, debutYear: 2006 },
  { id: 2, name: 'Can Yaman', image: '/img/actor/can-yaman.jpg', type: 'actor', currentProject: 'El Turco', genre: 'Action', experience: 9, debutYear: 2014 },
  { id: 3, name: 'Engin Altan Düzyatan', image: '/img/actor/engin-altan-düzyatan.jpg', type: 'actor', genre: 'Historical', experience: 22, debutYear: 2001 },
  { id: 4, name: 'Aras Bulut İynemli', image: '/img/actor/aras-bulut-iynemli.jpg', type: 'actor', genre: 'Drama', experience: 13, debutYear: 2010 },
  { id: 5, name: 'Barış Arduç', image: '/img/actor/baris-arduc.jpg', type: 'actor', genre: 'Romance', experience: 12, debutYear: 2011 },
  // Actresses
  { id: 6, name: 'Fahriye Evcen', image: '/img/actress/fahriye-evcen.jpg', type: 'actress', genre: 'Drama', experience: 18, debutYear: 2005 },
  { id: 7, name: 'Bergüzar Korel', image: '/img/actress/bergüzar-korel.jpg', type: 'actress', genre: 'Drama', experience: 25, debutYear: 1998 },
  { id: 8, name: 'Demet Evgar', image: '/img/actress/demet-evgar.jpg', type: 'actress', genre: 'Comedy', experience: 24, debutYear: 1999 },
  { id: 9, name: 'Alina Boz', image: '/img/actress/alina-boz.jpg', type: 'actress', genre: 'Romance', experience: 10, debutYear: 2013 },
  { id: 10, name: 'Afra Saraçoğlu', image: '/img/actress/afra-saracoglu.jpg', type: 'actress', genre: 'Drama', experience: 8, debutYear: 2015 },
]

const sortOptions = [
  { value: 'a-z', label: 'A-Z' },
  { value: 'z-a', label: 'Z-A' },
]

export default function StarsPage() {
  const [sortBy, setSortBy] = useState<SortOption>('a-z')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<'All' | StarType>('All')
  const [filteredStars, setFilteredStars] = useState(stars)
  const [displayCount, setDisplayCount] = useState(20)

  useEffect(() => {
    let filtered = stars.filter((star) => {
      const matchesSearch = star.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = selectedType === 'All' || star.type === selectedType
      return matchesSearch && matchesType
    })

    // Sort the filtered results
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'a-z':
          return a.name.localeCompare(b.name)
        case 'z-a':
          return b.name.localeCompare(a.name)
        default:
          return 0
      }
    })

    setFilteredStars(filtered)
    setDisplayCount(20) // Reset display count when filters change
  }, [searchQuery, sortBy, selectedType])

  const handleShowMore = () => {
    setDisplayCount(prev => prev + 20)
  }

  const displayedStars = filteredStars.slice(0, displayCount)
  const hasMore = displayCount < filteredStars.length

  return (
    <div className="min-h-screen bg-[#101114]">
      <div className="container mx-auto px-6 mt-28">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          {/* Search */}
          <div className="md:max-w-[400px] w-full order-1 md:order-2">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stars..."
                className="w-full px-4 py-2 bg-[#1E1E1E] rounded-lg text-white placeholder-white/50 border-none focus:ring-0"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Type Filter */}
          <div className="order-2 md:order-1">
            <div className="flex items-center gap-2">
              {['All', 'actor', 'actress'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type as 'All' | StarType)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedType === type
                      ? 'bg-[#C8AA6E] text-black'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div className="order-3">
            <div className="flex items-center gap-2">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value as SortOption)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    sortBy === option.value
                      ? 'bg-[#C8AA6E] text-black'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stars Grid */}
        <div className="mt-8 pb-16">
          <AnimatePresence mode="wait">
            {filteredStars.length > 0 ? (
              <>
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                >
                  {displayedStars.map((star, index) => (
                    <motion.div
                      key={star.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      className="group"
                    >
                      <div className="relative bg-white/5 rounded-xl overflow-hidden">
                        <div className="relative aspect-[3/4]">
                          <Image
                            src={star.image}
                            alt={star.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
                          
                          {/* Content Overlay */}
                          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300 text-center">
                            <h3 className="text-lg font-bold text-white mb-1">
                              {star.name}
                            </h3>
                            <div className="overflow-hidden max-h-0 group-hover:max-h-20 transition-all duration-300">
                              {star.currentProject && (
                                <p className="text-primary/90 text-sm mb-1">
                                  {star.currentProject}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
                
                {hasMore && (
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={handleShowMore}
                      className="px-6 py-2 bg-[#C8AA6E] text-black rounded-lg text-sm font-medium hover:bg-[#D4B87A] transition-colors"
                    >
                      Show More
                    </button>
                  </div>
                )}
              </>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <div className="relative w-24 h-24 mb-6">
                  <Image
                    src="/img/empty-state.png"
                    alt="No results"
                    fill
                    className="object-contain opacity-50"
                  />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  No Stars Found
                </h3>
                <p className="text-white/60 text-center max-w-md">
                  We couldn't find any stars matching your criteria. Try adjusting your filters or search query.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
