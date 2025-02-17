export interface UserFavorite {
  id: string
  type: 'star' | 'series' | 'movie'
  title: string
  image: string
  addedAt: string
}

export interface UserNotification {
  id: string
  type: 'comment' | 'like' | 'follow' | 'system' | 'news'
  title: string
  message: string
  link: string
  isRead: boolean
  createdAt: string
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
  id: string
  userId: string
  targetType: 'series' | 'movie'
  targetId: string
  rating: number
  review?: string
  createdAt: string
  updatedAt: string
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