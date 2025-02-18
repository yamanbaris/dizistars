'use client'

/* cSpell:words sonner Supabase */

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from '../auth/AuthContext'
import {
  UserFavorite,
  UserNotification,
  UserComment,
  UserRating,
  UserPreferences
} from '@/types/user'
import * as db from '@/lib/database'
import type { TableRow } from '@/lib/supabase'
import { toast } from 'sonner'

interface FavoriteWithStar {
  id: string;
  created_at: string;
  star_id: string;
  star: {
    id: string;
    name: string;
    image_url: string;
  } | null;
}

interface UserFeaturesContextType {
  // Favorites (stars only)
  favorites: UserFavorite[]
  addToFavorites: (star: { id: string; title: string; image: string }) => Promise<void>
  removeFromFavorites: (id: string) => Promise<void>

  // Notifications
  notifications: UserNotification[]
  unreadNotificationsCount: number
  markNotificationAsRead: (id: string) => Promise<void>
  markAllNotificationsAsRead: () => Promise<void>
  clearNotification: (id: string) => Promise<void>

  // Comments & Ratings
  addComment: (comment: Omit<UserComment, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<TableRow<'comments'> | undefined>
  deleteComment: (id: string) => Promise<void>
  updateCommentStatus: (id: string, status: 'approved' | 'rejected') => Promise<TableRow<'comments'> | undefined>
  addRating: (rating: Omit<UserRating, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateRating: (id: string, rating: number, review?: string) => Promise<void>

  // Preferences
  preferences: UserPreferences
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>
}

const UserFeaturesContext = createContext<UserFeaturesContextType | undefined>(undefined)

export function UserFeaturesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<UserFavorite[]>([])
  const [notifications, setNotifications] = useState<UserNotification[]>([])
  const [preferences, setPreferences] = useState<UserPreferences>({
    emailNotifications: {
      comments: true,
      likes: true,
      follows: true,
      news: true,
      newsletter: true
    },
    favoritesPrivacy: 'public',
    showOnlineStatus: true
  })

  useEffect(() => {
    if (user) {
      loadUserData()
    }
  }, [user])

  const loadUserData = async () => {
    if (!user) return

    try {
      // Load favorites
      const userFavorites = await db.getFavorites(user.id) as FavoriteWithStar[]
      setFavorites(userFavorites.map((f) => ({
        id: f.id,
        type: 'star' as const,
        title: f.star?.name || '',
        image: f.star?.image_url || '',
        addedAt: f.created_at
      })))

      // Load notifications (to be implemented)
      // Load preferences (to be implemented)
    } catch (error) {
      console.error('Error loading user data:', error)
      toast.error('Failed to load user data')
    }
  }

  const addToFavorites = async (star: { id: string; title: string; image: string }) => {
    if (!user) {
      toast.error('Please log in to add favorites')
      return
    }

    try {
      const favorite = await db.addFavorite(user.id, star.id)
      setFavorites(prev => [...prev, {
        id: favorite.id,
        type: 'star',
        title: star.title,
        image: star.image,
        addedAt: favorite.created_at
      }])
      toast.success('Added to favorites')
    } catch (error) {
      console.error('Error adding favorite:', error)
      toast.error('Failed to add to favorites')
    }
  }

  const removeFromFavorites = async (starId: string) => {
    if (!user) return

    try {
      await db.removeFavorite(user.id, starId)
      setFavorites(prev => prev.filter(f => f.id !== starId))
      toast.success('Removed from favorites')
    } catch (error) {
      console.error('Error removing favorite:', error)
      toast.error('Failed to remove from favorites')
    }
  }

  const addComment = async (comment: Omit<UserComment, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      toast.error('Please log in to comment');
      return;
    }

    try {
      const newComment = await db.createComment({
        user_id: user.id,
        target_type: comment.targetType === 'series' ? 'star' : comment.targetType,
        target_id: comment.targetId,
        content: comment.content,
        status: 'pending'
      });

      toast.success('Comment submitted for review');
      return newComment;
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
      throw error;
    }
  };

  const deleteComment = async (id: string) => {
    if (!user) return;

    try {
      await db.deleteComment(id);
      toast.success('Comment deleted');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
      throw error;
    }
  };

  const updateCommentStatus = async (id: string, status: 'approved' | 'rejected') => {
    if (!user) return;

    try {
      const updatedComment = await db.updateComment(id, { status });
      toast.success(`Comment ${status}`);
      return updatedComment;
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error('Failed to update comment');
      throw error;
    }
  };

  const addRating = async (rating: Omit<UserRating, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      toast.error('Please log in to rate')
      return
    }

    try {
      await db.createOrUpdateRating({
        user_id: user.id,
        star_id: rating.targetId,
        rating: rating.rating,
        review: rating.review
      })
      toast.success('Rating added')
    } catch (error) {
      console.error('Error adding rating:', error)
      toast.error('Failed to add rating')
    }
  }

  const updateRating = async (id: string, rating: number, review?: string) => {
    if (!user) return

    try {
      await db.createOrUpdateRating({
        user_id: user.id,
        star_id: id,
        rating,
        review
      })
      toast.success('Rating updated')
    } catch (error) {
      console.error('Error updating rating:', error)
      toast.error('Failed to update rating')
    }
  }

  // Notification functions (to be implemented with real-time subscriptions)
  const markNotificationAsRead = async (id: string) => {
    // TODO: Implement with Supabase real-time
  }

  const markAllNotificationsAsRead = async () => {
    // TODO: Implement with Supabase real-time
  }

  const clearNotification = async (id: string) => {
    // TODO: Implement with Supabase real-time
  }

  // Preferences functions (to be implemented)
  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    // TODO: Implement preferences in database
  }

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    notifications,
    unreadNotificationsCount: notifications.filter(n => !n.isRead).length,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotification,
    addComment,
    deleteComment,
    updateCommentStatus,
    addRating,
    updateRating,
    preferences,
    updatePreferences,
  }

  return (
    <UserFeaturesContext.Provider value={value}>
      {children}
    </UserFeaturesContext.Provider>
  )
}

export function useUserFeatures() {
  const context = useContext(UserFeaturesContext)
  if (context === undefined) {
    throw new Error('useUserFeatures must be used within a UserFeaturesProvider')
  }
  return context
} 