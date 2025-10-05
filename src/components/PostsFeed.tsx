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
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          Posts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Textarea
            placeholder="Share something with your partner..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            rows={3}
          />
          <Button onClick={createPost} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4 max-h-[500px] overflow-y-auto">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-4">
                <p className="text-sm mb-3">{post.content}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{format(new Date(post.created_at), 'PPp')}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleLike(post.id, post.likes || [])}
                    className="gap-1"
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        (post.likes || []).includes(userId) ? 'fill-red-500 text-red-500' : ''
                      }`}
                    />
                    {(post.likes || []).length}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
