'use client';

import { useState, useMemo, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Navbar } from '@/components/Navbar';
import { BlogCard } from '@/components/BlogCard';
import { Sparkles, TrendingUp, Search, Tag as TagIcon, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Blog } from '@/app/lib/db';

export default function FeedPage() {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const supabase = createClient();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching blogs:', error);
      } else {
        setBlogs(data);
      }
      setIsLoading(false);
    };
    fetchBlogs();
  }, [supabase]);

  const filteredBlogs = useMemo(() => {
    if (!blogs) return [];
    return blogs.filter(blog => {
      const matchesSearch = blog.title.toLowerCase().includes(search.toLowerCase()) || 
                            blog.content.toLowerCase().includes(search.toLowerCase());
      const matchesTag = !selectedTag || (blog.tags && blog.tags.includes(selectedTag));
      return matchesSearch && matchesTag;
    });
  }, [blogs, search, selectedTag]);

  const allTags = useMemo(() => {
    if (!blogs) return [];
    const tags = new Set<string>();
    blogs.forEach(blog => {
      if (blog.tags) blog.tags.forEach((t: string) => tags.add(t));
    });
    return Array.from(tags).sort();
  }, [blogs]);

  return (
    <div className="min-h-screen bg-background transition-colors">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <header className="mb-12 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-widest">
              <Sparkles className="h-4 w-4" />
              Community Stream
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-none">
              Explore the <span className="text-primary">Latest Stories.</span>
            </h1>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search by title, content, or author..." 
                className="pl-12 h-14 bg-card focus:ring-2 focus:ring-primary/20 text-lg rounded-2xl transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge 
              variant={selectedTag === null ? "default" : "secondary"}
              className="cursor-pointer h-9 px-5 rounded-full text-sm font-bold transition-all hover:scale-105"
              onClick={() => setSelectedTag(null)}
            >
              All Topics
            </Badge>
            {allTags.map(tag => (
              <Badge 
                key={tag} 
                variant={selectedTag === tag ? "default" : "secondary"}
                className="cursor-pointer h-9 px-5 rounded-full gap-2 text-sm font-bold transition-all hover:scale-105"
                onClick={() => setSelectedTag(tag)}
              >
                <TagIcon className="h-3 w-3" />
                {tag}
              </Badge>
            ))}
          </div>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4 text-muted-foreground">
            <Loader2 className="h-12 w-12 animate-spin" />
            <p className="font-medium">Refreshing stream...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.length === 0 ? (
              <div className="col-span-full py-32 text-center space-y-4">
                <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                  <TrendingUp className="h-12 w-12" />
                </div>
                <h2 className="text-3xl font-black text-foreground">The stream is quiet...</h2>
                <p className="text-muted-foreground max-w-sm mx-auto">Try a different search term or check back later for new professional insights.</p>
              </div>
            ) : (
              filteredBlogs.map(blog => (
                <BlogCard 
                  key={blog.id} 
                  blog={blog} 
                  author={{ name: blog.author_name || 'Writer' }}
                  likeCount={0} 
                  commentCount={0} 
                />
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
