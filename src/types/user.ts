import type { TableRow } from './supabase'

export type UserFavorite = TableRow<'favorites'>

export interface UserFeatures {
  favorites: UserFavorite[]
}

export interface UserNotification {
  id: string
  user_id: string
  message: string
  isRead: boolean
  created_at: string
  type: 'system' | 'favorite' | 'comment'
  related_id?: string
}

export interface UserComment {
  id: string
  userId: string
  targetType: 'news' | 'series' | 'star'
  targetId: string
  content: string
  likes: number
  createdAt: string
  updatedAt: string
  replies?: UserComment[]
}

export interface UserRating {
  id: string;
  user_id: string;
  star_id: string;
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  emailNotifications: {
    comments: boolean
    likes: boolean
    follows: boolean
    news: boolean
    newsletter: boolean
  }
  favoritesPrivacy: 'public' | 'private' | 'friends'
  showOnlineStatus: boolean
} 