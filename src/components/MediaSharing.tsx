import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Image, Video, Upload, Trash2, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface SharedMedia {
  id: string;
  uploaded_by: string;
  file_path: string;
  file_type: string;
  caption: string | null;
  created_at: string;
}

interface MediaSharingProps {
  coupleId: string;
  userId: string;
  partnerName?: string;
}

export const MediaSharing = ({ coupleId, userId, partnerName }: MediaSharingProps) => {
  const [media, setMedia] = useState<SharedMedia[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [viewingMedia, setViewingMedia] = useState<SharedMedia | null>(null);
  const [viewingUrl, setViewingUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    fetchMedia();

    const channel = supabase
      .channel('shared_media_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'shared_media',
          filter: `couple_id=eq.${coupleId}`
        },
        () => {
          fetchMedia();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [coupleId]);

  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

  const fetchMedia = async () => {
    const { data, error } = await supabase
      .from('shared_media')
      .select('*')
      .eq('couple_id', coupleId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching media:', error);
      return;
    }

    setMedia((data as SharedMedia[]) || []);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      toast({
        title: t('error'),
        description: t('onlyImagesVideos'),
        variant: "destructive"
      });
      return;
    }

    // Validate file size (20MB max)
    if (file.size > 20 * 1024 * 1024) {
      toast({
        title: t('error'),
        description: t('fileTooLarge'),
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);
  };

  const uploadMedia = async () => {
    if (!selectedFile) return;

    setUploading(true);

    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      const fileType = selectedFile.type.startsWith('image/') ? 'image' : 'video';

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('couple_media')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Save metadata
      const { error: dbError } = await supabase
        .from('shared_media')
        .insert({
          couple_id: coupleId,
          uploaded_by: userId,
          file_path: fileName,
          file_type: fileType,
          caption: caption.trim() || null
        });

      if (dbError) throw dbError;

      setSelectedFile(null);
      setCaption("");
      toast({
        title: t('success'),
        description: t('mediaUploaded')
      });
    } catch (error) {
      console.error('Error uploading media:', error);
      toast({
        title: t('error'),
        description: t('failedToUpload'),
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const deleteMedia = async (mediaItem: SharedMedia) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('couple_media')
        .remove([mediaItem.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('shared_media')
        .delete()
        .eq('id', mediaItem.id);

      if (dbError) throw dbError;

      toast({
        title: t('success'),
        description: t('mediaDeleted')
      });
    } catch (error) {
      console.error('Error deleting media:', error);
      toast({
        title: t('error'),
        description: t('failedToDelete'),
        variant: "destructive"
      });
    }
  };

  const viewMedia = async (mediaItem: SharedMedia) => {
    const { data } = await supabase.storage
      .from('couple_media')
      .createSignedUrl(mediaItem.file_path, 3600);

    if (data?.signedUrl) {
      setViewingMedia(mediaItem);
      setViewingUrl(data.signedUrl);
    }
  };

  const getTimeSince = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins}m`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d`;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5 text-blue-500" />
            {t('mediaSharing')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Section */}
          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              {!selectedFile ? (
                <div className="space-y-3">
                  <div className="flex justify-center">
                    <Upload className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t('uploadPhotoVideo')}</p>
                    <p className="text-xs text-muted-foreground">{t('maxFileSize')}</p>
                  </div>
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                    {t('chooseFile')}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  {previewUrl && (
                    <div className="relative max-w-sm mx-auto">
                      {selectedFile.type.startsWith('image/') ? (
                        <img src={previewUrl} alt="Preview" className="rounded-lg w-full" />
                      ) : (
                        <video src={previewUrl} className="rounded-lg w-full" controls />
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2"
                        onClick={() => setSelectedFile(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="caption">{t('captionOptional')}</Label>
                    <Input
                      id="caption"
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder={t('addCaption')}
                    />
                  </div>
                  <Button onClick={uploadMedia} disabled={uploading} className="w-full">
                    {uploading ? t('uploading') : t('upload')}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Media Grid */}
          <div className="space-y-3">
            <p className="text-sm font-medium">{t('sharedMedia')}</p>
            {media.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                {t('noMediaYet')}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {media.map((item) => (
                  <MediaThumbnail
                    key={item.id}
                    item={item}
                    userId={userId}
                    partnerName={partnerName}
                    onView={viewMedia}
                    onDelete={deleteMedia}
                    getTimeSince={getTimeSince}
                  />
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Media Viewer Dialog */}
      {viewingMedia && viewingUrl && (
        <Dialog open={!!viewingMedia} onOpenChange={() => { setViewingMedia(null); setViewingUrl(null); }}>
          <DialogContent className="max-w-4xl">
            <div className="space-y-4">
              {viewingMedia.file_type === 'image' ? (
                <img src={viewingUrl} alt="Shared media" className="w-full rounded-lg" />
              ) : (
                <video src={viewingUrl} className="w-full rounded-lg" controls />
              )}
              {viewingMedia.caption && (
                <p className="text-sm text-muted-foreground">{viewingMedia.caption}</p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

interface MediaThumbnailProps {
  item: SharedMedia;
  userId: string;
  partnerName?: string;
  onView: (item: SharedMedia) => void;
  onDelete: (item: SharedMedia) => void;
  getTimeSince: (timestamp: string) => string;
}

const MediaThumbnail = ({ item, userId, partnerName, onView, onDelete, getTimeSince }: MediaThumbnailProps) => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const loadThumbnail = async () => {
      const { data } = await supabase.storage
        .from('couple_media')
        .createSignedUrl(item.file_path, 3600);

      if (data?.signedUrl) {
        setThumbnailUrl(data.signedUrl);
      }
    };

    loadThumbnail();
  }, [item.file_path]);

  return (
    <div className="relative group aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer" onClick={() => onView(item)}>
      {thumbnailUrl && (
        <>
          {item.file_type === 'image' ? (
            <img src={thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
          ) : (
            <div className="relative w-full h-full">
              <video src={thumbnailUrl} className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Video className="h-8 w-8 text-white" />
              </div>
            </div>
          )}
        </>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-0 left-0 right-0 p-2 text-white text-xs">
          <p className="font-medium">{item.uploaded_by === userId ? t('you') : partnerName}</p>
          <p>{getTimeSince(item.created_at)}</p>
        </div>
        {item.uploaded_by === userId && (
          <Button
            size="sm"
            variant="destructive"
            className="absolute top-2 right-2"
            onClick={(e) => { e.stopPropagation(); onDelete(item); }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
};