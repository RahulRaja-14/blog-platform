'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
// import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
// import { collection, doc, query, where } from 'firebase/firestore';
// import { setDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Button } from './ui/button';
import { Heart, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export function LikeAction({ blogId }: { blogId: string }) {
  const [user, setUser] = useState<any>(null);
  const [likesCount, setLikesCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase]);

  useEffect(() => {
    const fetchLikes = async () => {
      const { data, error, count } = await supabase
        .from('likes')
        .select('* ', { count: 'exact' })
        .eq('blog_id', blogId);

      if (error) {
        console.error('Error fetching likes:', error);
      } else {
        setLikesCount(count || 0);
        if (user) {
          setHasLiked(data.some(like => like.user_id === user.id));
        }
      }
    };
    fetchLikes();
  }, [blogId, user, supabase]);

  useEffect(() => {
    const channel = supabase
      .channel(`likes:${blogId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'likes', filter: `blog_id=eq.${blogId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setLikesCount(current => current + 1);
          }
          if (payload.eventType === 'DELETE') {
            setLikesCount(current => current - 1);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, blogId]);

  async function handleLike() {
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (loading) return;
    
    setLoading(true);

    if (hasLiked) {
      const { error } = await supabase.from('likes').delete().match({ blog_id: blogId, user_id: user.id });
      if (!error) setHasLiked(false);
    } else {
      const { error } = await supabase.from('likes').insert({ blog_id: blogId, user_id: user.id });
      if (!error) setHasLiked(true);
    }
    
    setLoading(false);
  }

  return (
    <Button 
      variant="outline" 
      className={cn(
        "rounded-full px-6 h-12 gap-3 transition-all",
        hasLiked ? "border-destructive/20 bg-destructive/5 text-destructive" : "hover:bg-slate-50"
      )}
      onClick={handleLike}
      disabled={loading}
    >
      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Heart className={cn("h-5 w-5", hasLiked && "fill-current")} />}
      <span className="font-bold">{likesCount} Likes</span>
    </Button>
  );
}
