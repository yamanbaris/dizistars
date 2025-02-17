'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { useAuth } from '../auth/AuthContext'
import ProtectedRoute from '../auth/ProtectedRoute'
import UserFeaturesSection from '@/components/sections/UserFeaturesSection'

interface UserProfile {
  name: string
  email: string
  avatar: string
  bio: string
  location: string
  joinDate: string
  favoriteGenres: string[]
  watchlist: number
  following: number
  followers: number
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
}

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'activity'>('profile')

  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      user: {
        name: 'Ayşe Yılmaz',
        avatar: '/img/avatar-placeholder.jpg'
      },
      content: 'Your reviews on Turkish dramas are always so insightful! Love following your updates.',
      timestamp: new Date('2024-02-15'),
      likes: 24,
      isLiked: false
    },
    {
      id: '2',
      user: {
        name: 'Mehmet Demir',
        avatar: '/img/avatar-placeholder.jpg'
      },
      content: 'Great recommendations! I started watching Kara Sevda because of your review.',
      timestamp: new Date('2024-02-14'),
      likes: 18,
      isLiked: true,
      replies: [
        {
          id: '2-1',
          user: {
            name: 'John Doe',
            avatar: '/img/avatar-placeholder.jpg'
          },
          content: 'Thank you! Glad you enjoyed it. The series only gets better!',
          timestamp: new Date('2024-02-14'),
          likes: 8,
          isLiked: false
        }
      ]
    }
  ])
  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const observerTarget = useRef(null)

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
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    // Add more comments here
    setPage(prev => prev + 1)
    setIsLoading(false)
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      user: {
        name: user?.name || '',
        avatar: user?.avatar || '/img/avatar-placeholder.jpg'
      },
      content: newComment,
      timestamp: new Date(),
      likes: 0,
      isLiked: false
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
        return comment
      })
    )
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#101114] pt-28 pb-16">
        <div className="container mx-auto px-4">
          {/* Profile Header */}
          <div className="relative mb-8">
            {/* Cover Image */}
            <div className="h-48 md:h-64 rounded-xl overflow-hidden bg-gradient-to-r from-[#C8AA6E]/20 to-[#C8AA6E]/10">
              <div className="w-full h-full bg-[url('/img/cover-pattern.png')] bg-repeat opacity-10" />
            </div>

            {/* Profile Info */}
            <div className="flex flex-col md:flex-row gap-6 -mt-16 px-4">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#101114] bg-[#1E1E1E]">
                  <Image
                    src={user?.avatar || '/img/avatar-placeholder.jpg'}
                    alt={user?.name || ''}
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>
                <button 
                  className="absolute bottom-0 right-0 p-2 rounded-full bg-[#C8AA6E] text-black hover:bg-[#D4B87A] transition-colors"
                  onClick={() => setIsEditing(true)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>

              {/* User Info */}
              <div className="flex-1 pt-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
                    <p className="text-white/60 text-sm">{user?.email}</p>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2 bg-[#C8AA6E] text-black rounded-lg text-sm font-medium hover:bg-[#D4B87A] transition-colors"
                    >
                      Edit Profile
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="px-6 py-2 border border-white/10 text-white rounded-lg text-sm font-medium hover:bg-white/5 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex gap-6">
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">24</div>
                    <div className="text-sm text-white/60">Watchlist</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">156</div>
                    <div className="text-sm text-white/60">Following</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">89</div>
                    <div className="text-sm text-white/60">Followers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-white/10 mb-8">
            <div className="flex gap-8">
              {['profile', 'settings', 'activity'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as typeof activeTab)}
                  className={`px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-[#C8AA6E] text-[#C8AA6E]'
                      : 'border-transparent text-white/60 hover:text-white'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Profile Content */}
          {activeTab === 'profile' && (
            <div className="space-y-8">
              {/* About and Favorite Genres */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* About */}
                  <div className="bg-[#1E1E1E] rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">About</h3>
                    <p className="text-white/60">
                      Passionate about Turkish dramas and storytelling. Always looking for the next great series to watch.
                    </p>
                  </div>

                  {/* Favorite Genres */}
                  <div className="bg-[#1E1E1E] rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Favorite Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {['Drama', 'Romance', 'Historical'].map((genre) => (
                        <span
                          key={genre}
                          className="px-3 py-1 bg-[#C8AA6E]/10 text-[#C8AA6E] rounded-full text-sm"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Middle and Right Columns */}
                <div className="md:col-span-2">
                  <UserFeaturesSection />
                </div>
              </div>

              {/* Activity Feed */}
              <div className="space-y-6">
                {/* New Comment Form */}
                <form onSubmit={handleCommentSubmit} className="bg-[#1E1E1E] rounded-lg p-6">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="w-full px-4 py-3 bg-[#101114] rounded-lg text-white placeholder-white/40 border border-white/10 focus:ring-2 focus:ring-[#C8AA6E] focus:border-transparent transition-colors resize-none"
                    rows={3}
                  />
                  <div className="mt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={!newComment.trim()}
                      className="px-6 py-2 bg-[#C8AA6E] text-black rounded-lg text-sm font-medium hover:bg-[#D4B87A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Post
                    </button>
                  </div>
                </form>

                {/* Comments */}
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="bg-[#1E1E1E] rounded-lg p-6">
                      <div className="flex items-start gap-4">
                        <Image
                          src={comment.user.avatar}
                          alt={comment.user.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-white">{comment.user.name}</h4>
                            <span className="text-sm text-white/40">
                              {format(comment.timestamp, 'MMM d, yyyy')}
                            </span>
                          </div>
                          <p className="mt-2 text-white/80">{comment.content}</p>
                          <div className="mt-4 flex items-center gap-4">
                            <button
                              onClick={() => handleLike(comment.id)}
                              className={`flex items-center gap-2 text-sm ${
                                comment.isLiked ? 'text-[#C8AA6E]' : 'text-white/60'
                              }`}
                            >
                              <svg
                                className="w-5 h-5"
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
                            <button className="text-sm text-white/60">Reply</button>
                          </div>
                        </div>
                      </div>

                      {/* Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-4 ml-14 space-y-4">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="bg-[#101114] rounded-lg p-4">
                              <div className="flex items-start gap-4">
                                <Image
                                  src={reply.user.avatar}
                                  alt={reply.user.name}
                                  width={32}
                                  height={32}
                                  className="rounded-full"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-medium text-white">{reply.user.name}</h4>
                                    <span className="text-sm text-white/40">
                                      {format(reply.timestamp, 'MMM d, yyyy')}
                                    </span>
                                  </div>
                                  <p className="mt-2 text-white/80">{reply.content}</p>
                                  <div className="mt-4 flex items-center gap-4">
                                    <button
                                      onClick={() => handleLike(reply.id)}
                                      className={`flex items-center gap-2 text-sm ${
                                        reply.isLiked ? 'text-[#C8AA6E]' : 'text-white/60'
                                      }`}
                                    >
                                      <svg
                                        className="w-5 h-5"
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
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Load More */}
                  <div ref={observerTarget} className="text-center py-4">
                    {isLoading && (
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C8AA6E] mx-auto"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-[#1E1E1E] rounded-lg p-6 space-y-6">
                <h3 className="text-lg font-semibold text-white">Account Settings</h3>
                
                {/* Email Preferences */}
                <div>
                  <h4 className="text-white font-medium mb-4">Email Notifications</h4>
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-white/10 bg-[#101114] text-[#C8AA6E] focus:ring-[#C8AA6E]"
                      />
                      <span className="ml-2 text-white/80">New comments on your posts</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-white/10 bg-[#101114] text-[#C8AA6E] focus:ring-[#C8AA6E]"
                      />
                      <span className="ml-2 text-white/80">New followers</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-white/10 bg-[#101114] text-[#C8AA6E] focus:ring-[#C8AA6E]"
                      />
                      <span className="ml-2 text-white/80">Weekly digest</span>
                    </label>
                  </div>
                </div>

                {/* Privacy Settings */}
                <div>
                  <h4 className="text-white font-medium mb-4">Privacy</h4>
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-white/10 bg-[#101114] text-[#C8AA6E] focus:ring-[#C8AA6E]"
                      />
                      <span className="ml-2 text-white/80">Make profile private</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-white/10 bg-[#101114] text-[#C8AA6E] focus:ring-[#C8AA6E]"
                      />
                      <span className="ml-2 text-white/80">Show online status</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <button
                    onClick={handleLogout}
                    className="px-6 py-2 bg-red-500/10 text-red-500 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
} 