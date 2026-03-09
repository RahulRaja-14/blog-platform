-- Run this entire script in your Supabase SQL Editor to finish setting up your database!

-- 1. Create or update the users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create or update the sessions table
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create or update the blogs table
CREATE TABLE IF NOT EXISTS public.blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  author_name TEXT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  tags TEXT[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create or update the likes table
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  blog_id UUID REFERENCES public.blogs(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, blog_id)
);

-- 5. Create or update the comments table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  blog_id UUID REFERENCES public.blogs(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create or update the bookmarks table
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  blog_id UUID REFERENCES public.blogs(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, blog_id)
);

-- Enable Row Level Security (RLS) on all tables (Assuming you want them publicly accessible for now during dev, or you can manage this in Supabase UI)
-- By default, allowing all for testing.
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read-access" ON public.blogs FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full-access to blogs" ON public.blogs FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read-access to comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full-access to comments" ON public.comments FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read-access to likes" ON public.likes FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full-access to likes" ON public.likes FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated full-access to users" ON public.users FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full-access to sessions" ON public.sessions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full-access to bookmarks" ON public.bookmarks FOR ALL USING (auth.role() = 'authenticated');
