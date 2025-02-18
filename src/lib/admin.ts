import { supabase } from './supabase'
import type { Tables, TableRow } from './supabase'

interface RecentComment {
  id: string
  content: string
  status: string
  created_at: string
  user: {
    name: string
  } | null
}

interface Activity {
  type: 'user' | 'star' | 'news' | 'comment'
  id: string
  title: string
  subtitle: string
  timestamp: string
  status?: string
}

// Dashboard Stats
export async function getDashboardStats() {
  try {
    // Get stars count - using simple select since count is having issues
    const { data: stars, error: starsError } = await supabase
      .from('stars')
      .select('id')

    if (starsError) {
      console.error('Stars query error:', starsError)
      throw starsError
    }

    // Get users count
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id')

    if (usersError) {
      console.error('Users query error:', usersError)
      throw usersError
    }

    // Get news count
    const { data: news, error: newsError } = await supabase
      .from('news')
      .select('id')

    if (newsError) {
      console.error('News query error:', newsError)
      throw newsError
    }

    // Get comments count
    const { data: comments, error: commentsError } = await supabase
      .from('comments')
      .select('id')

    if (commentsError) {
      console.error('Comments query error:', commentsError)
      throw commentsError
    }

    const stats = {
      users: users?.length ?? 0,
      stars: stars?.length ?? 0,
      news: news?.length ?? 0,
      comments: comments?.length ?? 0
    }

    console.log('Final stats:', stats)
    return stats
  } catch (error) {
    console.error('getDashboardStats error:', error)
    throw error
  }
}

// Recent Activity
export async function getRecentActivity(limit = 10) {
  const { data: recentUsers, error: usersError } = await supabase
    .from('users')
    .select('id, email, created_at')
    .order('created_at', { ascending: false })
    .limit(limit)

  const { data: recentStars, error: starsError } = await supabase
    .from('stars')
    .select('id, full_name, star_type, created_at')
    .order('created_at', { ascending: false })
    .limit(limit)

  const { data: recentNews, error: newsError } = await supabase
    .from('news')
    .select('id, title, status, created_at')
    .order('created_at', { ascending: false })
    .limit(limit)

  const { data: recentComments, error: commentsError } = await supabase
    .from('comments')
    .select('id, content, status, created_at, user_id')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (usersError) throw usersError
  if (starsError) throw starsError
  if (newsError) throw newsError
  if (commentsError) throw commentsError

  // Combine and sort all recent activities
  const activities: Activity[] = [
    ...(recentUsers?.map(user => ({
      type: 'user' as const,
      id: user.id,
      title: user.email, // Using email since name is not available
      subtitle: 'New user',
      timestamp: user.created_at,
    })) ?? []),
    ...(recentStars?.map(star => ({
      type: 'star' as const,
      id: star.id,
      title: star.full_name,
      subtitle: star.star_type,
      timestamp: star.created_at,
    })) ?? []),
    ...(recentNews?.map(article => ({
      type: 'news' as const,
      id: article.id,
      title: article.title,
      subtitle: article.status,
      timestamp: article.created_at,
    })) ?? []),
    ...(recentComments?.map(comment => ({
      type: 'comment' as const,
      id: comment.id,
      title: 'Comment',
      subtitle: comment.content,
      status: comment.status,
      timestamp: comment.created_at,
    })) ?? []),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit)

  return activities
}

// Users Management
export async function getUsers(page = 1, limit = 10, query = '') {
  const from = (page - 1) * limit
  const to = from + limit - 1

  let queryBuilder = supabase
    .from('users')
    .select('*', { count: 'exact' })

  if (query) {
    queryBuilder = queryBuilder.or(`name.ilike.%${query}%,email.ilike.%${query}%`)
  }

  const { data, error, count } = await queryBuilder
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw error
  return { data, count } as { data: TableRow<'users'>[], count: number }
}

export async function updateUserStatus(id: string, status: TableRow<'users'>['status']) {
  const { data, error } = await supabase
    .from('users')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as TableRow<'users'>
}

export async function updateUserRole(id: string, role: TableRow<'users'>['role']) {
  const { data, error } = await supabase
    .from('users')
    .update({ role })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as TableRow<'users'>
}

// Content Moderation
export async function getPendingComments(page = 1, limit = 10) {
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await supabase
    .from('comments')
    .select('*, users(name, avatar_url)', { count: 'exact' })
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw error
  return { data, count } as { data: TableRow<'comments'>[], count: number }
}

export async function moderateComment(id: string, status: TableRow<'comments'>['status']) {
  const { data, error } = await supabase
    .from('comments')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as TableRow<'comments'>
}

// Content Stats
export async function getContentStats() {
  const { count: publishedNewsCount, error: newsError } = await supabase
    .from('news')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')

  const { count: pendingCommentsCount, error: commentsError } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  const { count: featuredStarsCount, error: starsError } = await supabase
    .from('stars')
    .select('*', { count: 'exact', head: true })
    .eq('is_featured', true)

  if (newsError) throw newsError
  if (commentsError) throw commentsError
  if (starsError) throw starsError

  return {
    publishedNews: publishedNewsCount ?? 0,
    pendingComments: pendingCommentsCount ?? 0,
    featuredStars: featuredStarsCount ?? 0
  }
} 