export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url?: string
          role: 'admin' | 'editor' | 'user'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Database['public']['Tables']['users']['Row'], 'id'>>
        Relationships: []
      }
      stars: {
        Row: {
          id: string
          full_name: string
          profile_image_url?: string
          star_type: 'actor' | 'actress'
          current_project?: string
          birth_date: string
          birth_place: string
          biography: string
          education: string
          cover_image_url?: string
          is_featured: boolean
          is_trending: boolean
          is_rising: boolean
          is_influential: boolean
          filmography?: {
            title: string
            role: string
            year: number
            streaming_on?: string
          }[]
          gallery_images?: string[]
          slug: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['stars']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Database['public']['Tables']['stars']['Row'], 'id'>>
        Relationships: []
      }
      news: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          excerpt: string
          cover_image: string
          author_id: string
          star_id?: string
          status: 'published' | 'draft' | 'archived'
          published_at?: string
          created_at: string
          updated_at: string
          users?: Pick<Database['public']['Tables']['users']['Row'], 'name' | 'avatar_url'>
        }
        Insert: Omit<Database['public']['Tables']['news']['Row'], 'id' | 'created_at' | 'updated_at' | 'users'>
        Update: Partial<Omit<Database['public']['Tables']['news']['Row'], 'id'>>
        Relationships: [
          {
            foreignKeyName: "news_author_id_fkey"
            columns: ["author_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_star_id_fkey"
            columns: ["star_id"]
            referencedRelation: "stars"
            referencedColumns: ["id"]
          }
        ]
      }
      comments: {
        Row: {
          id: string
          user_id: string
          target_type: 'star' | 'news'
          target_id: string
          content: string
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
          updated_at: string
          users?: Pick<Database['public']['Tables']['users']['Row'], 'name' | 'avatar_url'>
        }
        Insert: Omit<Database['public']['Tables']['comments']['Row'], 'id' | 'created_at' | 'updated_at' | 'users'>
        Update: Partial<Omit<Database['public']['Tables']['comments']['Row'], 'id'>>
        Relationships: [
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          star_id: string
          created_at: string
          stars?: Pick<Database['public']['Tables']['stars']['Row'], 'id' | 'full_name' | 'profile_image_url'>
        }
        Insert: Omit<Database['public']['Tables']['favorites']['Row'], 'id' | 'created_at' | 'stars'>
        Update: Partial<Omit<Database['public']['Tables']['favorites']['Row'], 'id'>>
        Relationships: [
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_star_id_fkey"
            columns: ["star_id"]
            referencedRelation: "stars"
            referencedColumns: ["id"]
          }
        ]
      }
      social_media: {
        Row: {
          id: string
          star_id: string
          platform: 'instagram' | 'twitter' | 'facebook' | 'tiktok'
          url: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['social_media']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Database['public']['Tables']['social_media']['Row'], 'id'>>
        Relationships: [
          {
            foreignKeyName: "social_media_star_id_fkey"
            columns: ["star_id"]
            referencedRelation: "stars"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper type to get a table's row type
export type TableRow<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Row']

// Helper type to get a table's insert type
export type TableInsert<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Insert']

// Helper type to get a table's update type
export type TableUpdate<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Update']