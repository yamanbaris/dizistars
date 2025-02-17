'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from '../auth/AuthContext'
import {
  UserFavorite,
  UserNotification,
  UserComment,
  UserRating,
  UserPreferences
} from '@/types/user'

interface UserFeaturesContextType {
  // Favorites (stars only)
  favorites: UserFavorite[]
  addToFavorites: (star: { title: string; image: string }) => Promise<void>
  removeFromFavorites: (id: string) => Promise<void>

  // Notifications
  notifications: UserNotification[]
  unreadNotificationsCount: number
  markNotificationAsRead: (id: string) => Promise<void>
  markAllNotificationsAsRead: () => Promise<void>
  clearNotification: (id: string) => Promise<void>

  // Comments & Ratings
  addComment: (comment: Omit<UserComment, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>
  deleteComment: (id: string) => Promise<void>
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

  // Load user data when authenticated
  useEffect(() => {
    if (user) {
      loadUserData()
    }
  }, [user])

  const loadUserData = async () => {
    try {
      // TODO: Replace with actual API calls
      // Simulated data loading
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data - only star favorites
      setFavorites([
        {
          id: '1',
          type: 'star',
          title: 'Burak Özçivit',
          image: '/img/stars/burak-ozcivit.jpg',
          addedAt: new Date().toISOString()
        },
        {
          id: '2',
          type: 'star',
          title: 'Çağatay Ulusoy',
          image: '/img/stars/cagatay-ulusoy.jpg',
          addedAt: new Date().toISOString()
        }
      ])

      setNotifications([
        {
          id: '1',
          type: 'comment',
          title: 'New Comment',
          message: 'Someone replied to your comment',
          link: '/news/article-1#comment-1',
          isRead: false,
          createdAt: new Date().toISOString()
        }
      ])
    } catch (error) {
      console.error('Error loading user data:', error)
    }
  }

  // Favorites functions - only for stars
  const addToFavorites = async (star: { title: string; image: string }) => {
    try {
      const newFavorite: UserFavorite = {
        ...star,
        id: Date.now().toString(),
        type: 'star',
        addedAt: new Date().toISOString()
      }
      setFavorites(prev => [...prev, newFavorite])
    } catch (error) {
      console.error('Error adding to favorites:', error)
      throw error
    }
  }

  const removeFromFavorites = async (id: string) => {
    try {
      setFavorites(prev => prev.filter(item => item.id !== id))
    } catch (error) {
      console.error('Error removing from favorites:', error)
      throw error
    }
  }

  // Notifications functions
  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length

  const markNotificationAsRead = async (id: string) => {
    try {
      // TODO: Replace with actual API call
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id ? { ...notification, isRead: true } : notification
        )
      )
    } catch (error) {
      console.error('Error marking notification as read:', error)
      throw error
    }
  }

  const markAllNotificationsAsRead = async () => {
    try {
      // TODO: Replace with actual API call
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, isRead: true }))
      )
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      throw error
    }
  }

  const clearNotification = async (id: string) => {
    try {
      // TODO: Replace with actual API call
      setNotifications(prev => prev.filter(notification => notification.id !== id))
    } catch (error) {
      console.error('Error clearing notification:', error)
      throw error
    }
  }

  // Comments & Ratings functions
  const addComment = async (comment: Omit<UserComment, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      // TODO: Replace with actual API call
      // Implementation will be added when integrating with backend
      console.log('Adding comment:', comment)
    } catch (error) {
      console.error('Error adding comment:', error)
      throw error
    }
  }

  const deleteComment = async (id: string) => {
    try {
      // TODO: Replace with actual API call
      // Implementation will be added when integrating with backend
      console.log('Deleting comment:', id)
    } catch (error) {
      console.error('Error deleting comment:', error)
      throw error
    }
  }

  const addRating = async (rating: Omit<UserRating, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      // TODO: Replace with actual API call
      // Implementation will be added when integrating with backend
      console.log('Adding rating:', rating)
    } catch (error) {
      console.error('Error adding rating:', error)
      throw error
    }
  }

  const updateRating = async (id: string, rating: number, review?: string) => {
    try {
      // TODO: Replace with actual API call
      // Implementation will be added when integrating with backend
      console.log('Updating rating:', { id, rating, review })
    } catch (error) {
      console.error('Error updating rating:', error)
      throw error
    }
  }

  // Preferences functions
  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    try {
      // TODO: Replace with actual API call
      setPreferences(prev => ({ ...prev, ...newPreferences }))
    } catch (error) {
      console.error('Error updating preferences:', error)
      throw error
    }
  }

  return (
    <UserFeaturesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotification,
        addComment,
        deleteComment,
        addRating,
        updateRating,
        preferences,
        updatePreferences
      }}
    >
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