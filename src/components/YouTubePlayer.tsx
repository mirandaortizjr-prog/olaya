import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Play, Edit2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useVideoPlayer } from '@/contexts/VideoPlayerContext';

interface YouTubePlayerProps {
  coupleId: string;
  videoUrl?: string;
  onVideoUrlChange?: (url: string) => void;
}

export const YouTubePlayer = ({ coupleId, videoUrl, onVideoUrlChange }: YouTubePlayerProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newUrl, setNewUrl] = useState(videoUrl || '');
  const { toast } = useToast();
  const { setVideoUrl: setGlobalVideoUrl } = useVideoPlayer();

  const handlePlayVideo = () => {
    if (videoUrl) {
      setGlobalVideoUrl(videoUrl);
    }
  };

  const handleSaveUrl = async () => {
    if (!newUrl.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a valid URL',
        variant: 'destructive',
      });
      return;
    }

    onVideoUrlChange?.(newUrl);
    setIsEditing(false);
    toast({
      title: 'Success',
      description: 'Video URL updated',
    });
  };

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardContent className="p-4">
        {!videoUrl || videoUrl.trim() === '' ? (
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Edit2 className="w-4 h-4 mr-2" />
                Add Video URL
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add YouTube Video</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Paste YouTube URL here..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button onClick={handleSaveUrl} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <div className="space-y-3">
            <div 
              className="relative aspect-video rounded-lg overflow-hidden bg-muted cursor-pointer group"
              onClick={handlePlayVideo}
            >
              <img
                src={`https://img.youtube.com/vi/${extractVideoId(videoUrl)}/maxresdefault.jpg`}
                alt="Video thumbnail"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-red-600 group-hover:bg-red-700 flex items-center justify-center transition-colors">
                  <Play className="w-8 h-8 text-white ml-1" fill="white" />
                </div>
              </div>
            </div>
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                  <Edit2 className="w-4 h-4 mr-2" />
                  Change Video
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change YouTube Video</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Paste YouTube URL here..."
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSaveUrl} className="flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

function extractVideoId(url: string): string {
  let videoId = '';
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('youtube.com')) {
      videoId = urlObj.searchParams.get('v') || '';
    } else if (urlObj.hostname === 'youtu.be') {
      videoId = urlObj.pathname.slice(1);
    }
  } catch {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (match) videoId = match[1];
  }
  return videoId;
}
