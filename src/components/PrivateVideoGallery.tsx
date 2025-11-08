import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Upload, Trash2, Play, SkipBack, SkipForward, Maximize2, Minimize2, ZoomIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Camera } from "@capacitor/camera";
import { CameraResultType, CameraSource } from "@capacitor/camera";

interface PrivateVideo {
  id: string;
  file_path: string;
  caption: string | null;
  uploaded_by: string;
  created_at: string;
}

interface PrivateVideoGalleryProps {
  coupleId: string;
  userId: string;
}

export const PrivateVideoGallery = ({ coupleId, userId }: PrivateVideoGalleryProps) => {
  const [videos, setVideos] = useState<PrivateVideo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const lastTapRef = useRef<number>(0);
  const touchStartRef = useRef<{ x: number; y: number; scale: number } | null>(null);
  const initialDistanceRef = useRef<number>(0);

  const { toast } = useToast();

  useEffect(() => {
    loadVideos();
  }, [coupleId]);

  const loadVideos = async () => {
    const { data, error } = await supabase
      .from('shared_media')
      .select('*')
      .eq('couple_id', coupleId)
      .eq('file_type', 'private_video')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setVideos(data);
    }
  };

  const uploadVideo = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      toast({ title: "Video too large", description: "Maximum size is 100MB", variant: "destructive" });
      return;
    }

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const filePath = `private/${coupleId}/${userId}/videos/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('couple_media')
      .upload(filePath, file);

    if (uploadError) {
      toast({ title: "Error uploading video", variant: "destructive" });
      setUploading(false);
      return;
    }

    const { error: dbError } = await supabase
      .from('shared_media')
      .insert({
        couple_id: coupleId,
        uploaded_by: userId,
        file_path: filePath,
        file_type: 'private_video'
      });

    if (dbError) {
      toast({ title: "Error saving video", variant: "destructive" });
    } else {
      toast({ title: "Video uploaded!" });
      loadVideos();
    }
    setUploading(false);
  };

  const deleteVideo = async (id: string, filePath: string) => {
    await supabase.storage.from('couple_media').remove([filePath]);
    await supabase.from('shared_media').delete().eq('id', id);
    toast({ title: "Video deleted" });
    loadVideos();
  };

  const getVideoUrl = async (path: string) => {
    const { data } = await supabase.storage.from('couple_media').createSignedUrl(path, 3600);
    return data?.signedUrl;
  };

  const handleVideoClick = async (video: PrivateVideo) => {
    const url = await getVideoUrl(video.file_path);
    if (url) {
      setSelectedVideo(url);
      setIsPlaying(true);
      resetZoom();
    }
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const handleDoubleTap = (event: React.MouseEvent | React.TouchEvent) => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTapRef.current;

    if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const clickX = 'touches' in event ? event.touches[0].clientX : event.clientX;
      const midpoint = rect.left + rect.width / 2;

      if (clickX < midpoint) {
        skipTime(-10);
        showSkipIndicator('backward');
      } else {
        skipTime(10);
        showSkipIndicator('forward');
      }
    }

    lastTapRef.current = now;
  };

  const showSkipIndicator = (direction: 'forward' | 'backward') => {
    const indicator = document.createElement('div');
    indicator.className = `absolute top-1/2 ${direction === 'backward' ? 'left-8' : 'right-8'} -translate-y-1/2 bg-background/80 p-4 rounded-full animate-ping pointer-events-none z-50`;
    indicator.innerHTML = direction === 'backward' 
      ? '<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/><text x="12" y="16" text-anchor="middle" font-size="6" font-weight="bold">10</text></svg>'
      : '<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z"/><text x="12" y="16" text-anchor="middle" font-size="6" font-weight="bold">10</text></svg>';
    
    containerRef.current?.appendChild(indicator);
    setTimeout(() => indicator.remove(), 500);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      initialDistanceRef.current = distance;
      touchStartRef.current = {
        x: position.x,
        y: position.y,
        scale: scale
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchStartRef.current) {
      e.preventDefault();
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      
      const scaleChange = distance / initialDistanceRef.current;
      const newScale = Math.min(Math.max(touchStartRef.current.scale * scaleChange, 1), 4);
      setScale(newScale);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    const newScale = Math.min(Math.max(scale + delta, 1), 4);
    setScale(newScale);
  };

  return (
    <div className="space-y-4">
      <label htmlFor="video-upload">
        <Button className="w-full" disabled={uploading} asChild>
          <span>
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? "Uploading..." : "Upload Private Video"}
          </span>
        </Button>
      </label>
      <input
        id="video-upload"
        type="file"
        accept="video/*"
        className="hidden"
        onChange={uploadVideo}
      />

      {videos.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">
          <Play className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No private videos yet.</p>
        </div>
      ) : (
        <div className="columns-3 gap-2 space-y-2">
          {videos.map((video) => (
            <div
              key={video.id}
              className="break-inside-avoid relative group cursor-pointer"
              onClick={() => handleVideoClick(video)}
            >
              <div className="relative bg-muted rounded overflow-hidden aspect-video">
                <video
                  src={video.file_path}
                  className="w-full h-full object-cover"
                  preload="metadata"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                  <Play className="w-12 h-12 text-white" fill="white" />
                </div>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteVideo(video.id, video.file_path);
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!selectedVideo} onOpenChange={() => { setSelectedVideo(null); setIsPlaying(false); resetZoom(); }}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black">
          <div
            ref={containerRef}
            className="relative w-full h-full flex items-center justify-center overflow-hidden"
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onWheel={handleWheel}
            onClick={handleDoubleTap}
          >
            <video
              ref={videoRef}
              src={selectedVideo || ""}
              className="max-w-full max-h-[95vh] transition-transform"
              style={{
                transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
              }}
              autoPlay
              controls={false}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            {/* Professional Controls Overlay */}
            <div
              className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 transition-opacity duration-300 ${
                showControls ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="flex items-center justify-center gap-4">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-12 w-12 text-white hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    skipTime(-10);
                  }}
                >
                  <SkipBack className="w-6 h-6" />
                </Button>
                
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-16 w-16 text-white hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlayPause();
                  }}
                >
                  {isPlaying ? (
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                    </svg>
                  ) : (
                    <Play className="w-8 h-8" fill="currentColor" />
                  )}
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  className="h-12 w-12 text-white hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    skipTime(10);
                  }}
                >
                  <SkipForward className="w-6 h-6" />
                </Button>
              </div>
            </div>

            {/* Top Controls */}
            <div
              className={`absolute inset-x-0 top-0 bg-gradient-to-b from-black/90 via-black/50 to-transparent p-4 transition-opacity duration-300 ${
                showControls ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="flex items-center justify-between">
                {scale > 1 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      resetZoom();
                    }}
                  >
                    <ZoomIn className="w-4 h-4 mr-2" />
                    Reset Zoom
                  </Button>
                )}
                <div className="flex-1" />
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFullscreen();
                  }}
                >
                  {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
