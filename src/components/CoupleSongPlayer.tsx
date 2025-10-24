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

export const CoupleSongPlayer = ({ coupleId, songUrl, onUpdate, autoplay = false }: CoupleSongPlayerProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const [newSongUrl, setNewSongUrl] = useState(songUrl || "");
  const [saving, setSaving] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const autoplayAttempted = useRef(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  // Attempt autoplay when song URL is available
  useEffect(() => {
    if (autoplay && songUrl && !autoplayAttempted.current) {
      autoplayAttempted.current = true;
      // Small delay to ensure component is mounted
      const timer = setTimeout(() => {
        setIsPlaying(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [songUrl, autoplay]);

  // Track user interaction to enable autoplay
  useEffect(() => {
    const handleInteraction = () => {
      setHasInteracted(true);
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
    
    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);
    
    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

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
            setIsPlaying(!isPlaying);
          } else {
            setShowDialog(true);
          }
        }}
        className="gap-2"
      >
        <Music className="w-4 h-4" />
        {songUrl ? (isPlaying ? "Our Song" : "Our Song") : "Add Song"}
      </Button>

      {songUrl && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDialog(true)}
          className="gap-2"
        >
          Edit Song
        </Button>
      )}

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

      {/* Floating Player */}
      {isPlaying && videoId && (
        <div className="fixed bottom-20 right-4 z-50 w-80 shadow-2xl rounded-lg overflow-hidden bg-background border">
          <div className="flex items-center justify-between p-2 bg-muted">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4" />
              <span className="text-sm font-medium">Our Song 🎵</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPlaying(false)}
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
      )}
    </>
  );
};
