import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface MusicPlayerContextType {
  playlist: string[];
  currentIndex: number;
  isPlaying: boolean;
  isMinimized: boolean;
  coupleId: string | null;
  setPlaylist: (playlist: string[]) => void;
  setCurrentIndex: (index: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setIsMinimized: (minimized: boolean) => void;
  setCoupleId: (id: string | null) => void;
  nextSong: () => void;
  previousSong: () => void;
  playRandomSong: () => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export const MusicPlayerProvider = ({ children }: { children: ReactNode }) => {
  const [playlist, setPlaylist] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [coupleId, setCoupleId] = useState<string | null>(null);

  // Load playlist when coupleId is set
  useEffect(() => {
    if (coupleId) {
      loadPlaylist(coupleId);
    }
  }, [coupleId]);

  // Auto-play with random song when playlist loads
  useEffect(() => {
    if (playlist.length > 0 && !isPlaying) {
      const randomIndex = Math.floor(Math.random() * playlist.length);
      setCurrentIndex(randomIndex);
      setIsPlaying(true);
    }
  }, [playlist]);

  const loadPlaylist = async (id: string) => {
    const { data } = await supabase
      .from('couples')
      .select('couple_songs')
      .eq('id', id)
      .single();

    if (data?.couple_songs && Array.isArray(data.couple_songs)) {
      const songs = (data.couple_songs as string[]).filter(song => typeof song === 'string');
      setPlaylist(songs);
    }
  };

  const nextSong = () => {
    if (playlist.length > 0) {
      setCurrentIndex((currentIndex + 1) % playlist.length);
    }
  };

  const previousSong = () => {
    if (playlist.length > 0) {
      setCurrentIndex((currentIndex - 1 + playlist.length) % playlist.length);
    }
  };

  const playRandomSong = () => {
    if (playlist.length > 0) {
      const randomIndex = Math.floor(Math.random() * playlist.length);
      setCurrentIndex(randomIndex);
    }
  };

  return (
    <MusicPlayerContext.Provider
      value={{
        playlist,
        currentIndex,
        isPlaying,
        isMinimized,
        coupleId,
        setPlaylist,
        setCurrentIndex,
        setIsPlaying,
        setIsMinimized,
        setCoupleId,
        nextSong,
        previousSong,
        playRandomSong,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (context === undefined) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
};
