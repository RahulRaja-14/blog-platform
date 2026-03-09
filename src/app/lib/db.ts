/**
 * @fileOverview Data entity definitions for the PlatformStream blog platform.
 * These interfaces match the Supabase schema.
 */

export interface User {
  id: string;
  email: string;
  name: string;
  bio?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Blog {
  id: string;
  user_id: string;
  author_name?: string;
  title: string;
  slug: string;
  content: string;
  summary?: string | null;
  tags: string[];
  is_published: boolean;
  views: number;
  likes_count?: number;
  comments_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Like {
  id: string;
  user_id: string;
  blog_id: string;
  created_at: string;
}

export interface Comment {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  blog_id: string;
  content: string;
  created_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  blog_id: string;
  created_at: string;
}
