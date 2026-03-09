'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import Link from 'next/link';
import { MessageSquare, Heart, Clock, ArrowRight, Trash2, Edit3, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
// import { useFirestore, useUser } from '@/firebase';
// import { doc } from 'firebase/firestore';
// import { deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export function BlogCard({ blog, author, likeCount, commentCount }: any) {
  const [deleting, setDeleting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase]);

  const isOwner = user?.id === blog.user_id;

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) return;
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    setDeleting(true);
    
    const { error } = await supabase.from('blogs').delete().match({ id: blog.id });

    if (error) {
      console.error('Error deleting post:', error);
    }
    setDeleting(false);
  }

  return (
    <Card className="group overflow-hidden border-none shadow-md transition-all hover:shadow-xl hover:-translate-y-1 bg-white relative">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="bg-accent/10 text-accent-foreground font-medium">
            {blog.isPublished ? 'Published' : 'Draft'}
          </Badge>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {blog.created_at ? `${formatDistanceToNow(new Date(blog.created_at))} ago` : 'just now'}
            </span>
            {isOwner && (
              <div className="flex items-center gap-1 z-10">
                <Link href={`/dashboard/blogs/${blog.id}/edit`}>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Edit3 className="h-3 w-3" />
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 text-destructive hover:bg-destructive/10" 
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                </Button>
              </div>
            )}
          </div>
        </div>
        <Link href={`/blogs/${blog.slug}`}>
          <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {blog.title}
          </CardTitle>
        </Link>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {blog.summary || blog.content.substring(0, 150) + '...'}
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-4 border-t border-slate-50">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
            {author?.name?.charAt(0) || 'W'}
          </div>
          <div>
            <p className="text-xs font-semibold">{author?.name || 'Writer'}</p>
            <div className="flex items-center gap-4 mt-1">
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Heart className="h-3 w-3 fill-destructive text-destructive" />
                {likeCount || 0}
              </span>
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <MessageSquare className="h-3 w-3" />
                {commentCount || 0}
              </span>
            </div>
          </div>
        </div>
        <Link href={`/blogs/${blog.slug}`}>
          <Button variant="ghost" size="sm" className="group/btn text-xs gap-1">
            Read More
            <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
