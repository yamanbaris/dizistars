'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/app/auth/AuthContext'

interface SearchResult {
  id: string
  name: string
  type: 'star' | 'series'
  image: string
  description?: string
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Reset search when navigating
  useEffect(() => {
    setSearchQuery('')
    setShowResults(false)
  }, [pathname])

  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setShowResults(false)
    }
  }

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setShowResults(false)
      return
    }

    setIsSearching(true)
    // Simulated API call - replace with actual API endpoint
    try {
      // Simulated results for now
      const results: SearchResult[] = [
        {
          id: '1',
          name: 'Burak Özçivit',
          type: 'star' as const,
          image: '/img/banners/burak-ozcivit.jpg',
          description: 'Actor known for Kuruluş Osman'
        },
        {
          id: '2',
          name: 'Kuruluş Osman',
          type: 'series' as const,
          image: '/img/series/kurulus-osman.jpg',
          description: 'Historical drama series'
        }
      ].filter(result => 
        result.name.toLowerCase().includes(query.toLowerCase())
      )
      
      setSearchResults(results)
      setShowResults(true)
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    performSearch(query)
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full py-4 md:py-6 bg-dark/95 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 group"
          >
            <svg 
              className="w-6 h-6 text-primary group-hover:text-primary/90 transition-colors" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            <span className="text-xl md:text-2xl font-bold text-white group-hover:text-primary/90 transition-colors">
              DiziStars
            </span>
          </Link>

          {/* Search Bar - Hidden on mobile, shown in menu */}
          <div className="hidden md:block flex-1 max-w-md mx-4 relative group">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInput}
                onFocus={() => setShowResults(true)}
                placeholder="Search stars, series..."
                className="w-full bg-white/10 text-white placeholder-white/50 px-5 py-2.5 rounded-full outline-none focus:bg-white/15 transition-all"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-primary transition-colors"
              >
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
              </button>
            </form>

            {/* Search Results Dropdown */}
            <AnimatePresence>
              {showResults && (searchResults.length > 0 || isSearching) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-[#1E1E1E] border border-white/10 rounded-xl shadow-xl overflow-hidden"
                >
                  {isSearching ? (
                    <div className="p-4 text-center">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
                      <p className="text-white/60 text-sm mt-2">Searching...</p>
                    </div>
                  ) : (
                    <div className="py-2">
                      {searchResults.map((result) => (
                        <Link
                          key={result.id}
                          href={`/${result.type}s/${result.id}`}
                          onClick={() => setShowResults(false)}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={result.image}
                              alt={result.name}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="text-white font-medium">{result.name}</h4>
                            <p className="text-white/60 text-sm">{result.description}</p>
                          </div>
                          <div className="ml-auto">
                            <span className="text-xs text-white/40 px-2 py-1 rounded-full bg-white/5">
                              {result.type}
                            </span>
                          </div>
                        </Link>
                      ))}
                      {searchQuery.trim() && (
                        <div className="px-4 py-2 border-t border-white/5">
                          <button
                            onClick={handleSearch}
                            className="text-primary text-sm hover:text-primary/80 transition-colors"
                          >
                            View all results for "{searchQuery}"
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link 
                  href="/profile"
                  className="px-6 py-2 text-white/90 hover:text-primary transition-colors"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 text-dark font-medium bg-primary hover:bg-primary/90 transition-colors rounded-full"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login"
                  className="px-6 py-2 text-white/90 hover:text-primary transition-colors"
                >
                  Login
                </Link>
                <Link 
                  href="/signup"
                  className="px-6 py-2 text-dark font-medium bg-primary hover:bg-primary/90 transition-colors rounded-full"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white/90 hover:text-primary transition-colors"
            aria-label="Toggle mobile menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              ref={mobileMenuRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4"
            >
              {/* Mobile Search */}
              <div className="mb-4">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchInput}
                    onFocus={() => setShowResults(true)}
                    placeholder="Search stars, series..."
                    className="w-full bg-white/10 text-white placeholder-white/50 px-5 py-3 rounded-full outline-none focus:bg-white/15 transition-all"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-primary transition-colors p-2"
                  >
                    <svg 
                      className="w-5 h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                      />
                    </svg>
                  </button>
                </form>
              </div>

              {/* Mobile Navigation Links */}
              <div className="flex flex-col gap-2 py-2">
                <Link
                  href="/stars"
                  className="px-4 py-3 text-white/90 hover:text-primary transition-colors rounded-lg hover:bg-white/5"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Stars
                </Link>
                <Link
                  href="/news"
                  className="px-4 py-3 text-white/90 hover:text-primary transition-colors rounded-lg hover:bg-white/5"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  News
                </Link>
              </div>

              {/* Mobile Auth Buttons */}
              <div className="flex flex-col gap-2 pt-2 pb-4">
                {user ? (
                  <>
                    <Link
                      href="/profile"
                      className="px-4 py-3 text-white/90 hover:text-primary transition-colors rounded-lg hover:bg-white/5 text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMobileMenuOpen(false)
                      }}
                      className="px-4 py-3 text-dark font-medium bg-primary hover:bg-primary/90 transition-colors rounded-lg text-center"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="px-4 py-3 text-white/90 hover:text-primary transition-colors rounded-lg hover:bg-white/5 text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="px-4 py-3 text-dark font-medium bg-primary hover:bg-primary/90 transition-colors rounded-lg text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
} 