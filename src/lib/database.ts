import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/types/supabase'
import type { 
  TableRow, 
  TableInsert, 
  TableUpdate 
} from '@/types/supabase'

// Custom types that extend our database types
export interface StarWithDetails extends TableRow<'stars'> {}

export interface NewsWithAuthor extends TableRow<'news'> {
  author?: Pick<TableRow<'users'>, 'name' | 'avatar_url'>;
}

export interface CommentWithUser extends TableRow<'comments'> {
  user?: Pick<TableRow<'users'>, 'name' | 'avatar_url'>;
}

export interface FavoriteWithStar extends TableRow<'favorites'> {
  star?: Pick<TableRow<'stars'>, 'id' | 'full_name' | 'profile_image_url'>;
}

// News functions
export const newsApi = {
  getList: async (page: number, pageSize: number) => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    const { data, error, count } = await supabase
      .from('news')
      .select('*, users!news_author_id_fkey(name, avatar_url)', { count: 'exact' })
      .range(start, end)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: data as NewsWithAuthor[], count: count || 0 };
  },

  create: async (news: TableInsert<'news'>) => {
    const { data, error } = await supabase
      .from('news')
      .insert([news])
      .select('*, users!news_author_id_fkey(name, avatar_url)')
      .single();

    if (error) throw error;
    return data as NewsWithAuthor;
  },

  update: async (id: string, news: TableUpdate<'news'>) => {
    const { data, error } = await supabase
      .from('news')
      .update(news)
      .eq('id', id)
      .select('*, users!news_author_id_fkey(name, avatar_url)')
      .single();

    if (error) throw error;
    return data as NewsWithAuthor;
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  getByStarId: async (starId: string, limit = 4) => {
    const { data, error } = await supabase
      .from('news')
      .select('*, users!news_author_id_fkey(name, avatar_url)')
      .eq('star_id', starId)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as NewsWithAuthor[];
  }
};

// Stars functions
export const starsApi = {
  getList: async (page = 1, pageSize = 10) => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    const { data, error, count } = await supabase
      .from('stars')
      .select('*', { count: 'exact' })
      .range(start, end)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: data as StarWithDetails[], count: count || 0 };
  },

  getById: async (id: string) => {
    const { data: star, error: starError } = await supabase
      .from('stars')
      .select('*')
      .eq('id', id)
      .single();

    if (starError) throw starError;
    return star as StarWithDetails;
  },

  create: async (star: TableInsert<'stars'>) => {
    const { data, error } = await supabase
      .from('stars')
      .insert([star])
      .select()
      .single();

    if (error) throw error;
    return data as StarWithDetails;
  },

  update: async (id: string, star: TableUpdate<'stars'>) => {
    const { data, error } = await supabase
      .from('stars')
      .update(star)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as StarWithDetails;
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('stars')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Featured, Trending, Rising, and Influential stars
  getFeatured: async (limit = 3) => {
    const { data, error } = await supabase
      .from('stars')
      .select('*')
      .eq('is_featured', true)
      .limit(limit);

    if (error) throw error;
    return data as StarWithDetails[];
  },

  getTrending: async (limit = 8) => {
    const { data, error } = await supabase
      .from('stars')
      .select('*')
      .eq('is_trending', true)
      .order('total_ratings', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as StarWithDetails[];
  }
};

// Comments functions
export const commentsApi = {
  getList: async (options: {
    targetType?: 'star' | 'news';
    targetId?: string;
    page?: number;
    pageSize?: number;
    status?: 'pending' | 'approved' | 'rejected';
  }) => {
    const { targetType, targetId, page = 1, pageSize = 10, status } = options;
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    let query = supabase
      .from('comments')
      .select('*, users!comments_user_id_fkey(name, avatar_url)', { count: 'exact' })
      .range(start, end)
      .order('created_at', { ascending: false });

    if (targetType) query = query.eq('target_type', targetType);
    if (targetId) query = query.eq('target_id', targetId);
    if (status) query = query.eq('status', status);

    const { data, error, count } = await query;

    if (error) throw error;
    return { data: data as CommentWithUser[], count: count || 0 };
  },

  getByUser: async (userId: string, page = 1, pageSize = 10) => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    const { data, error, count } = await supabase
      .from('comments')
      .select('*, users!comments_user_id_fkey(name, avatar_url)', { count: 'exact' })
      .eq('user_id', userId)
      .range(start, end)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: data as CommentWithUser[], count: count || 0 };
  },

  create: async (comment: TableInsert<'comments'>) => {
    const { data, error } = await supabase
      .from('comments')
      .insert([comment])
      .select('*, users!comments_user_id_fkey(name, avatar_url)')
      .single();

    if (error) throw error;
    return data as CommentWithUser;
  },

  update: async (id: string, update: TableUpdate<'comments'>) => {
    const { data, error } = await supabase
      .from('comments')
      .update(update)
      .eq('id', id)
      .select('*, users!comments_user_id_fkey(name, avatar_url)')
      .single();

    if (error) throw error;
    return data as CommentWithUser;
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Favorites functions
export const favoritesApi = {
  getByUser: async (userId: string): Promise<FavoriteWithStar[]> => {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        *,
        stars!favorites_star_id_fkey(
          id,
          full_name,
          profile_image_url
        )
      `)
      .eq('user_id', userId);

    if (error) throw error;
    return data as FavoriteWithStar[];
  },

  add: async (userId: string, starId: string) => {
    const { data, error } = await supabase
      .from('favorites')
      .insert([{ user_id: userId, star_id: starId }])
      .select(`
        *,
        stars!favorites_star_id_fkey(
          id,
          full_name,
          profile_image_url
        )
      `)
      .single();

    if (error) throw error;
    return data as FavoriteWithStar;
  },

  remove: async (userId: string, starId: string) => {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('star_id', starId);

    if (error) throw error;
  },

  exists: async (userId: string, starId: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('star_id', starId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
    return !!data;
  }
};

// Social Media functions
export const socialMediaApi = {
  getByStar: async (starId: string) => {
    const { data, error } = await supabase
      .from('social_media')
      .select('*')
      .eq('star_id', starId);

    if (error) throw error;
    return data;
  },

  upsert: async (starId: string, platforms: Array<{
    platform: TableRow<'social_media'>['platform'];
    url: string;
  }>) => {
    const { data, error } = await supabase
      .from('social_media')
      .upsert(
        platforms.map(p => ({
          star_id: starId,
          platform: p.platform,
          url: p.url
        })),
        { onConflict: 'star_id,platform' }
      )
      .select();

    if (error) throw error;
    return data;
  }
};

// Export all APIs
export const db = {
  news: newsApi,
  stars: starsApi,
  comments: commentsApi,
  favorites: favoritesApi,
  socialMedia: socialMediaApi
};

// Landing page functions
export const getFeaturedStars = async () => {
  const { data, error } = await supabase
    .from('stars')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching featured stars:', error)
    return null
  }

  return data
}

export const getTrendingStars = async () => {
  const { data, error } = await supabase
    .from('stars')
    .select('*')
    .eq('is_trending', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching trending stars:', error)
    return null
  }

  return data
}

export const getRisingStars = async () => {
  const { data, error } = await supabase
    .from('stars')
    .select('*')
    .eq('is_rising', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching rising stars:', error)
    return null
  }

  return data
}

export const getInfluentialStars = async () => {
  const { data, error } = await supabase
    .from('stars')
    .select('*')
    .eq('is_influential', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching influential stars:', error)
    return null
  }

  return data
}

export async function getLatestNews(limit = 6) {
  try {
    const { data, error } = await supabase
      .from('news')
      .select(`
        id,
        title,
        excerpt,
        cover_image,
        published_at,
        status,
        created_at
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching latest news:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getLatestNews:', error);
    return [];
  }
}

// Star details function
export async function getStarDetails(starId: string): Promise<TableRow<'stars'> | null> {
  const { data, error } = await supabase
    .from('stars')
    .select('*')
    .eq('id', starId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }

  return data;
}

// Get news related to a specific star
export const getStarNews = async (star_id: string) => {
  try {
    // Ensure star_id is a valid UUID format
    if (!star_id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      throw new Error('Invalid star ID format');
    }

    const { data, error } = await supabase
      .from('news')
      .select(`
        *,
        users!news_author_id_fkey (
          name,
          avatar_url
        )
      `)
      .eq('star_id', star_id)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(4);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching star news:', error);
    return [];
  }
};

// Direct function exports
export const {
  getById: getStar,
  create: createStar,
  update: updateStar,
  delete: deleteStar,
  getList: getStars
} = starsApi;

export const {
  getList: getNews,
  create: createNews,
  update: updateNews,
  delete: deleteNews
} = newsApi;

export const {
  getList: getComments,
  create: createComment,
  update: updateComment,
  delete: deleteComment
} = commentsApi;

export const {
  getByUser: getFavorites,
  add: addFavorite,
  remove: removeFavorite,
  exists: favoriteExists
} = favoritesApi;