import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipForward, SkipBack, Music } from 'lucide-react';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';

export const MusicPlayerControls = () => {
  const {
    playlist,
    currentIndex,
    isPlaying,
    setIsPlaying,
    nextSong,
    previousSong,
  } = useMusicPlayer();

  if (playlist.length === 0) {
    return (
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <div className="text-center space-y-2">
              <Music className="w-12 h-12 mx-auto opacity-50" />
              <p className="text-sm">No songs in playlist</p>
              <p className="text-xs">Add songs in settings to start playing music</p>
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
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music className={`w-5 h-5 text-white ${isPlaying ? 'animate-pulse' : ''}`} />
              <span className="text-white font-medium">Music Player</span>
            </div>
            <span className="text-white/70 text-sm">
              Song {currentIndex + 1} of {playlist.length}
            </span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-white hover:bg-white/20"
              onClick={previousSong}
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
              onClick={nextSong}
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>

          <div className="text-center">
            <p className="text-white/60 text-xs">
              {isPlaying ? '♫ Now Playing ♫' : 'Paused'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
