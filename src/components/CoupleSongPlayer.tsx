import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Music, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CoupleSongPlayerProps {
  coupleId: string;
  songs: string[];
  onUpdate: (newSongs: string[]) => void;
  autoplay?: boolean;
  isPlaying?: boolean;
  onPlayingChange?: (playing: boolean) => void;
  onEditClick?: () => void;
}

const extractYouTubeId = (url: string): string | null => {
  if (!url) return null;
  
  // Handle various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
    /music\.youtube\.com\/watch\?v=([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }
  
  return null;
};

interface PlayerComponentProps {
  videoIds: string[];
  currentIndex: number;
  isPlaying: boolean;
  onClose: () => void;
  onNext: () => void;
  onEditClick?: () => void;
}

export const CoupleSongPlayerEmbed = ({ videoIds, currentIndex, isPlaying, onClose, onNext, onEditClick }: PlayerComponentProps) => {
  if (videoIds.length === 0 || !isPlaying) return null;
  
  return (
    <div className="w-full max-w-lg mx-auto shadow-2xl rounded-lg overflow-hidden bg-background border">
      <div className="flex items-center justify-between p-2 bg-muted">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-7 px-2"
          >
            <Music className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium">
            Our Playlist 🎵 ({currentIndex + 1}/{videoIds.length})
          </span>
          {onEditClick && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onEditClick}
              className="h-7 px-2 text-xs"
            >
              Edit
            </Button>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="aspect-video">
        <iframe
          key={`yt-${videoIds[currentIndex]}-${Date.now()}`}
          src={`https://www.youtube.com/embed/${videoIds[currentIndex]}?autoplay=1&enablejsapi=1&origin=${window.location.origin}`}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube Music Player"
          onEnded={onNext}
        />
      </div>
    </div>
  );
};

export const CoupleSongPlayer = ({ coupleId, songs, onUpdate, autoplay = false, isPlaying = false, onPlayingChange, onEditClick }: CoupleSongPlayerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { toast } = useToast();

  const videoIds = songs.map(url => extractYouTubeId(url)).filter(Boolean) as string[];

  const togglePlay = () => {
    if (onPlayingChange) {
      onPlayingChange(!isPlaying);
    }
  };

  const handleNext = () => {
    if (currentIndex < videoIds.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Loop back to start
    }
  };

  const handleEditClick = () => {
    if (onEditClick) {
      onEditClick();
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          if (songs.length > 0) {
            togglePlay();
          } else {
            handleEditClick();
          }
        }}
        className="gap-1 text-xs sm:text-sm whitespace-nowrap"
      >
        <Music className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
        <span className="hidden sm:inline">{songs.length > 0 ? (isPlaying ? "Pause" : "Our Songs") : "Add Songs"}</span>
        <span className="sm:hidden">{songs.length > 0 ? (isPlaying ? "⏸" : "♫") : "Add"}</span>
      </Button>

      <CoupleSongPlayerEmbed 
        videoIds={videoIds}
        currentIndex={currentIndex}
        isPlaying={isPlaying}
        onClose={() => togglePlay()}
        onNext={handleNext}
        onEditClick={handleEditClick}
      />
    </>
  );
};
