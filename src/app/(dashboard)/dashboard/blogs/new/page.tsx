'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { revalidateDashboardAction } from '@/app/lib/actions';
import { generateBlogSummary } from '@/ai/flows/generate-blog-summary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Save, ChevronLeft, Loader2, Sparkles, Globe } from 'lucide-react';
import Link from 'next/link';

export default function NewBlogPage() {
  const [isPublished, setIsPublished] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      } else {
        router.push('/login');
      }
    };
    fetchUser();
  }, [supabase, router]);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') || `post-${Date.now()}`;

    const blogData = {
      user_id: user.id,
      author_name: user.user_metadata?.name || 'Creator',
      title,
      content,
      slug,
      tags: [],
      is_published: isPublished,
      views: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase.from('blogs').insert([blogData]).select();

      if (error) throw error;

      if (isPublished && data) {
        const blogId = data[0].id;
        generateBlogSummary({ title, content }).then(async (res) => {
          await supabase.from('blogs').update({ summary: res.summary }).match({ id: blogId });
        }).catch(() => { });
      }

      await revalidateDashboardAction();
      router.push('/dashboard/blogs');
    } catch (err) {
      console.error('Error saving blog - message:', err.message, 'code:', err.code, 'details:', err.details, 'full err:', err);
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/blogs">
          <Button variant="ghost" size="sm" className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to List
          </Button>
        </Link>
      </div>

      <div className="space-y-1">
        <h1 className="text-3xl font-black text-foreground">Draft New Post</h1>
        <p className="text-muted-foreground">Capture your ideas and share them with your network.</p>
      </div>

      <form onSubmit={handleSave}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Post Title</Label>
                  <Input id="title" name="title" placeholder="Enter title..." className="text-xl font-bold h-14" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Content</Label>
                  <Textarea id="content" name="content" placeholder="Tell your story..." className="min-h-[400px]" required />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="text-lg font-black flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Publishing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-3 rounded-xl bg-primary-foreground/10">
                  <Label className="text-sm font-bold">Publicly Live</Label>
                  <Switch checked={isPublished} onCheckedChange={setIsPublished} />
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-black h-12 shadow-xl shadow-black/10">
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (isPublished ? <Globe className="h-5 w-5" /> : <Save className="h-5 w-5" />)}
                  <span className="ml-2">{isPublished ? 'Publish Now' : 'Save Draft'}</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
