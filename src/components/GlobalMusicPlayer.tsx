import { useEffect, useRef } from 'react';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';

export const GlobalMusicPlayer = () => {
  const { playlist, currentIndex, isPlaying } = useMusicPlayer();
  const iframeRef = useRef<HTMLIFrameElement>(null);

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

  // Control iframe playback based on isPlaying state
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const command = isPlaying ? 'playVideo' : 'pauseVideo';
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: command }),
        '*'
      );
    }
  }, [isPlaying]);

  if (playlist.length === 0) return null;

  const currentVideoId = extractVideoId(playlist[currentIndex]);

  return (
    <div className="fixed -left-[9999px] -top-[9999px] w-0 h-0 overflow-hidden opacity-0 pointer-events-none">
      <iframe
        ref={iframeRef}
        src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=${isPlaying ? 1 : 0}&enablejsapi=1&loop=1&playlist=${currentVideoId}`}
        title="Background music player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        className="w-full h-full"
      />
    </div>
  );
};
