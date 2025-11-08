import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipForward, SkipBack, Music, Video } from 'lucide-react';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { YouTubePlayer } from '@/components/YouTubePlayer';
import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface MusicPlayerControlsProps {
  coupleId: string;
  videoUrl?: string;
  onVideoUrlChange?: (url: string) => void;
}

export const MusicPlayerControls = ({ coupleId, videoUrl, onVideoUrlChange }: MusicPlayerControlsProps) => {
  const {
    playlist,
    currentIndex,
    isPlaying,
    setIsPlaying,
    nextSong,
    previousSong,
  } = useMusicPlayer();
  
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  if (playlist.length === 0) {
    return (
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardContent className="p-2">
          <div className="flex items-center justify-center py-4 text-muted-foreground">
            <div className="text-center space-y-1">
              <Music className="w-8 h-8 mx-auto opacity-50" />
              <p className="text-xs">No songs in playlist</p>
              <p className="text-[10px]">Add songs in settings to start playing music</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <Card className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur border-border/50">
      <CardContent className="p-2">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Music className={`w-4 h-4 text-white ${isPlaying ? 'animate-pulse' : ''}`} />
              <span className="text-white font-medium text-sm">Music Player</span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-white hover:bg-white/20"
                onClick={() => setIsVideoOpen(!isVideoOpen)}
              >
                <Video className="h-3.5 w-3.5" />
              </Button>
              <span className="text-white/70 text-xs">
                Song {currentIndex + 1} of {playlist.length}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={previousSong}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-white hover:bg-white/20"
              onClick={handlePlayPause}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={nextSong}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-center">
            <p className="text-white/60 text-[10px]">
              {isPlaying ? '♫ Now Playing ♫' : 'Paused'}
            </p>
          </div>

          <Collapsible open={isVideoOpen} onOpenChange={setIsVideoOpen}>
            <CollapsibleContent>
              <div className="pt-2 border-t border-white/10">
                <YouTubePlayer
                  coupleId={coupleId}
                  videoUrl={videoUrl}
                  onVideoUrlChange={onVideoUrlChange}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
    </Card>
  );
};
