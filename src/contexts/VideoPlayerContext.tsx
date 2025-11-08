import React, { createContext, useContext, useState, ReactNode } from 'react';

interface VideoPlayerContextType {
  videoUrl: string | null;
  isMinimized: boolean;
  isPlaying: boolean;
  setVideoUrl: (url: string | null) => void;
  setIsMinimized: (minimized: boolean) => void;
  setIsPlaying: (playing: boolean) => void;
  closePlayer: () => void;
}

const VideoPlayerContext = createContext<VideoPlayerContextType | undefined>(undefined);

export const VideoPlayerProvider = ({ children }: { children: ReactNode }) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const closePlayer = () => {
    setVideoUrl(null);
    setIsMinimized(false);
    setIsPlaying(false);
  };

  return (
    <VideoPlayerContext.Provider
      value={{
        videoUrl,
        isMinimized,
        isPlaying,
        setVideoUrl,
        setIsMinimized,
        setIsPlaying,
        closePlayer,
      }}
    >
      {children}
    </VideoPlayerContext.Provider>
  );
};

export const useVideoPlayer = () => {
  const context = useContext(VideoPlayerContext);
  if (context === undefined) {
    throw new Error('useVideoPlayer must be used within a VideoPlayerProvider');
  }
  return context;
};
