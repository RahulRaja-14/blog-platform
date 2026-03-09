'use client';

import { use, useEffect, useState } from 'react';
import { useRouter, notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Navbar } from '@/components/Navbar';
import { format } from 'date-fns';
import { ArrowLeft, Share2, Clock, Trash2, Edit3, Eye, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CommentSection } from '@/components/CommentSection';
import { LikeAction } from '@/components/LikeAction';
import type { Blog } from '@/app/lib/db';

export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const supabase = createClient();
  
  const [blog, setBlog] = useState<Blog | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [blogLoading, setBlogLoading] = useState(true);
  const [hasIncremented, setHasIncremented] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      setBlogLoading(true);

      const { data: blogData, error: blogError } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (blogError || !blogData) {
        console.error('Error fetching blog:', blogError);
        setBlogLoading(false);
        notFound();
        return;
      }

      setBlog(blogData);

      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);

      if (!hasIncremented) {
        const { error: updateError } = await supabase
          .from('blogs')
          .update({ views: (blogData.views || 0) + 1 })
          .eq('id', blogData.id);

        if (updateError) {
          console.error('Error incrementing view count:', updateError);
        } else {
          setHasIncremented(true);
        }
      }
      
      setBlogLoading(false);
    };

    fetchBlog();
  }, [slug, supabase, hasIncremented]);

  async function handleDelete() {
    if (!blog || !currentUser || currentUser.id !== blog.user_id) return;
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    const { error } = await supabase.from('blogs').delete().match({ id: blog.id });
    if (error) {
      console.error('Error deleting post:', error);
    } else {
      router.push('/feed');
    }
  }

  if (blogLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!blog) {
    return notFound();
  }

  const isOwner = currentUser?.id === blog.user_id;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <article className="pb-24">
        <header className="bg-muted/30 py-20 mb-12 border-b">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="flex items-center justify-between mb-8">
              <Link href="/feed" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group">
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Feed
              </Link>
              {isOwner && (
                <div className="flex items-center gap-2">
                  <Link href={`/dashboard/blogs/${blog.id}/edit`}>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Edit3 className="h-4 w-4" />
                      Edit
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-destructive hover:bg-destructive/5 hover:text-destructive gap-2"
                    onClick={handleDelete}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-black text-foreground leading-[1.1] tracking-tight">
                {blog.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 pt-4 border-t">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                    {blog.author_name?.charAt(0) || 'W'}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground">{blog.author_name || 'Writer'}</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(blog.created_at), 'MMMM d, yyyy')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-muted-foreground ml-auto">
                  <span className="flex items-center gap-1 text-sm">
                    <Eye className="h-4 w-4" />
                    {blog.views || 0} views
                  </span>
                  <span className="flex items-center gap-1 text-sm">
                    <Clock className="h-4 w-4" />
                    {Math.ceil(blog.content.split(' ').length / 200)} min read
                  </span>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 max-w-4xl">
          {blog.summary && (
            <div className="p-6 rounded-2xl bg-accent/5 border border-accent/20 mb-12">
              <p className="text-xs font-black uppercase tracking-widest text-accent-foreground mb-3">AI Summary</p>
              <p className="text-lg leading-relaxed text-foreground/80 italic">
                {blog.summary}
              </p>
            </div>
          )}

          <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/70 leading-relaxed space-y-6 text-lg whitespace-pre-wrap">
            {blog.content}
          </div>

          <div className="mt-20 pt-12 border-t flex items-center justify-between">
            <LikeAction blogId={blog.id} />
            
            <div className="flex items-center gap-4">
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Tags</p>
              <div className="flex gap-2">
                {blog.tags?.map(tag => (
                  <span key={tag} className="text-xs font-bold px-3 py-1 rounded-full bg-muted text-muted-foreground">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-24">
            <CommentSection blogId={blog.id} user={currentUser} />
          </div>
        </div>
      </article>
    </div>
  );
}
