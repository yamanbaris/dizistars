'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { stars } from '@/data/stars'
import { format } from 'date-fns'
import { useUserFeatures } from '@/app/features/UserFeaturesContext'

interface Project {
  name: string
  role: string
  genre: string
  coStars: string[]
  imdbRating: number
  streamingOn?: string
  year: number
}

interface Album {
  name: string
  cover: string
  count: number
  photos: { src: string; description?: string }[]
}

interface Star {
  id: number
  name: string
  type: 'actor' | 'actress'
  image: string
  currentProject?: string
  genre: string
  biography: {
    birthDate: string
    birthPlace: string
    education?: string
    careerStart: number
    achievements: string[]
  }
  filmography: Project[]
  socialMedia: {
    instagram?: string
    twitter?: string
    facebook?: string
  }
}

interface Comment {
  id: string
  user: {
    name: string
    avatar: string
  }
  content: string
  timestamp: Date
  likes: number
  isLiked: boolean
  replies?: Comment[]
  isOwnComment?: boolean
}

// Convert stars object to array
const starsList: Star[] = Object.values(stars)

export default function StarProfile() {
  const { id } = useParams()
  const { favorites, addToFavorites, removeFromFavorites } = useUserFeatures()
  const star = starsList.find((s: { id: number }) => s.id === Number(id))
  const isFavorited = favorites.some(f => f.title === star?.name)
  type TabType = 'overview' | 'biography' | 'filmography' | 'photos' | 'videos'
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [carouselPosition, setCarouselPosition] = useState(0)
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)
  const [selectedPhoto, setSelectedPhoto] = useState<{ src: string; description?: string; index: number } | null>(null)

  // Add comment state
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      user: {
        name: 'Ayşe Yılmaz',
        avatar: '/img/avatar-placeholder.jpg'
      },
      content: 'Your performance in Kara Sevda was absolutely incredible! The chemistry between you and your co-star was amazing.',
      timestamp: new Date('2024-02-15'),
      likes: 245,
      isLiked: false,
      isOwnComment: false
    },
    {
      id: '2',
      user: {
        name: 'Mehmet Demir',
        avatar: '/img/avatar-placeholder.jpg'
      },
      content: 'I\'ve been following your career since the beginning. Your growth as an actor is truly inspiring!',
      timestamp: new Date('2024-02-14'),
      likes: 189,
      isLiked: true,
      isOwnComment: false,
      replies: [
        {
          id: '2-1',
          user: {
            name: star?.name || 'Actor',
            avatar: star?.image || '/img/avatar-placeholder.jpg'
          },
          content: 'Thank you so much for your continued support! It means the world to me.',
          timestamp: new Date('2024-02-14'),
          likes: 324,
          isLiked: false,
          isOwnComment: false
        }
      ]
    }
  ])
  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const observerTarget = useRef(null)
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'most_liked'>('newest')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedPhoto) {
          setSelectedPhoto(null)
        } else if (selectedAlbum) {
          setSelectedAlbum(null)
        }
      }

      if (selectedPhoto && selectedAlbum) {
        if (e.key === 'ArrowLeft' && selectedPhoto.index > 0) {
          const prevPhoto = selectedAlbum.photos[selectedPhoto.index - 1]
          setSelectedPhoto({ ...prevPhoto, index: selectedPhoto.index - 1 })
        }
        if (e.key === 'ArrowRight' && selectedPhoto.index < selectedAlbum.photos.length - 1) {
          const nextPhoto = selectedAlbum.photos[selectedPhoto.index + 1]
          setSelectedPhoto({ ...nextPhoto, index: selectedPhoto.index + 1 })
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedPhoto, selectedAlbum])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          loadMoreComments()
        }
      },
      { threshold: 0.1 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [isLoading, page])

  const loadMoreComments = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setPage(prev => prev + 1)
    setIsLoading(false)
  }

  // Add delete handler
  const handleDeleteComment = (commentId: string) => {
    setComments(prev => prev.filter(comment => {
      if (comment.id === commentId) return false
      if (comment.replies) {
        comment.replies = comment.replies.filter(reply => reply.id !== commentId)
      }
      return true
    }))
  }

  // Add edit handler
  const handleEditComment = (commentId: string, newContent: string) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, content: newContent }
      }
      if (comment.replies) {
        return {
          ...comment,
          replies: comment.replies.map(reply =>
            reply.id === commentId
              ? { ...reply, content: newContent }
              : reply
          )
        }
      }
      return comment
    }))
    setEditingCommentId(null)
    setEditContent('')
  }

  // Update handleCommentSubmit to include isOwnComment
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      user: {
        name: 'Guest User',
        avatar: '/img/avatar-placeholder.jpg'
      },
      content: newComment,
      timestamp: new Date(),
      likes: 0,
      isLiked: false,
      isOwnComment: true
    }

    setComments(prev => [comment, ...prev])
    setNewComment('')
  }

  const handleLike = (commentId: string) => {
    setComments(prev => 
      prev.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            isLiked: !comment.isLiked
          }
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map(reply => 
              reply.id === commentId
                ? {
                    ...reply,
                    likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                    isLiked: !reply.isLiked
                  }
                : reply
            )
          }
        }
        return comment
      })
    )
  }

  // Add sort function
  const sortedComments = [...comments].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return b.timestamp.getTime() - a.timestamp.getTime()
      case 'oldest':
        return a.timestamp.getTime() - b.timestamp.getTime()
      case 'most_liked':
        return b.likes - a.likes
      default:
        return 0
    }
  })

  // Add reply handler
  const handleReply = (commentId: string, content: string) => {
    if (!content.trim()) return

    const reply: Comment = {
      id: `${commentId}-${Date.now()}`,
      user: {
        name: 'Guest User',
        avatar: '/img/avatar-placeholder.jpg'
      },
      content: content,
      timestamp: new Date(),
      likes: 0,
      isLiked: false,
      isOwnComment: true
    }

    setComments(prev => 
      prev.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), reply]
          }
        }
        return comment
      })
    )
    setReplyContent('')
    setReplyingTo(null)
  }

  const handleFavoriteClick = async () => {
    if (!star) return
    
    if (isFavorited) {
      const favoriteToRemove = favorites.find(f => f.title === star.name)
      if (favoriteToRemove) {
        await removeFromFavorites(favoriteToRemove.id)
      }
    } else {
      await addToFavorites({
        title: star.name,
        image: star.image
      })
    }
  }

  if (!star) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-third/80">Star not found</p>
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
                    src={star.image}
                    alt={star.name}
                    width={280}
                    height={420}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
                {/* Favorite Button */}
                <button
                  onClick={handleFavoriteClick}
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
              </div>

              <div className="space-y-4 mt-6 w-full">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <h1 className="text-3xl font-bold text-white">{star.name}</h1>
                    <button
                      onClick={() => {
                        // Audio play functionality would be added here
                        console.log('Playing pronunciation')
                      }}
                      className="w-8 h-8 rounded-full bg-primary/10 hover:bg-primary/20 transition-all flex items-center justify-center group"
                    >
                      <svg className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Social Media Icons */}
                <div className="flex justify-center gap-4">
                  {Object.entries(star.socialMedia).map(([platform, handle]) => (
                    <a
                      key={platform}
                      href={`https://${platform}.com${handle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center hover:bg-primary/20 transition-colors group"
                    >
                      {platform === 'instagram' && (
                        <svg className="w-4 h-4 text-white/60 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      )}
                      {platform === 'twitter' && (
                        <svg className="w-4 h-4 text-white/60 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                      )}
                      {platform === 'facebook' && (
                        <svg className="w-4 h-4 text-white/60 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      )}
                    </a>
                  ))}
                </div>

                {/* Profile Info */}
                <div className="w-full bg-white/5 rounded-xl p-6 backdrop-blur-sm">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-white">
                      <svg className="w-5 h-5 text-primary/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-white/80">{new Date(star.biography.birthDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                  </div>

                  {star.currentProject && (
                    <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm text-white/60">Current Series</div>
                          <div className="text-lg font-medium text-white">{star.currentProject}</div>
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
                  {(['overview', 'biography', 'filmography', 'photos', 'videos'] as const).map((tab) => (
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
                        <div className="prose prose-invert max-w-none">
                          <p className="text-white/90 leading-relaxed mb-4">
                            {star.name} was born in Istanbul on {new Date(star.biography.birthDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}. In 2003, he was elected the Top Model of Turkey and began working with Model Agencies. In 2005, he was chosen the second best model of the world, which led to his successful transition into acting.
                          </p>
                          <button 
                            onClick={() => setActiveTab('biography')}
                            className="text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-2"
                          >
                            Read full biography 
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Known For */}
                      <div>
                        <h2 className="text-2xl font-semibold text-white mb-6">Known For</h2>
                        <div className="relative">
                          <div className="w-full overflow-hidden">
                            <div className="flex gap-4 transition-transform duration-300" id="carousel-container" style={{ 
                              width: 'calc((180px + 1rem) * 3.5)',
                              transform: `translateX(${carouselPosition}px)`
                            }}>
                              {[
                                { name: 'Endless Love', image: '/img/series/kara-sevda.jpeg' },
                                { name: 'Kuruluş Osman', image: '/img/series/kurulus-osman.jpg' },
                                { name: 'My Brother', image: '/img/series/kardesim-benim.jpeg' },
                                { name: 'Love Like You', image: '/img/series/ask-sana-benzer.jpeg' },
                                { name: 'Can Feda', image: '/img/series/can-feda.jpeg' }
                              ].map((project, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="flex-none w-[180px]"
                                >
                                  <div className="w-[180px] aspect-[2/3] relative">
                                    <Image
                                      src={project.image}
                                      alt={project.name}
                                      width={180}
                                      height={270}
                                      className="w-full h-full object-cover"
                                      priority={index < 2}
                                    />
                                  </div>
                                  <h3 className="text-white font-medium text-center text-base mt-3 truncate">
                                    {project.name}
                                  </h3>
                                </motion.div>
                              ))}
                            </div>
                            {/* Gradient Overlay */}
                            <div className="absolute top-0 right-0 w-[120px] h-full bg-gradient-to-l from-dark/95 to-transparent pointer-events-none" />
                          </div>
                          {/* Navigation Buttons */}
                          {carouselPosition < 0 && (
                            <button 
                              className="absolute -left-4 top-[calc(50%-24px)] w-8 h-8 rounded-full bg-primary text-dark flex items-center justify-center shadow-lg focus:outline-none"
                              onClick={() => {
                                const scrollAmount = (180 + 16) * 3; // width of 3 items including gap
                                const newX = Math.min(0, carouselPosition + scrollAmount);
                                setCarouselPosition(newX);
                              }}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                          )}
                          {carouselPosition > -((180 + 16) * (5 - 3.5)) && (
                            <button 
                              className="absolute -right-4 top-[calc(50%-24px)] w-8 h-8 rounded-full bg-primary text-dark flex items-center justify-center shadow-lg focus:outline-none"
                              onClick={() => {
                                const maxScroll = -((180 + 16) * (5 - 3.5)); // total items minus visible items
                                const scrollAmount = -(180 + 16) * 3; // width of 3 items including gap
                                const newX = Math.max(maxScroll, carouselPosition + scrollAmount);
                                setCarouselPosition(newX);
                              }}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          )}
                        </div>
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
                          <div className="space-y-6">
                            <div className="bg-dark/50 rounded-xl p-6 border border-primary/10">
                              <p className="text-white/90 leading-relaxed">
                                {star.name} was born on {new Date(star.biography.birthDate).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })} in {star.biography.birthPlace}. His journey in the entertainment industry began in {star.biography.careerStart}, marking the start of what would become a remarkable career in Turkish television and cinema.
                              </p>
                            </div>
                            <div className="bg-dark/50 rounded-xl p-6 border border-primary/10">
                              <p className="text-white/90 leading-relaxed">
                                Before his acting career, he achieved significant success in modeling. In 2003, he was crowned the Top Model of Turkey, which opened doors to international modeling opportunities. His striking presence and professional demeanor led to him being named the second-best model in the world in 2005, a prestigious recognition that highlighted his potential for a career in the entertainment industry.
                              </p>
                            </div>
                            <div className="bg-dark/50 rounded-xl p-6 border border-primary/10">
                              <p className="text-white/90 leading-relaxed">
                                The transition from modeling to acting came naturally, as his charismatic screen presence and dedication to his craft quickly earned him recognition. His breakthrough role came with the historical drama series "Diriliş: Ertuğrul," where his portrayal garnered critical acclaim and a devoted fan following.
                              </p>
                            </div>
                            <div className="bg-dark/50 rounded-xl p-6 border border-primary/10">
                              <p className="text-white/90 leading-relaxed">
                                Today, {star.name} is one of Turkey's most influential actors, known for his versatile performances and commitment to his roles. His current project, {star.currentProject || "upcoming ventures"}, continues to showcase his evolution as an actor and his significant contribution to Turkish entertainment.
                              </p>
                            </div>
                          </div>
                          
                          {/* Quick Facts */}
                          <div className="space-y-4">
                            <div className="bg-dark/50 rounded-xl p-6 border border-primary/10">
                              <h3 className="text-lg font-semibold text-white mb-4">Quick Facts</h3>
                              <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                  <div>
                                    <div className="text-sm text-white/60">Birth Date</div>
                                    <div className="text-white">{new Date(star.biography.birthDate).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })}</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                  </div>
                                  <div>
                                    <div className="text-sm text-white/60">Birth Place</div>
                                    <div className="text-white">{star.biography.birthPlace}</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                  <div>
                                    <div className="text-sm text-white/60">Career Start</div>
                                    <div className="text-white">{star.biography.careerStart}</div>
                                  </div>
                                </div>
                                {star.biography.education && (
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                                      </svg>
                                    </div>
                                    <div>
                                      <div className="text-sm text-white/60">Education</div>
                                      <div className="text-white">{star.biography.education}</div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Achievements Counter */}
                            <div className="bg-dark/50 rounded-xl p-6 border border-primary/10">
                              <h3 className="text-lg font-semibold text-white mb-4">Career Highlights</h3>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-lg bg-white/5 flex items-center gap-3">
                                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                                  </svg>
                                  <div>
                                    <div className="text-2xl font-bold text-primary">{star.filmography.length}</div>
                                    <div className="text-sm text-white/60">Series</div>
                                  </div>
                                </div>
                                <div className="p-4 rounded-lg bg-white/5 flex items-center gap-3">
                                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                  </svg>
                                  <div>
                                    <div className="text-2xl font-bold text-primary">{star.biography.achievements.length}</div>
                                    <div className="text-sm text-white/60">Awards</div>
                                  </div>
                                </div>
                                <div className="p-4 rounded-lg bg-white/5 flex items-center gap-3">
                                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <div>
                                    <div className="text-2xl font-bold text-primary">{new Date().getFullYear() - star.biography.careerStart}</div>
                                    <div className="text-sm text-white/60">Years Active</div>
                                  </div>
                                </div>
                                <div className="p-4 rounded-lg bg-white/5 flex items-center gap-3">
                                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                  </svg>
                                  <div>
                                    <div className="text-2xl font-bold text-primary">
                                      {Array.from(new Set(star.filmography.map((p: Project) => p.genre))).length}
                                    </div>
                                    <div className="text-sm text-white/60">Genres</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Career Timeline */}
                      <div>
                        <h2 className="text-2xl font-semibold text-white mb-6">Career Timeline</h2>
                        <div className="relative pl-8 space-y-8 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-primary/20">
                          {/* Career Start */}
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="relative"
                          >
                            <div className="absolute -left-10 top-1 w-4 h-4 rounded-full bg-primary border-4 border-dark" />
                            <div className="bg-dark/50 rounded-lg p-4 border border-primary/10">
                              <div className="text-primary font-medium">{star.biography.careerStart}</div>
                              <h3 className="text-white font-medium mt-1">Career Beginnings</h3>
                              <p className="text-white/60 mt-2 text-sm">Started career in modeling and entertainment</p>
                            </div>
                          </motion.div>

                          {/* Modeling Success */}
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="relative"
                          >
                            <div className="absolute -left-10 top-1 w-4 h-4 rounded-full bg-primary border-4 border-dark" />
                            <div className="bg-dark/50 rounded-lg p-4 border border-primary/10">
                              <div className="text-primary font-medium">2003</div>
                              <h3 className="text-white font-medium mt-1">Top Model of Turkey</h3>
                              <p className="text-white/60 mt-2 text-sm">Won the prestigious Top Model of Turkey competition</p>
                            </div>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="relative"
                          >
                            <div className="absolute -left-10 top-1 w-4 h-4 rounded-full bg-primary border-4 border-dark" />
                            <div className="bg-dark/50 rounded-lg p-4 border border-primary/10">
                              <div className="text-primary font-medium">2005</div>
                              <h3 className="text-white font-medium mt-1">International Success</h3>
                              <p className="text-white/60 mt-2 text-sm">Named second-best model in the world</p>
                            </div>
                          </motion.div>

                          {/* Filmography Timeline */}
                          {star.filmography.map((project: Project, index: number) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.6 + (index * 0.1) }}
                              className="relative"
                            >
                              <div className="absolute -left-10 top-1 w-4 h-4 rounded-full bg-primary border-4 border-dark" />
                              <div className="bg-dark/50 rounded-lg p-4 border border-primary/10">
                                <div className="text-primary font-medium">{project.year}</div>
                                <h3 className="text-white font-medium mt-1">{project.name}</h3>
                                <div className="text-sm text-white/60 mt-1">as {project.role}</div>
                                <div className="flex flex-col gap-1 mt-2">
                                  <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-sm text-white/40">{project.year}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-sm text-white/40">{project.streamingOn}</span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Career Achievements */}
                      <div>
                        <h2 className="text-2xl font-semibold text-white mb-6">Career Achievements</h2>
                        <div className="grid gap-4">
                          {star.biography.achievements.map((achievement: string, index: number) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="p-6 rounded-lg bg-dark/50 border border-primary/10"
                            >
                              <p className="text-white/90">{achievement}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Filmography Tab */}
                  {activeTab === 'filmography' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-8"
                    >
                      {/* Header with Stats and Filters */}
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-semibold text-white">{star.filmography.length} Shows</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex items-center gap-2 bg-white/5 rounded-lg px-4 py-2.5 hover:bg-white/10 transition-colors">
                            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                            </svg>
                            <select className="bg-transparent text-white/80 outline-none cursor-pointer appearance-none pr-6 relative">
                              <option className="bg-dark">Sort by Title</option>
                              <option className="bg-dark">Sort by Year</option>
                            </select>
                            <svg className="w-4 h-4 text-primary absolute right-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                          <div className="flex items-center gap-2 bg-white/5 rounded-lg px-4 py-2.5 hover:bg-white/10 transition-colors">
                            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            <select className="bg-transparent text-white/80 outline-none cursor-pointer appearance-none pr-6">
                              <option className="bg-dark">All Genres</option>
                              <option className="bg-dark">Drama</option>
                              <option className="bg-dark">Romance</option>
                              <option className="bg-dark">Historical</option>
                              <option className="bg-dark">Action</option>
                              <option className="bg-dark">Comedy</option>
                            </select>
                            <svg className="w-4 h-4 text-primary absolute right-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                          <div className="flex items-center gap-2 bg-white/5 rounded-lg px-4 py-2.5 hover:bg-white/10 transition-colors">
                            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <select className="bg-transparent text-white/80 outline-none cursor-pointer appearance-none pr-6">
                              <option className="bg-dark">All Years</option>
                              <option className="bg-dark">2024</option>
                              <option className="bg-dark">2023</option>
                              <option className="bg-dark">2022</option>
                              <option className="bg-dark">2021</option>
                              <option className="bg-dark">2020</option>
                            </select>
                            <svg className="w-4 h-4 text-primary absolute right-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Series Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
                        {[
                          {
                            name: "Kuruluş Osman",
                            year: 2019,
                            role: "Osman Bey",
                            genre: "Historical Drama",
                            image: "/img/series/kurulus-osman.jpg",
                            streamingOn: "ATV"
                          },
                          {
                            name: "Kara Sevda",
                            year: 2015,
                            role: "Kemal Soydere",
                            genre: "Romance Drama",
                            image: "/img/series/kara-sevda.jpeg",
                            streamingOn: "Star TV"
                          },
                          {
                            name: "Kardeşim Benim",
                            year: 2016,
                            role: "Hakan",
                            genre: "Comedy Drama",
                            image: "/img/series/kardesim-benim.jpeg",
                            streamingOn: "Netflix"
                          },
                          {
                            name: "Aşk Sana Benzer",
                            year: 2015,
                            role: "Ali",
                            genre: "Romance",
                            image: "/img/series/ask-sana-benzer.jpeg",
                            streamingOn: "Fox"
                          },
                          {
                            name: "Can Feda",
                            year: 2018,
                            role: "Pilot Yüzbaşı Onur",
                            genre: "Action",
                            image: "/img/series/can-feda.jpeg",
                            streamingOn: "TRT"
                          }
                        ].map((project, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group bg-dark/50 rounded-xl overflow-hidden border border-primary/10 hover:bg-dark/70 transition-all hover:scale-[1.02]"
                          >
                            <div className="flex gap-6">
                              <div className="w-[180px] aspect-[2/3] relative">
                                <Image
                                  src={project.image}
                                  alt={project.name}
                                  width={180}
                                  height={270}
                                  className="w-full h-full object-cover"
                                  priority={index < 2}
                                />
                              </div>
                              <div className="flex-1 py-6 pr-6">
                                <div className="space-y-2">
                                  <h3 className="text-xl font-semibold text-white group-hover:text-primary transition-colors">
                                    {project.name}
                                  </h3>
                                  <div className="text-sm text-white/60 mt-1">as {project.role}</div>
                                  <div className="flex flex-col gap-1 mt-2">
                                    <div className="flex items-center gap-2">
                                      <svg className="w-4 h-4 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg>
                                      <span className="text-sm text-white/40">{project.year}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <svg className="w-4 h-4 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                      </svg>
                                      <span className="text-sm text-white/40">{project.streamingOn}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
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
                      {/* Album Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Personal Album */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="group cursor-pointer"
                          onClick={() => setSelectedAlbum({
                            name: "Personal Photos",
                            cover: "/img/banners/serenay-sarikaya.jpg",
                            count: 42,
                            photos: [
                              { src: "/img/banners/serenay-sarikaya.jpg", description: "Award ceremony" },
                              { src: "/img/banners/burak-ozcivit.jpg", description: "On set" },
                              { src: "/img/banners/can-yaman.jpeg", description: "Magazine shoot" },
                              { src: "/img/banners/serenay-sarikaya.jpg", description: "Press conference" },
                              { src: "/img/banners/burak-ozcivit.jpg", description: "Behind the scenes" },
                              { src: "/img/banners/can-yaman.jpeg", description: "Red carpet" }
                            ]
                          })}
                        >
                          <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent z-10" />
                            <Image
                              src="/img/banners/serenay-sarikaya.jpg"
                              alt="Personal Photos"
                              width={400}
                              height={300}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                              <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">Personal Photos</h3>
                              <p className="text-sm text-white/60">42 photos</p>
                            </div>
                            <div className="absolute top-4 right-4 z-20">
                              <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </motion.div>

                        {/* Series Albums */}
                        {[
                          { 
                            name: "Kuruluş Osman",
                            cover: "/img/banners/burak-ozcivit.jpg",
                            count: 86,
                            photos: [
                              { src: "/img/banners/burak-ozcivit.jpg", description: "Season 1 promotional" },
                              { src: "/img/banners/serenay-sarikaya.jpg", description: "Behind the scenes" },
                              { src: "/img/banners/can-yaman.jpeg", description: "Cast photo" },
                              { src: "/img/banners/burak-ozcivit.jpg", description: "Season 2 promotional" }
                            ]
                          },
                          { 
                            name: "Kara Sevda",
                            cover: "/img/banners/can-yaman.jpeg",
                            count: 124,
                            photos: [
                              { src: "/img/banners/can-yaman.jpeg", description: "Season premiere" },
                              { src: "/img/banners/serenay-sarikaya.jpg", description: "Set photo" },
                              { src: "/img/banners/burak-ozcivit.jpg", description: "Cast reunion" }
                            ]
                          },
                          { 
                            name: "Behind the Scenes",
                            cover: "/img/banners/serenay-sarikaya.jpg",
                            count: 35,
                            photos: [
                              { src: "/img/banners/serenay-sarikaya.jpg", description: "Makeup session" },
                              { src: "/img/banners/burak-ozcivit.jpg", description: "Rehearsal" },
                              { src: "/img/banners/can-yaman.jpeg", description: "Script reading" }
                            ]
                          }
                        ].map((album, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="group cursor-pointer"
                            onClick={() => setSelectedAlbum(album)}
                          >
                            <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent z-10" />
                              <Image
                                src={album.cover}
                                alt={album.name}
                                width={400}
                                height={300}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                                <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">{album.name}</h3>
                                <p className="text-sm text-white/60">{album.count} photos</p>
                              </div>
                              <div className="absolute top-4 right-4 z-20">
                                <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Album View Modal */}
                      {selectedAlbum && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="fixed inset-0 bg-black/90 z-50 overflow-y-auto"
                        >
                          <div className="min-h-screen px-4 py-8">
                            <div className="max-w-7xl mx-auto">
                              {/* Modal Header */}
                              <div className="flex items-center justify-between mb-8">
                                <div>
                                  <h2 className="text-2xl font-semibold text-white">{selectedAlbum.name}</h2>
                                  <p className="text-white/60">{selectedAlbum.count} photos</p>
                                </div>
                                <button
                                  onClick={() => setSelectedAlbum(null)}
                                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
                                >
                                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>

                              {/* Photos Grid */}
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {selectedAlbum.photos.map((photo, index) => (
                                  <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group relative cursor-pointer"
                                    onClick={() => setSelectedPhoto({ ...photo, index })}
                                  >
                                    <div className="aspect-square rounded-xl overflow-hidden">
                                      <Image
                                        src={photo.src}
                                        alt={photo.description || selectedAlbum.name}
                                        width={400}
                                        height={400}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                      />
                                    </div>
                                    {photo.description && (
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                          <p className="text-white text-sm">{photo.description}</p>
                                        </div>
                                      </div>
                                    )}
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Full Screen Photo View */}
                      {selectedPhoto && selectedAlbum && (
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
                                  const prevPhoto = selectedAlbum.photos[selectedPhoto.index - 1]
                                  setSelectedPhoto({ ...prevPhoto, index: selectedPhoto.index - 1 })
                                }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center z-50"
                              >
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                              </button>
                            )}
                            {selectedPhoto.index < selectedAlbum.photos.length - 1 && (
                              <button
                                onClick={() => {
                                  const nextPhoto = selectedAlbum.photos[selectedPhoto.index + 1]
                                  setSelectedPhoto({ ...nextPhoto, index: selectedPhoto.index + 1 })
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
                                alt={selectedPhoto.description || selectedAlbum.name}
                                width={1200}
                                height={800}
                                className="max-w-full max-h-[90vh] object-contain"
                              />
                              {selectedPhoto.description && (
                                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                                  <p className="text-white text-lg max-w-3xl mx-auto text-center">{selectedPhoto.description}</p>
                                </div>
                              )}
                            </div>

                            {/* Photo Counter */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
                              <p className="text-white text-sm">
                                {selectedPhoto.index + 1} / {selectedAlbum.photos.length}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {/* Videos Tab */}
                  {activeTab === 'videos' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                      <div className="text-center py-12">
                        <svg className="w-16 h-16 text-primary/20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <p className="text-third/60">Videos coming soon...</p>
                      </div>
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
                <p className="text-white/60 text-sm">Stay updated with {star.name}'s latest activities and achievements</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-white/40">4 articles</span>
                <span className="text-sm text-white/40">•</span>
                <span className="text-sm text-white/40">Last updated Feb 15, 2024</span>
              </div>
              <button 
                onClick={() => window.location.href = `${window.location.pathname}/news`}
                className="text-primary hover:text-primary/80 transition-colors text-sm font-medium flex items-center gap-2"
              >
                View all news
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
            {/* News items */}
            <div className="group cursor-pointer">
              <div className="aspect-video rounded-lg overflow-hidden mb-3">
                <Image
                  src="/img/banners/serenay-sarikaya.jpg"
                  alt="News thumbnail"
                  width={320}
                  height={180}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <time className="text-white/40 text-sm">February 15, 2024</time>
              <h4 className="text-white font-medium mt-2 group-hover:text-primary transition-colors">
                {star.name} Wins Best Actor Award
              </h4>
            </div>

            <div className="group cursor-pointer">
              <div className="aspect-video rounded-lg overflow-hidden mb-3">
                <Image
                  src="/img/banners/burak-ozcivit.jpg"
                  alt="News thumbnail"
                  width={320}
                  height={180}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <time className="text-white/40 text-sm">February 10, 2024</time>
              <h4 className="text-white font-medium mt-2 group-hover:text-primary transition-colors">
                Behind the Scenes: New Project
              </h4>
            </div>

            <div className="group cursor-pointer">
              <div className="aspect-video rounded-lg overflow-hidden mb-3">
                <Image
                  src="/img/banners/can-yaman.jpeg"
                  alt="News thumbnail"
                  width={320}
                  height={180}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <time className="text-white/40 text-sm">February 5, 2024</time>
              <h4 className="text-white font-medium mt-2 group-hover:text-primary transition-colors">
                Interview: Life on Set
              </h4>
            </div>

            <div className="group cursor-pointer">
              <div className="aspect-video rounded-lg overflow-hidden mb-3">
                <Image
                  src="/img/banners/serenay-sarikaya.jpg"
                  alt="News thumbnail"
                  width={320}
                  height={180}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <time className="text-white/40 text-sm">January 30, 2024</time>
              <h4 className="text-white font-medium mt-2 group-hover:text-primary transition-colors">
                Exclusive: On-Set Photos
              </h4>
            </div>
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
                  <p className="text-white/60 text-sm">Join the conversation about {star.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/60 text-sm">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'most_liked')}
                  className="bg-[#1E1E1E] text-white border border-white/10 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#C8AA6E] focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="most_liked">Most Liked</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* New Comment Form */}
            <div className="mb-8">
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src="/img/avatar-placeholder.jpg"
                      alt="Your Avatar"
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder={`Share your thoughts about ${star?.name}...`}
                      className="w-full px-4 py-3 bg-[#1E1E1E] rounded-lg text-white placeholder-white/40 border border-white/10 focus:ring-2 focus:ring-[#C8AA6E] focus:border-transparent transition-colors resize-none min-h-[100px]"
                    />
                    <div className="flex justify-end mt-4">
                      <button
                        type="submit"
                        disabled={!newComment.trim()}
                        className="px-6 py-2 bg-[#C8AA6E] text-black rounded-lg text-sm font-medium hover:bg-[#D4B87A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Post Comment
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
              {sortedComments.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-white mb-2">No Comments Yet</h3>
                  <p className="text-white/60 max-w-md mx-auto">Be the first to share your thoughts about {star.name}. Your comment could start an exciting discussion!</p>
                </div>
              ) : (
                <>
                  {sortedComments.map((comment) => (
                    <div key={comment.id} className="bg-dark/50 rounded-xl p-6 space-y-6">
                      {/* Main Comment */}
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={comment.user.avatar}
                            alt={comment.user.name}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-white font-medium">{comment.user.name}</h4>
                              <p className="text-white/60 text-sm">
                                {format(comment.timestamp, 'MMM d, yyyy')}
                              </p>
                            </div>
                            <button
                              onClick={() => handleLike(comment.id)}
                              className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors ${
                                comment.isLiked
                                  ? 'text-[#C8AA6E] bg-[#C8AA6E]/10'
                                  : 'text-white/60 hover:text-white/80'
                              }`}
                            >
                              <svg
                                className="w-4 h-4"
                                fill={comment.isLiked ? 'currentColor' : 'none'}
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                              </svg>
                              {comment.likes}
                            </button>
                          </div>
                          {editingCommentId === comment.id ? (
                            <div className="mt-4">
                              <form 
                                onSubmit={(e) => {
                                  e.preventDefault()
                                  handleEditComment(comment.id, editContent)
                                }}
                                className="space-y-4"
                              >
                                <textarea
                                  value={editContent}
                                  onChange={(e) => setEditContent(e.target.value)}
                                  className="w-full px-4 py-3 bg-[#1E1E1E] rounded-lg text-white placeholder-white/40 border border-white/10 focus:ring-2 focus:ring-[#C8AA6E] focus:border-transparent transition-colors resize-none min-h-[80px]"
                                />
                                <div className="flex justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingCommentId(null)
                                      setEditContent('')
                                    }}
                                    className="px-4 py-2 text-white/60 hover:text-white/80 text-sm transition-colors"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="submit"
                                    disabled={!editContent.trim()}
                                    className="px-4 py-2 bg-[#C8AA6E] text-black rounded-lg text-sm font-medium hover:bg-[#D4B87A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    Save Changes
                                  </button>
                                </div>
                              </form>
                            </div>
                          ) : (
                            <p className="text-white/80 leading-relaxed">{comment.content}</p>
                          )}
                          <div className="flex items-center gap-4 pt-2">
                            <button 
                              onClick={() => setReplyingTo(comment.id)}
                              className="text-[#C8AA6E] text-sm hover:text-[#D4B87A] transition-colors"
                            >
                              Reply
                            </button>
                            {comment.isOwnComment && (
                              <>
                                <button 
                                  onClick={() => {
                                    setEditingCommentId(comment.id)
                                    setEditContent(comment.content)
                                  }}
                                  className="text-[#C8AA6E] text-sm hover:text-[#D4B87A] transition-colors"
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={() => handleDeleteComment(comment.id)}
                                  className="text-red-500 text-sm hover:text-red-400 transition-colors"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Reply Form */}
                      {replyingTo === comment.id && (
                        <div className="ml-14 mt-4">
                          <form 
                            onSubmit={(e) => {
                              e.preventDefault()
                              handleReply(comment.id, replyContent)
                            }}
                            className="space-y-4"
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                                <Image
                                  src="/img/avatar-placeholder.jpg"
                                  alt="Your Avatar"
                                  width={32}
                                  height={32}
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <textarea
                                  value={replyContent}
                                  onChange={(e) => setReplyContent(e.target.value)}
                                  placeholder={`Reply to ${comment.user.name}...`}
                                  className="w-full px-4 py-3 bg-[#1E1E1E] rounded-lg text-white placeholder-white/40 border border-white/10 focus:ring-2 focus:ring-[#C8AA6E] focus:border-transparent transition-colors resize-none min-h-[80px]"
                                />
                                <div className="flex justify-end gap-2 mt-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setReplyingTo(null)
                                      setReplyContent('')
                                    }}
                                    className="px-4 py-2 text-white/60 hover:text-white/80 text-sm transition-colors"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="submit"
                                    disabled={!replyContent.trim()}
                                    className="px-4 py-2 bg-[#C8AA6E] text-black rounded-lg text-sm font-medium hover:bg-[#D4B87A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    Reply
                                  </button>
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                      )}

                      {/* Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="ml-14 space-y-4 pt-4 border-l-2 border-white/10 pl-6">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex gap-4">
                              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                                <Image
                                  src={reply.user.avatar}
                                  alt={reply.user.name}
                                  width={32}
                                  height={32}
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 space-y-2">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="text-white font-medium">{reply.user.name}</h4>
                                    <p className="text-white/60 text-sm">
                                      {format(reply.timestamp, 'MMM d, yyyy')}
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => handleLike(reply.id)}
                                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors ${
                                      reply.isLiked
                                        ? 'text-[#C8AA6E] bg-[#C8AA6E]/10'
                                        : 'text-white/60 hover:text-white/80'
                                    }`}
                                  >
                                    <svg
                                      className="w-4 h-4"
                                      fill={reply.isLiked ? 'currentColor' : 'none'}
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                      />
                                    </svg>
                                    {reply.likes}
                                  </button>
                                </div>
                                {editingCommentId === reply.id ? (
                                  <div className="mt-4">
                                    <form 
                                      onSubmit={(e) => {
                                        e.preventDefault()
                                        handleEditComment(reply.id, editContent)
                                      }}
                                      className="space-y-4"
                                    >
                                      <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        className="w-full px-4 py-3 bg-[#1E1E1E] rounded-lg text-white placeholder-white/40 border border-white/10 focus:ring-2 focus:ring-[#C8AA6E] focus:border-transparent transition-colors resize-none min-h-[80px]"
                                      />
                                      <div className="flex justify-end gap-2">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setEditingCommentId(null)
                                            setEditContent('')
                                          }}
                                          className="px-4 py-2 text-white/60 hover:text-white/80 text-sm transition-colors"
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          type="submit"
                                          disabled={!editContent.trim()}
                                          className="px-4 py-2 bg-[#C8AA6E] text-black rounded-lg text-sm font-medium hover:bg-[#D4B87A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                          Save Changes
                                        </button>
                                      </div>
                                    </form>
                                  </div>
                                ) : (
                                  <p className="text-white/80 leading-relaxed">{reply.content}</p>
                                )}
                                {reply.isOwnComment && (
                                  <div className="flex items-center gap-4 pt-2">
                                    <button 
                                      onClick={() => {
                                        setEditingCommentId(reply.id)
                                        setEditContent(reply.content)
                                      }}
                                      className="text-[#C8AA6E] text-sm hover:text-[#D4B87A] transition-colors"
                                    >
                                      Edit
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteComment(reply.id)}
                                      className="text-red-500 text-sm hover:text-red-400 transition-colors"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Load More Trigger */}
                  <div
                    ref={observerTarget}
                    className="text-center py-4"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2 text-white/60">
                        <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Loading more comments...
                      </div>
                    ) : (
                      <button
                        onClick={loadMoreComments}
                        className="text-[#C8AA6E] text-sm hover:text-[#D4B87A] transition-colors"
                      >
                        Load More Comments
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
  