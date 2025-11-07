import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, Play, Pause, X, Plus, Trash2, SkipForward } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface YouTubePlayerProps {
  coupleId: string;
  videoUrl?: string;
  onVideoUrlChange?: (url: string) => void;
}

export const YouTubePlayer = ({ coupleId, videoUrl, onVideoUrlChange }: YouTubePlayerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [editingUrl, setEditingUrl] = useState(false);
  const [tempUrl, setTempUrl] = useState("");
  const [playlist, setPlaylist] = useState<string[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    loadPlaylist();
  }, [coupleId]);

  const loadPlaylist = async () => {
    const { data } = await supabase
      .from('couples')
      .select('couple_songs')
      .eq('id', coupleId)
      .single();

    if (data?.couple_songs && Array.isArray(data.couple_songs)) {
      const songs = (data.couple_songs as string[]).filter(song => typeof song === 'string');
      setPlaylist(songs);
      
      // Set random starting index
      if (songs.length > 0) {
        const randomIndex = Math.floor(Math.random() * songs.length);
        setCurrentSongIndex(randomIndex);
      }
    }
  };

  const getVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|music\.youtube\.com\/watch\?v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const currentVideoId = playlist.length > 0 ? getVideoId(playlist[currentSongIndex]) : null;

  const handleAddSong = async () => {
    if (!tempUrl.trim()) {
      toast({ title: "Please enter a URL", variant: "destructive" });
      return;
    }

    if (playlist.length >= 10) {
      toast({ title: "Maximum 10 songs allowed", variant: "destructive" });
      return;
    }

    const newPlaylist = [...playlist, tempUrl];
    
    const { error } = await supabase
      .from('couples')
      .update({ couple_songs: newPlaylist })
      .eq('id', coupleId);

    if (error) {
      toast({ title: "Error adding song", variant: "destructive" });
    } else {
      setPlaylist(newPlaylist);
      setTempUrl("");
      setEditingUrl(false);
      toast({ title: "Song added to playlist!" });
    }
  };

  const handleRemoveSong = async (index: number) => {
    const newPlaylist = playlist.filter((_, i) => i !== index);
    
    const { error } = await supabase
      .from('couples')
      .update({ couple_songs: newPlaylist })
      .eq('id', coupleId);

    if (error) {
      toast({ title: "Error removing song", variant: "destructive" });
    } else {
      setPlaylist(newPlaylist);
      if (currentSongIndex >= newPlaylist.length) {
        setCurrentSongIndex(Math.max(0, newPlaylist.length - 1));
      }
      toast({ title: "Song removed from playlist" });
    }
  };

  const handleNextSong = () => {
    if (playlist.length > 0) {
      setCurrentSongIndex((currentSongIndex + 1) % playlist.length);
    }
  };

  const togglePlayer = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsPlaying(true);
    }
  };

  return (
    <div className="w-full">
      {/* Hidden iframe for background playback */}
      {currentVideoId && !isOpen && (
        <div className="hidden">
          <iframe
            src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1&enablejsapi=1`}
            title="YouTube background player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      )}

      {/* Collapsed state - just a button to open */}
      {!isOpen && (
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="ghost"
            onClick={togglePlayer}
            className="text-white/90 hover:text-white hover:bg-white/10"
          >
            {isPlaying ? (
              <>
                <Pause className="w-5 h-5 mr-2" />
                Now Playing ({currentSongIndex + 1}/{playlist.length})
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                {playlist.length > 0 ? `Play Playlist (${playlist.length} songs)` : 'Open Music Player'}
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            onClick={() => setEditingUrl(true)}
            className="text-white/70 hover:text-white hover:bg-white/10 text-sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Song
          </Button>
        </div>
      )}

      {/* URL Input Dialog */}
      {editingUrl && (
        <div className="mb-4 p-4 bg-white/5 rounded-lg">
          <p className="text-white text-sm mb-2">Enter YouTube Music URL ({playlist.length}/10):</p>
          <div className="flex gap-2">
            <Input
              value={tempUrl}
              onChange={(e) => setTempUrl(e.target.value)}
              placeholder="https://music.youtube.com/watch?v=..."
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
            />
            <Button onClick={handleAddSong} variant="secondary" size="sm">
              Add
            </Button>
            <Button onClick={() => { setEditingUrl(false); setTempUrl(""); }} variant="ghost" size="sm">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Expanded state - show video player */}
      {isOpen && (
        <div className="w-full">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-medium">Music Player</h3>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingUrl(true)}
                className="text-white/70 hover:text-white hover:bg-white/10"
                disabled={playlist.length >= 10}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Song
              </Button>
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

          {currentVideoId ? (
            <>
              <div className="relative w-full pt-[56.25%] bg-black rounded-lg overflow-hidden mb-3">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=${isPlaying ? 1 : 0}&enablejsapi=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/70 text-sm">
                  Song {currentSongIndex + 1} of {playlist.length}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNextSong}
                  className="text-white/70 hover:text-white hover:bg-white/10"
                  disabled={playlist.length <= 1}
                >
                  <SkipForward className="w-4 h-4 mr-1" />
                  Next Song
                </Button>
              </div>

              {/* Playlist */}
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {playlist.map((url, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-2 rounded ${
                      index === currentSongIndex ? 'bg-white/20' : 'bg-white/5'
                    }`}
                  >
                    <button
                      onClick={() => setCurrentSongIndex(index)}
                      className="flex-1 text-left text-white/90 text-sm hover:text-white truncate"
                    >
                      {index + 1}. {url.length > 50 ? url.substring(0, 50) + '...' : url}
                    </button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSong(index)}
                      className="text-white/70 hover:text-red-500 hover:bg-white/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="w-full py-12 bg-white/5 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <p className="text-white/70 mb-3">No songs in playlist</p>
                <Button
                  onClick={() => setEditingUrl(true)}
                  variant="secondary"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add First Song
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
