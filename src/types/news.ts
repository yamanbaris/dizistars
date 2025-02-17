export type NewsCategory = 
  | 'Series'
  | 'Actors'
  | 'Industry'
  | 'Awards'
  | 'Interviews'
  | 'Behind The Scenes'

export interface NewsArticle {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  category: NewsCategory
  author: {
    name: string
    avatar: string
  }
  publishedAt: string
  readTime: number
  tags: string[]
  relatedArticles?: string[] // IDs of related articles
}

export interface NewsFilter {
  category?: NewsCategory
  tag?: string
  search?: string
  page?: number
  limit?: number
} 