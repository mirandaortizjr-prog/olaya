import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface PostsFeedProps {
  coupleId: string;
  userId: string;
}

export const PostsFeed = ({ coupleId, userId }: PostsFeedProps) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, [coupleId]);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('couple_id', coupleId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPosts(data);
    }
  };

  const createPost = async () => {
    if (!newPost.trim()) return;

    const { error } = await supabase.from('posts').insert({
      couple_id: coupleId,
      author_id: userId,
      content: newPost,
    });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to create post',
        variant: 'destructive',
      });
      return;
    }

    setNewPost('');
    fetchPosts();
  };

  const toggleLike = async (postId: string, likes: any[]) => {
    const hasLiked = likes.includes(userId);
    const updatedLikes = hasLiked
      ? likes.filter(id => id !== userId)
      : [...likes, userId];

    const { error } = await supabase
      .from('posts')
      .update({ likes: updatedLikes })
      .eq('id', postId);

    if (!error) {
      fetchPosts();
    }
  };

  return (
    <Card className="bg-gradient-to-br from-card to-card/50 border-primary/10 shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Heart className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold">The Love Wall</h3>
            <p className="text-sm text-muted-foreground font-normal">Share pics, moments, and messages</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Textarea
            placeholder="Share a moment, thought, or just say hi... 💕"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            rows={3}
            className="bg-background/50"
          />
          <Button onClick={createPost} size="icon" className="h-auto">
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Heart className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">Start sharing moments on your Love Wall</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {posts.map((post) => (
              <Card key={post.id} className="bg-background/50 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <p className="text-sm mb-3 whitespace-pre-wrap">{post.content}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{format(new Date(post.created_at), 'PPp')}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleLike(post.id, post.likes || [])}
                      className="gap-1 hover:scale-110 transition-transform"
                    >
                      <Heart
                        className={`h-4 w-4 transition-colors ${
                          (post.likes || []).includes(userId) ? 'fill-red-500 text-red-500' : ''
                        }`}
                      />
                      <span className="font-medium">{(post.likes || []).length}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
