'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Heart, TrendingUp, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Blog } from '@/app/lib/db';

export default function DashboardPage() {
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
          console.error('Error fetching blogs - message:', error.message, 'code:', error.code, 'full error:', error);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted" />
      </div>
    );
  }

  if (!user) return null;

  const totalPosts = blogs?.length || 0;
  const totalViews = blogs?.reduce((acc, b) => acc + (b.views || 0), 0) || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-foreground">Welcome back, {user.user_metadata?.name || 'Creator'}</h1>
          <p className="text-muted-foreground">Monitor your content performance and audience growth.</p>
        </div>
        <Link href="/dashboard/blogs/new">
          <Button className="gap-2 shadow-lg shadow-primary/20">
            <Sparkles className="h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{isLoading ? '...' : totalPosts}</div>
            <p className="text-xs text-muted-foreground mt-1">Shared with the world</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Views</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{isLoading ? '...' : totalViews}</div>
            <p className="text-xs text-muted-foreground mt-1">Reader interactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Bookmarks</CardTitle>
            <Heart className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">--</div>
            <p className="text-xs text-muted-foreground mt-1">Saved for later</p>
          </CardContent>
        </Card>
        <Card className="bg-primary text-primary-foreground">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium opacity-80 uppercase tracking-wider">Avg. Engagement</CardTitle>
            <TrendingUp className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">
              {isLoading ? '...' : (totalPosts > 0 ? (totalViews / totalPosts).toFixed(1) : 0)}
            </div>
            <p className="text-xs opacity-80 mt-1">Views per post</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-black">Recent Stories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted" />
              </div>
            ) : !blogs || blogs.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <p className="text-muted-foreground italic">You haven't published anything yet.</p>
                <Link href="/dashboard/blogs/new">
                  <Button size="sm">Capture Your First Idea</Button>
                </Link>
              </div>
            ) : (
              blogs.slice(0, 5).map(blog => (
                <div key={blog.id} className="flex items-center justify-between p-4 rounded-xl border hover:bg-muted/50 transition-colors group">
                  <div className="space-y-1">
                    <p className="font-bold text-sm truncate max-w-[200px]">{blog.title}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {blog.is_published ? 'Live' : 'Draft'} • {new Date(blog.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Link href={`/dashboard/blogs/${blog.id}/edit`}>
                    <Button variant="ghost" size="sm" className="gap-2 group-hover:text-primary">
                      Edit
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-black">Creator Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
              <p className="text-xs font-bold text-accent-foreground uppercase tracking-wider mb-1">AI Optimized</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Your posts with AI summaries see higher engagement. Keep publishing to improve the model!
              </p>
            </div>
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
              <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Coming Soon</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Advanced newsletter integration is in beta. Soon you can email your followers directly.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
