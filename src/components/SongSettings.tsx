import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Music, X, Plus, GripVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SongSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupleId: string;
  songs: string[];
  onUpdate: (newSongs: string[]) => void;
}

const extractYouTubeId = (url: string): string | null => {
  if (!url) return null;
  
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

export const SongSettings = ({ open, onOpenChange, coupleId, songs, onUpdate }: SongSettingsProps) => {
  const [editingSongs, setEditingSongs] = useState<string[]>(songs);
  const [newSongUrl, setNewSongUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setEditingSongs(songs);
  }, [songs, open]);

  const addSong = () => {
    if (!newSongUrl.trim()) return;
    
    if (!extractYouTubeId(newSongUrl)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid YouTube or YouTube Music link",
        variant: "destructive",
      });
      return;
    }

    if (editingSongs.length >= 5) {
      toast({
        title: "Playlist Full",
        description: "You can add up to 5 songs",
        variant: "destructive",
      });
      return;
    }

    setEditingSongs([...editingSongs, newSongUrl.trim()]);
    setNewSongUrl("");
  };

  const removeSong = (index: number) => {
    setEditingSongs(editingSongs.filter((_, i) => i !== index));
  };

  const saveSongs = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('couples')
        .update({ couple_songs: editingSongs })
        .eq('id', coupleId);

      if (error) throw error;

      onUpdate(editingSongs);
      toast({ 
        title: "Success", 
        description: editingSongs.length > 0 ? "Playlist updated!" : "Playlist cleared" 
      });
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error saving songs:', error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Music className="w-5 h-5" />
            Our Playlist
          </DialogTitle>
          <DialogDescription>
            Add up to 5 songs that will play one after another. Both of you can edit this playlist.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current songs */}
          {editingSongs.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Songs ({editingSongs.length}/5)</p>
              {editingSongs.map((url, index) => {
                const videoId = extractYouTubeId(url);
                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-3 bg-muted rounded-lg group"
                  >
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      {videoId && (
                        <div className="aspect-video w-full max-w-[120px] rounded overflow-hidden bg-background">
                          <img
                            src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                            alt={`Song ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSong(index)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Add new song */}
          {editingSongs.length < 5 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Add New Song</p>
              <div className="flex gap-2">
                <Input
                  placeholder="https://youtube.com/watch?v=..."
                  value={newSongUrl}
                  onChange={(e) => setNewSongUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addSong()}
                />
                <Button onClick={addSong} size="icon" variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Works with YouTube, YouTube Music, and Shorts links
              </p>
            </div>
          )}

          {/* Preview */}
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

          {/* Save button */}
          <Button onClick={saveSongs} disabled={saving} className="w-full">
            {saving ? "Saving..." : "Save Playlist"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
