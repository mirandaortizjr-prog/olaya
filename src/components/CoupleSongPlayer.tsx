import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Music, X, Play, Pause } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface CoupleSongPlayerProps {
  coupleId: string;
  songUrl: string | null;
  onUpdate: (newUrl: string | null) => void;
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
  videoId: string | null;
  isPlaying: boolean;
  onClose: () => void;
  onEditClick?: () => void;
}

export const CoupleSongPlayerEmbed = ({ videoId, isPlaying, onClose, onEditClick }: PlayerComponentProps) => {
  if (!isPlaying || !videoId) return null;
  
  return (
    <div className="w-full max-w-lg mx-auto shadow-2xl rounded-lg overflow-hidden bg-background border">
      <div className="flex items-center justify-between p-2 bg-muted">
        <div className="flex items-center gap-2">
          <Music className="w-4 h-4" />
          <span className="text-sm font-medium">Our Song 🎵</span>
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
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0`}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export const CoupleSongPlayer = ({ coupleId, songUrl, onUpdate, autoplay = false, isPlaying = false, onPlayingChange, onEditClick }: CoupleSongPlayerProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const [newSongUrl, setNewSongUrl] = useState(songUrl || "");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const togglePlay = () => {
    if (onPlayingChange) {
      onPlayingChange(!isPlaying);
    }
  };

  const handleEditClick = () => {
    setShowDialog(true);
    if (onEditClick) {
      onEditClick();
    }
  };

  const saveSongUrl = async () => {
    setSaving(true);
    try {
      const urlToSave = newSongUrl.trim() || null;
      
      if (urlToSave && !extractYouTubeId(urlToSave)) {
        toast({
          title: "Invalid URL",
          description: "Please enter a valid YouTube or YouTube Music link",
          variant: "destructive",
        });
        setSaving(false);
        return;
      }

      const { error } = await supabase
        .from('couples')
        .update({ couple_song_url: urlToSave })
        .eq('id', coupleId);

      if (error) throw error;

      onUpdate(urlToSave);
      toast({ title: "Success", description: urlToSave ? "Song updated!" : "Song removed" });
      setShowDialog(false);
    } catch (error: any) {
      console.error('Error saving song:', error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const videoId = songUrl ? extractYouTubeId(songUrl) : null;

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          if (songUrl) {
            togglePlay();
          } else {
            handleEditClick();
          }
        }}
        className="gap-1 text-xs sm:text-sm whitespace-nowrap"
      >
        <Music className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
        <span className="hidden sm:inline">{songUrl ? (isPlaying ? "Pause Song" : "Our Song") : "Add Song"}</span>
        <span className="sm:hidden">{songUrl ? (isPlaying ? "⏸" : "Song") : "Add"}</span>
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Music className="w-5 h-5" />
              Your Special Song
            </DialogTitle>
            <DialogDescription>
              Paste a YouTube or YouTube Music link to your couple's special song
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Input
                placeholder="https://youtube.com/watch?v=..."
                value={newSongUrl}
                onChange={(e) => setNewSongUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Works with YouTube, YouTube Music, and Shorts links
              </p>
            </div>

            {newSongUrl && extractYouTubeId(newSongUrl) && (
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                <iframe
                  src={`https://www.youtube.com/embed/${extractYouTubeId(newSongUrl)}`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={saveSongUrl} disabled={saving} className="flex-1">
                {saving ? "Saving..." : "Save Song"}
              </Button>
              {songUrl && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setNewSongUrl("");
                    saveSongUrl();
                  }}
                  disabled={saving}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </>
  );
};
