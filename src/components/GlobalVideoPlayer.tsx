import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Minimize2, Maximize2 } from 'lucide-react';
import { useVideoPlayer } from '@/contexts/VideoPlayerContext';

export const GlobalVideoPlayer = () => {
  const { videoUrl, isMinimized, setIsMinimized, closePlayer } = useVideoPlayer();
  const [embedUrl, setEmbedUrl] = useState<string>('');

  useEffect(() => {
    if (!videoUrl) {
      setEmbedUrl('');
      return;
    }

    // Extract video ID from various YouTube URL formats
    let videoId = '';
    try {
      const url = new URL(videoUrl);
      if (url.hostname.includes('youtube.com')) {
        videoId = url.searchParams.get('v') || '';
      } else if (url.hostname === 'youtu.be') {
        videoId = url.pathname.slice(1);
      }
    } catch {
      // If URL parsing fails, try regex
      const match = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
      if (match) videoId = match[1];
    }

    if (videoId) {
      setEmbedUrl(`https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`);
    }
  }, [videoUrl]);

  if (!videoUrl || !embedUrl) return null;

  if (isMinimized) {
    return (
      <div className="fixed bottom-24 right-4 z-50 w-64 h-36 shadow-2xl rounded-lg overflow-hidden">
        <Card className="relative w-full h-full p-0 border-2 border-primary/50">
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <div className="absolute top-1 right-1 flex gap-1 z-10">
            <Button
              variant="secondary"
              size="icon"
              className="h-6 w-6 bg-black/80 hover:bg-black/90 border-white/20"
              onClick={() => setIsMinimized(false)}
            >
              <Maximize2 className="h-3 w-3 text-white" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-6 w-6 bg-black/80 hover:bg-black/90 border-white/20"
              onClick={closePlayer}
            >
              <X className="h-3 w-3 text-white" />
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <Card className="relative w-full max-w-4xl aspect-video bg-black border-primary/50">
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full rounded-lg"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        <div className="absolute top-2 right-2 flex gap-2 z-10">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 bg-black/80 hover:bg-black/90 border-white/20"
            onClick={() => setIsMinimized(true)}
          >
            <Minimize2 className="h-4 w-4 text-white" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 bg-black/80 hover:bg-black/90 border-white/20"
            onClick={closePlayer}
          >
            <X className="h-4 w-4 text-white" />
          </Button>
        </div>
      </Card>
    </div>
  );
};
