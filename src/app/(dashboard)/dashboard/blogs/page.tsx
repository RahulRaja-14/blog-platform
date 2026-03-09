'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, Edit3, Trash2, Globe, Lock, FileText, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Blog } from '@/app/lib/db';

export default function MyBlogsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: blogsData, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching blogs:', error);
        } else {
          setBlogs(blogsData);
        }
      } else {
        router.push('/login');
      }
      setIsLoading(false);
    };
    fetchData();
  }, [supabase, router]);

  async function handleDelete(blogId: string) {
    if (!user) return;
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    const { error } = await supabase.from('blogs').delete().match({ id: blogId, user_id: user.id });

    if (error) {
      console.error('Error deleting post:', error);
    } else {
      setBlogs(blogs.filter(b => b.id !== blogId));
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-foreground">My Blogs</h1>
          <p className="text-muted-foreground">Manage and publish your professional content.</p>
        </div>
        <Link href="/dashboard/blogs/new">
          <Button className="gap-2 shadow-lg shadow-primary/20">
            <PlusCircle className="h-4 w-4" />
            Write New Post
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {!blogs || blogs.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardContent className="py-20 flex flex-col items-center justify-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <FileText className="h-8 w-8" />
              </div>
              <div className="text-center">
                <p className="font-bold text-lg text-foreground">No blog posts yet</p>
                <p className="text-sm text-muted-foreground">Share your first story with the world.</p>
              </div>
              <Link href="/dashboard/blogs/new">
                <Button variant="outline">Get Started</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          blogs.map(blog => (
            <Card key={blog.id} className="transition-all overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center p-6 gap-6">
                  <div className="hidden sm:flex h-12 w-12 rounded-xl bg-muted items-center justify-center text-muted-foreground flex-shrink-0">
                    {blog.is_published ? <Globe className="h-6 w-6 text-primary" /> : <Lock className="h-6 w-6" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-black text-lg truncate leading-none text-foreground">{blog.title}</h3>
                      <Badge variant={blog.is_published ? "default" : "secondary"} className="text-[10px] h-5">
                        {blog.is_published ? "Live" : "Draft"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Created {new Date(blog.created_at).toLocaleDateString()}</span>
                      <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                      <span className="capitalize">{blog.slug}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/blogs/${blog.id}/edit`}>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Edit3 className="h-4 w-4" />
                        <span className="hidden md:inline">Edit</span>
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive hover:bg-destructive/5 hover:text-destructive"
                      onClick={() => handleDelete(blog.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
