import { useEffect } from 'react';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';

export const GlobalMusicPlayer = () => {
  const { playlist, currentIndex, isPlaying } = useMusicPlayer();

  const extractVideoId = (url: string): string => {
    let videoId = '';
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('youtube.com')) {
        videoId = urlObj.searchParams.get('v') || '';
      } else if (urlObj.hostname === 'youtu.be') {
        videoId = urlObj.pathname.slice(1);
      }
    } catch {
      const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
      if (match) videoId = match[1];
    }
    return videoId;
  };

  if (playlist.length === 0 || !isPlaying) return null;

  const currentVideoId = extractVideoId(playlist[currentIndex]);

  return (
    <div className="hidden">
      <iframe
        src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1&enablejsapi=1&loop=1&playlist=${currentVideoId}`}
        title="Background music player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  );
};
