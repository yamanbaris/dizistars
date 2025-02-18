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
      comments: {
        Row: {
          id: string
          user_id: string
          star_id: string
          content: string
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          star_id: string
          content: string
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          star_id?: string
          content?: string
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_star_id_fkey"
            columns: ["star_id"]
            referencedRelation: "stars"
            referencedColumns: ["id"]
          },
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
        }
        Insert: {
          id?: string
          user_id: string
          star_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          star_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_star_id_fkey"
            columns: ["star_id"]
            referencedRelation: "stars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      news: {
        Row: {
          id: string
          title: string
          content: string
          excerpt: string
          slug: string
          cover_image: string
          author_id: string
          status: 'draft' | 'published' | 'archived'
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          excerpt: string
          slug: string
          cover_image: string
          author_id: string
          status?: 'draft' | 'published' | 'archived'
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          excerpt?: string
          slug?: string
          cover_image?: string
          author_id?: string
          status?: 'draft' | 'published' | 'archived'
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "news_author_id_fkey"
            columns: ["author_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      stars: {
        Row: {
          id: string
          full_name: string
          star_type: string
          birth_date: string | null
          birth_place: string | null
          education: string | null
          current_project: string | null
          biography: string | null
          profile_image_url: string
          cover_image_url: string | null
          is_featured: boolean
          is_trending: boolean
          is_rising: boolean
          is_influential: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          star_type: string
          birth_date?: string | null
          birth_place?: string | null
          education?: string | null
          current_project?: string | null
          biography?: string | null
          profile_image_url: string
          cover_image_url?: string | null
          is_featured?: boolean
          is_trending?: boolean
          is_rising?: boolean
          is_influential?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          star_type?: string
          birth_date?: string | null
          birth_place?: string | null
          education?: string | null
          current_project?: string | null
          biography?: string | null
          profile_image_url?: string
          cover_image_url?: string | null
          is_featured?: boolean
          is_trending?: boolean
          is_rising?: boolean
          is_influential?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          id: string
          name: string
          email: string
          avatar_url: string | null
          role: 'user' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          avatar_url?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          avatar_url?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
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

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]
export type TableRow<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'] & {
  users?: Pick<Tables<'users'>['Row'], 'id' | 'name' | 'avatar_url'> | undefined
  stars?: Pick<Tables<'stars'>['Row'], 'id' | 'full_name' | 'profile_image_url'> | undefined
}

// Helper type to get a table's insert type
export type TableInsert<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Insert']

// Helper type to get a table's update type
export type TableUpdate<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Update']