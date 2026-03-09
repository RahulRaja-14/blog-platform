'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
// import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
// import { collection, query, orderBy, doc } from 'firebase/firestore';
// import { addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { formatDistanceToNow } from 'date-fns';
import { Loader2, Send, Trash2, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import type { Comment } from '@/app/lib/db';

export function CommentSection({ blogId, user }: { blogId: string; user: any }) {
  const [content, setContent] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('blog_id', blogId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching comments:', error);
      } else {
        setComments(data);
      }
      setIsLoading(false);
    };
    fetchComments();
  }, [blogId, supabase]);

  async function handleSubmit() {
    if (!content.trim() || !user) return;

    const { data: newComment, error } = await supabase
      .from('comments')
      .insert([
        {
          blog_id: blogId,
          user_id: user.id,
          user_name: user.user_metadata.name || user.email.split('@')[0],
          content: content.trim(),
        },
      ])
      .select();

    if (error) {
      console.error('Error posting comment:', error);
    } else if (newComment) {
      setComments([newComment[0], ...comments]);
      setContent('');
    }
  }

  async function handleDelete(commentId: string) {
    if (!user) return;
    if (!confirm('Are you sure you want to delete this comment?')) return;
    
    const { error } = await supabase.from('comments').delete().match({ id: commentId });

    if (error) {
      console.error('Error deleting comment:', error);
    } else {
      setComments(comments.filter(c => c.id !== commentId));
    }
  }

  return (
    <div className="space-y-12">
      <div className="flex items-center gap-3">
        <MessageSquare className="h-6 w-6 text-accent" />
        <h2 className="text-3xl font-black text-slate-900">Conversations</h2>
      </div>

      {user ? (
        <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-xs">
              {(user.user_metadata.name || user.email).charAt(0).toUpperCase()}
            </div>
            <p className="font-bold text-sm">Join the discussion as {user.user_metadata.name || user.email.split('@')[0]}</p>
          </div>
          <Textarea 
            placeholder="What are your thoughts?" 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px] bg-white border-slate-200 shadow-none resize-none focus:ring-accent"
          />
          <div className="flex justify-end">
            <Button 
              onClick={handleSubmit} 
              disabled={!content.trim()} 
              className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90 px-8"
            >
              <Send className="h-4 w-4" />
              Post Comment
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50">
          <p className="text-slate-600 mb-6 font-medium">Please sign in to join the conversation.</p>
          <Button asChild variant="outline" className="px-12">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      )}

      <div className="space-y-8">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
          </div>
        ) : comments?.length === 0 ? (
          <p className="text-center text-slate-400 italic">No comments yet. Be the first to start the conversation!</p>
        ) : (
          comments?.map((comment) => (
            <div key={comment.id} className="flex gap-4 animate-in fade-in slide-in-from-top-2 duration-300 group">
              <div className="h-10 w-10 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center text-slate-500 font-bold uppercase">
                {comment.user_name.charAt(0)}
              </div>
              <div className="flex-1 space-y-1.5 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <p className="font-black text-sm text-slate-900">{comment.user_name}</p>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      {formatDistanceToNow(new Date(comment.created_at))} ago
                    </span>
                  </div>
                  {user?.id === comment.user_id && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-slate-300 hover:text-destructive hover:bg-destructive/5 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDelete(comment.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <div className="bg-slate-50 p-4 rounded-xl rounded-tl-none border border-slate-100">
                  <p className="text-slate-700 leading-relaxed">{comment.content}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
