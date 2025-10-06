import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Heart, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format, formatDistanceToNow } from 'date-fns';

interface Post {
  id: string;
  content: string;
  created_at: string;
  author_id: string;
  likes: string[];
  author_name?: string;
}

interface PostsFeedProps {
  coupleId: string;
  userId: string;
}

export const PostsFeed = ({ coupleId, userId }: PostsFeedProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [currentUserName, setCurrentUserName] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
    fetchCurrentUserName();
  }, [coupleId, userId]);

  const fetchCurrentUserName = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', userId)
      .single();
    
    if (data?.full_name) {
      setCurrentUserName(data.full_name);
    }
  };

  const fetchPosts = async () => {
    const { data: postsData, error } = await supabase
      .from('posts')
      .select('*')
      .eq('couple_id', coupleId)
      .order('created_at', { ascending: false });

    if (!error && postsData) {
      // Fetch author names for all posts
      const authorIds = [...new Set(postsData.map(p => p.author_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', authorIds);

      const postsWithAuthors: Post[] = postsData.map(post => ({
        id: post.id,
        content: post.content,
        created_at: post.created_at,
        author_id: post.author_id,
        likes: Array.isArray(post.likes) ? post.likes.filter((item): item is string => typeof item === 'string') : [],
        author_name: profiles?.find(p => p.id === post.author_id)?.full_name || 'Unknown'
      }));

      setPosts(postsWithAuthors);
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
      <CardHeader className="border-b border-border/50">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Heart className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold">The Love Wall</h3>
            <p className="text-sm text-muted-foreground font-normal">Share your moments together</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Create Post Section */}
        <div className="flex gap-3">
          <Avatar className="h-10 w-10 border-2 border-primary/20">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {currentUserName.charAt(0) || 'Y'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 flex gap-2">
            <Textarea
              placeholder="Share a moment, thought, or just say hi... 💕"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              rows={3}
              className="resize-none bg-background/50 border-border/50 focus:border-primary/50"
            />
            <Button onClick={createPost} size="icon" className="h-auto shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Posts Feed */}
        {posts.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Heart className="w-16 h-16 mx-auto mb-4 opacity-10" />
            <p className="text-lg font-medium mb-2">Your Love Wall is empty</p>
            <p className="text-sm">Start sharing moments with your partner</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 -mr-2">
            {posts.map((post) => (
              <Card key={post.id} className="bg-background/30 border-border/50 hover:bg-background/50 transition-all">
                <CardContent className="p-4">
                  {/* Post Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {post.author_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">
                        {post.author_id === userId ? 'You' : post.author_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>

                  {/* Post Content */}
                  <p className="text-sm whitespace-pre-wrap mb-4 leading-relaxed">
                    {post.content}
                  </p>

                  {/* Post Actions */}
                  <div className="flex items-center gap-4 pt-2 border-t border-border/30">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleLike(post.id, post.likes || [])}
                      className="gap-2 hover:bg-primary/5 transition-all"
                    >
                      <Heart
                        className={`h-4 w-4 transition-all ${
                          (post.likes || []).includes(userId) 
                            ? 'fill-red-500 text-red-500 scale-110' 
                            : 'text-muted-foreground'
                        }`}
                      />
                      <span className={`text-xs font-medium ${
                        (post.likes || []).includes(userId) ? 'text-red-500' : 'text-muted-foreground'
                      }`}>
                        {(post.likes || []).length > 0 ? (post.likes || []).length : 'Like'}
                      </span>
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
