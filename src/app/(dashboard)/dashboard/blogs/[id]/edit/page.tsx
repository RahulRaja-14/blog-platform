'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { revalidateDashboardAction } from '@/app/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Save, ChevronLeft, Loader2, Sparkles, Trash2 } from 'lucide-react';
import Link from 'next/link';
import type { Blog } from '@/app/lib/db';

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<any>(null);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [blogLoading, setBlogLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: blogData, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching blog:', error);
          setBlog(null);
        } else {
          setBlog(blogData);
          setIsPublished(blogData.is_published);
        }
      } else {
        router.push('/login');
      }
      setBlogLoading(false);
    };
    fetchBlog();
  }, [id, supabase, router]);

  async function handleDelete() {
    if (!user) return;
    if (!confirm('Are you sure you want to delete this post?')) return;
    setDeleting(true);

    const { error } = await supabase.from('blogs').delete().match({ id: id, user_id: user.id });

    if (error) {
      console.error('Error deleting post:', error);
      setDeleting(false);
    } else {
      await revalidateDashboardAction();
      router.push('/dashboard/blogs');
    }
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user || !blog) return;

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;

    const updateData = {
      title,
      content,
      is_published: isPublished,
      updated_at: new Date().toISOString()
    };

    try {
      const { error } = await supabase
        .from('blogs')
        .update(updateData)
        .match({ id: id, user_id: user.id });

      if (error) throw error;

      await revalidateDashboardAction();
      router.push('/dashboard/blogs');
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  if (blogLoading) return <div className="p-8 text-center animate-pulse text-muted-foreground">Loading content...</div>;
  if (!blog) return <div className="p-8 text-center text-muted-foreground">Blog post not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between gap-4">
        <Link href="/dashboard/blogs">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
            <ChevronLeft className="h-4 w-4" />
            My Blogs
          </Button>
        </Link>
        <Button variant="destructive" size="sm" className="gap-2" onClick={handleDelete} disabled={deleting}>
          {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          Delete Post
        </Button>
      </div>

      <form onSubmit={handleUpdate}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Post Title</Label>
                  <Input id="title" name="title" defaultValue={blog.title} className="text-xl font-bold h-14" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Content</Label>
                  <Textarea id="content" name="content" defaultValue={blog.content} className="min-h-[400px]" required />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="text-lg font-black flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-3 rounded-xl bg-primary-foreground/10">
                  <Label className="text-sm font-bold">Published</Label>
                  <Switch checked={isPublished} onCheckedChange={setIsPublished} />
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-black h-12">
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                  <span className="ml-2">Update Changes</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
