import { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipForward, SkipBack, Maximize2, Minimize2, Music, X } from 'lucide-react';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';

export const GlobalMusicPlayer = () => {
  const {
    playlist,
    currentIndex,
    isPlaying,
    isMinimized,
    setIsPlaying,
    setIsMinimized,
    nextSong,
    previousSong,
  } = useMusicPlayer();

  const [currentVideoId, setCurrentVideoId] = useState<string>('');
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (playlist.length > 0 && currentIndex < playlist.length) {
      const videoId = extractVideoId(playlist[currentIndex]);
      setCurrentVideoId(videoId);
    }
  }, [playlist, currentIndex]);

  // Load YouTube IFrame API
  useEffect(() => {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

    (window as any).onYouTubeIframeAPIReady = () => {
      console.log('YouTube IFrame API ready');
    };
  }, []);

  const handlePlayPause = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    nextSong();
  };

  const handlePrevious = () => {
    previousSong();
  };

  if (playlist.length === 0) return null;

  if (isMinimized) {
    return (
      <div className="fixed bottom-24 left-4 z-50">
        <Card className="bg-gradient-to-r from-purple-900/95 to-pink-900/95 backdrop-blur-lg border-white/20 shadow-2xl">
          <div className="p-3 flex items-center gap-3">
            <Music className="w-5 h-5 text-white animate-pulse" />
            <div className="flex flex-col min-w-0">
              <span className="text-white text-xs font-medium truncate">
                Song {currentIndex + 1} of {playlist.length}
              </span>
              <span className="text-white/70 text-[10px]">Playing...</span>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-white hover:bg-white/20"
                onClick={handlePrevious}
              >
                <SkipBack className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-white hover:bg-white/20"
                onClick={handlePlayPause}
              >
                {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-white hover:bg-white/20"
                onClick={handleNext}
              >
                <SkipForward className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-white hover:bg-white/20"
                onClick={() => setIsMinimized(false)}
              >
                <Maximize2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </Card>
        {/* Hidden iframe for background playback */}
        <div className="hidden">
          <iframe
            src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1&enablejsapi=1&loop=1&playlist=${currentVideoId}`}
            title="Music player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 max-w-md mx-auto">
      <Card className="bg-gradient-to-br from-purple-900/95 to-pink-900/95 backdrop-blur-lg border-white/20 shadow-2xl">
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Now Playing</span>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={() => setIsMinimized(true)}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="aspect-video rounded-lg overflow-hidden bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=${isPlaying ? 1 : 0}&enablejsapi=1`}
              title="Music player"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="flex items-center justify-between text-white">
            <span className="text-sm">
              Song {currentIndex + 1} of {playlist.length}
            </span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-white hover:bg-white/20"
              onClick={handlePrevious}
            >
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 text-white hover:bg-white/20"
              onClick={handlePlayPause}
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-white hover:bg-white/20"
              onClick={handleNext}
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
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
