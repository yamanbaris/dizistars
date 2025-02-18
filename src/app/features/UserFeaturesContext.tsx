'use client'

/* cSpell:words sonner Supabase */

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from '../auth/AuthContext'
import type { UserFavorite, UserNotification } from '@/types/user'
import * as db from '@/lib/database'
import { toast } from 'sonner'

interface UserFeaturesContextType {
  favorites: UserFavorite[]
  notifications: UserNotification[]
  unreadNotificationsCount: number
  addToFavorites: (starId: string) => Promise<void>
  removeFromFavorites: (starId: string) => Promise<void>
  markNotificationAsRead: (notificationId: string) => void
}

const UserFeaturesContext = createContext<UserFeaturesContextType | undefined>(undefined)

export function UserFeaturesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<UserFavorite[]>([])
  const [notifications, setNotifications] = useState<UserNotification[]>([])

  useEffect(() => {
    if (user) {
      loadUserData()
    }
  }, [user])

  const loadUserData = async () => {
    if (!user) return

    try {
      const userFavorites = await db.favoritesApi.getByUser(user.id)
      setFavorites(userFavorites)
      // TODO: Load notifications from API when implemented
      setNotifications([])
    } catch (error) {
      console.error('Error loading user data:', error)
      toast.error('Failed to load user data')
    }
  }

  const addToFavorites = async (starId: string) => {
    if (!user) {
      toast.error('Please log in to add favorites')
      return
    }

    try {
      const favorite = await db.favoritesApi.add(user.id, starId)
      setFavorites(prev => [...prev, favorite])
      toast.success('Added to favorites')
    } catch (error) {
      console.error('Error adding favorite:', error)
      toast.error('Failed to add to favorites')
    }
  }

  const removeFromFavorites = async (starId: string) => {
    if (!user) return

    try {
      await db.favoritesApi.remove(user.id, starId)
      setFavorites(prev => prev.filter(f => f.star_id !== starId))
      toast.success('Removed from favorites')
    } catch (error) {
      console.error('Error removing favorite:', error)
      toast.error('Failed to remove from favorites')
    }
  }

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    )
  }

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length

  const value = {
    favorites,
    notifications,
    unreadNotificationsCount,
    addToFavorites,
    removeFromFavorites,
    markNotificationAsRead,
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