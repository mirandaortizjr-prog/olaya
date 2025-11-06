import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, Play, Pause, X } from "lucide-react";

interface YouTubePlayerProps {
  coupleId: string;
  videoUrl?: string;
  onVideoUrlChange?: (url: string) => void;
}

export const YouTubePlayer = ({ coupleId, videoUrl, onVideoUrlChange }: YouTubePlayerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [editingUrl, setEditingUrl] = useState(false);
  const [tempUrl, setTempUrl] = useState(videoUrl || "");

  const getVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = videoUrl ? getVideoId(videoUrl) : null;

  const handleSaveUrl = () => {
    if (tempUrl && onVideoUrlChange) {
      onVideoUrlChange(tempUrl);
    }
    setEditingUrl(false);
  };

  const togglePlayer = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsPlaying(true);
    }
  };

  return (
    <div className="w-full">
      {/* Collapsed state - just a button to open */}
      {!isOpen && (
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="ghost"
            onClick={togglePlayer}
            className="text-white/90 hover:text-white hover:bg-white/10"
          >
            <Play className="w-5 h-5 mr-2" />
            Open Video Player
          </Button>
          {!videoUrl && (
            <Button
              variant="ghost"
              onClick={() => setEditingUrl(true)}
              className="text-white/70 hover:text-white hover:bg-white/10 text-sm"
            >
              Add Video URL
            </Button>
          )}
        </div>
      )}

      {/* URL Input Dialog */}
      {editingUrl && (
        <div className="mb-4 p-4 bg-white/5 rounded-lg">
          <p className="text-white text-sm mb-2">Enter YouTube URL:</p>
          <div className="flex gap-2">
            <Input
              value={tempUrl}
              onChange={(e) => setTempUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
            />
            <Button onClick={handleSaveUrl} variant="secondary" size="sm">
              Save
            </Button>
            <Button onClick={() => setEditingUrl(false)} variant="ghost" size="sm">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Expanded state - show video player */}
      {isOpen && (
        <div className="w-full">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-medium">Video Player</h3>
            <div className="flex gap-2">
              {videoUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingUrl(true)}
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  Change Video
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlayer}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <ChevronUp className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {videoId ? (
            <div className="relative w-full pt-[56.25%] bg-black rounded-lg overflow-hidden">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="w-full py-12 bg-white/5 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <p className="text-white/70 mb-3">No video added yet</p>
                <Button
                  onClick={() => setEditingUrl(true)}
                  variant="secondary"
                  size="sm"
                >
                  Add YouTube Video
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
