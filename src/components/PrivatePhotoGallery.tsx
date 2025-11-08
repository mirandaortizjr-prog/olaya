import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, X, Trash2, ZoomIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface PrivatePhotoGalleryProps {
  coupleId: string;
  userId: string;
  onClose: () => void;
}

interface Photo {
  id: string;
  file_path: string;
  caption: string | null;
  created_at: string;
  uploaded_by: string;
  url?: string;
}

export const PrivatePhotoGallery = ({ coupleId, userId, onClose }: PrivatePhotoGalleryProps) => {
  const { toast } = useToast();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('private_photos')
      .select('*')
      .eq('couple_id', coupleId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      // Get signed URLs for each photo
      const photosWithUrls = await Promise.all(
        data.map(async (photo) => {
          const { data: signedUrlData } = await supabase.storage
            .from('private_photos')
            .createSignedUrl(photo.file_path, 3600);
          
          return {
            ...photo,
            url: signedUrlData?.signedUrl || ''
          };
        })
      );
      setPhotos(photosWithUrls);
    }
    setLoading(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(e.target.files);
      handleUpload(e.target.files);
    }
  };

  const handleUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;

    setUploading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${coupleId}/${Date.now()}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('private_photos')
        .upload(fileName, file);

      if (uploadError) {
        toast({
          title: "Upload failed",
          description: uploadError.message,
          variant: "destructive"
        });
        continue;
      }

      const { error: dbError } = await supabase
        .from('private_photos')
        .insert({
          couple_id: coupleId,
          uploaded_by: userId,
          file_path: fileName
        });

      if (dbError) {
        toast({
          title: "Error saving photo",
          description: dbError.message,
          variant: "destructive"
        });
      }
    }

    setUploading(false);
    setSelectedFiles(null);
    loadPhotos();
    toast({ title: "Photos uploaded! 🔥" });
  };

  const handleDelete = async (photo: Photo) => {
    if (photo.uploaded_by !== userId) {
      toast({
        title: "Permission denied",
        description: "You can only delete your own photos",
        variant: "destructive"
      });
      return;
    }

    const { error: storageError } = await supabase.storage
      .from('private_photos')
      .remove([photo.file_path]);

    if (storageError) {
      toast({
        title: "Error deleting photo",
        description: storageError.message,
        variant: "destructive"
      });
      return;
    }

    const { error: dbError } = await supabase
      .from('private_photos')
      .delete()
      .eq('id', photo.id);

    if (!dbError) {
      setSelectedPhoto(null);
      loadPhotos();
      toast({ title: "Photo deleted" });
    }
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
    resetZoom();
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    const newScale = Math.min(Math.max(1, scale + delta), 4);
    setScale(newScale);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      );
      (containerRef.current as any)._lastDistance = distance;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && containerRef.current) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      );
      
      const lastDistance = (containerRef.current as any)._lastDistance || distance;
      const delta = (distance - lastDistance) * 0.01;
      const newScale = Math.min(Math.max(1, scale + delta), 4);
      setScale(newScale);
      (containerRef.current as any)._lastDistance = distance;
    }
  };

  const handleDoubleClick = () => {
    if (scale > 1) {
      resetZoom();
    } else {
      setScale(2);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-black to-purple-900 z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-black/40 backdrop-blur-sm border-b border-purple-500/20 z-10">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={onClose}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <h1 className="text-xl font-bold text-white">Private Photos</h1>

          <label htmlFor="photo-upload">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              disabled={uploading}
              asChild
            >
              <div>
                <Upload className="w-5 h-5" />
              </div>
            </Button>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileSelect}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {/* Photo Grid - Google Photos Style */}
      <div className="p-2">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-gray-400">Loading photos...</p>
          </div>
        ) : photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
            <Upload className="w-16 h-16 text-gray-500 mb-4" />
            <p className="text-gray-400 mb-2">No photos yet</p>
            <p className="text-sm text-gray-500 mb-6">Upload your first private photo</p>
            <label htmlFor="photo-upload-empty">
              <Button className="bg-pink-600 hover:bg-pink-700" asChild>
                <div>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Photos
                </div>
              </Button>
              <input
                id="photo-upload-empty"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileSelect}
                disabled={uploading}
              />
            </label>
          </div>
        ) : (
          <div className="columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-0.5 space-y-0.5">
            {photos.map((photo) => (
              <button
                key={photo.id}
                onClick={() => handlePhotoClick(photo)}
                className="relative w-full mb-0.5 overflow-hidden bg-gray-900 hover:opacity-90 transition-opacity group break-inside-avoid"
              >
                <img
                  src={photo.url}
                  alt={photo.caption || 'Private photo'}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Photo Viewer Dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => { setSelectedPhoto(null); resetZoom(); }}>
        <DialogContent className="max-w-[100vw] max-h-[100vh] w-full h-full bg-black/98 border-none p-0 m-0">
          {selectedPhoto && (
            <div className="relative w-full h-full">
              <div className="absolute top-4 right-4 z-20 flex gap-2">
                {selectedPhoto.uploaded_by === userId && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-black/50 text-white hover:bg-red-600 backdrop-blur-sm"
                    onClick={() => handleDelete(selectedPhoto)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-black/50 text-white hover:bg-white/10 backdrop-blur-sm"
                  onClick={() => { setSelectedPhoto(null); resetZoom(); }}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div 
                ref={containerRef}
                className="w-full h-full flex items-center justify-center overflow-hidden touch-none"
                onWheel={handleWheel}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onDoubleClick={handleDoubleClick}
              >
                <img
                  ref={imageRef}
                  src={selectedPhoto.url}
                  alt={selectedPhoto.caption || 'Private photo'}
                  className="max-w-full max-h-full object-contain cursor-zoom-in"
                  style={{
                    transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                    transition: scale === 1 ? 'transform 0.3s ease' : 'none',
                  }}
                />
              </div>
              
              {scale > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-black/50 text-white hover:bg-white/10 backdrop-blur-sm"
                    onClick={resetZoom}
                  >
                    Reset Zoom
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
