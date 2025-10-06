import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Heart, Send, Image as ImageIcon, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format, formatDistanceToNow } from 'date-fns';

interface Post {
  id: string;
  content: string;
  created_at: string;
  author_id: string;
  likes: string[];
  media_urls?: string[];
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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
        media_urls: Array.isArray(post.media_urls) ? post.media_urls.filter((item): item is string => typeof item === 'string') : [],
        author_name: profiles?.find(p => p.id === post.author_id)?.full_name || 'Unknown'
      }));

      setPosts(postsWithAuthors);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validFiles = files.filter(file => {
        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');
        const isUnder10MB = file.size <= 10 * 1024 * 1024;
        
        if (!isImage && !isVideo) {
          toast({
            title: 'Invalid file type',
            description: 'Only images and videos are allowed',
            variant: 'destructive',
          });
          return false;
        }
        
        if (!isUnder10MB) {
          toast({
            title: 'File too large',
            description: 'Files must be under 10MB',
            variant: 'destructive',
          });
          return false;
        }
        
        return true;
      });
      
      setSelectedFiles(prev => [...prev, ...validFiles].slice(0, 5)); // Max 5 files
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async (): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    
    for (const file of selectedFiles) {
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('couple_media')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast({
          title: 'Upload failed',
          description: `Failed to upload ${file.name}`,
          variant: 'destructive',
        });
        continue;
      }

      // Create signed URL for immediate display (7 days)
      const { data: signedData } = await supabase.storage
        .from('couple_media')
        .createSignedUrl(filePath, 60 * 60 * 24 * 7);

      if (signedData?.signedUrl) {
        uploadedUrls.push(signedData.signedUrl);
      }
    }
    
    return uploadedUrls;
  };

  const createPost = async () => {
    if (!newPost.trim() && selectedFiles.length === 0) return;

    setUploading(true);
    
    try {
      const mediaUrls = selectedFiles.length > 0 ? await uploadFiles() : [];

      const { error } = await supabase.from('posts').insert({
        couple_id: coupleId,
        author_id: userId,
        content: newPost,
        media_urls: mediaUrls.length > 0 ? mediaUrls : null,
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
      setSelectedFiles([]);
      fetchPosts();
      
      toast({
        title: 'Success',
        description: 'Post created successfully',
      });
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: 'Error',
        description: 'Failed to create post',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
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
        <div className="space-y-3">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {currentUserName.charAt(0) || 'Y'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Textarea
                placeholder="Share a moment, thought, or just say hi... 💕"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                rows={3}
                className="resize-none bg-background/50 border-border/50 focus:border-primary/50"
              />
              
              {/* Selected Files Preview */}
              {selectedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted">
                        {file.type.startsWith('image/') ? (
                          <img 
                            src={URL.createObjectURL(file)} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                            Video
                          </div>
                        )}
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || selectedFiles.length >= 5}
                  className="gap-2"
                >
                  <ImageIcon className="h-4 w-4" />
                  Add Media
                </Button>
                <Button 
                  onClick={createPost} 
                  size="sm" 
                  disabled={uploading || (!newPost.trim() && selectedFiles.length === 0)}
                  className="gap-2 ml-auto"
                >
                  {uploading ? 'Posting...' : 'Post'}
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
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
                  {post.content && (
                    <p className="text-sm whitespace-pre-wrap mb-3 leading-relaxed">
                      {post.content}
                    </p>
                  )}

                  {/* Post Media */}
                  {post.media_urls && post.media_urls.length > 0 && (
                    <div className={`grid gap-2 mb-3 ${
                      post.media_urls.length === 1 ? 'grid-cols-1' : 
                      post.media_urls.length === 2 ? 'grid-cols-2' : 
                      'grid-cols-2'
                    }`}>
                      {post.media_urls.map((url, index) => {
                        const isVideo = url.includes('.mp4') || url.includes('.mov') || url.includes('.webm');
                        return (
                          <div 
                            key={index} 
                            className={`rounded-lg overflow-hidden ${
                              post.media_urls!.length === 1 ? 'max-h-96' : 'h-48'
                            }`}
                          >
                            {isVideo ? (
                              <video 
                                src={url} 
                                controls 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <img 
                                src={url} 
                                alt="Post media" 
                                className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                                onClick={() => window.open(url, '_blank')}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

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
