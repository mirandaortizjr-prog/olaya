import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface GalleryUploadButtonProps {
  coupleId: string;
  userId: string;
}

export const GalleryUploadButton = ({ coupleId, userId }: GalleryUploadButtonProps) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      const fileType = file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : null;

      if (!fileType) {
        toast({
          title: t('error'),
          description: t('onlyImagesVideos'),
          variant: "destructive",
        });
        return;
      }

      const maxSize = fileType === 'video' ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
      if (file.size > maxSize) {
        toast({
          title: t('error'),
          description: fileType === 'video' ? 'Videos must be under 50MB' : 'Images must be under 10MB',
          variant: "destructive",
        });
        return;
      }

      const fileExt = file.name.split(".").pop();
      const filePath = `${coupleId}/${userId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("couple_media")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase
        .from("shared_media")
        .insert({
          couple_id: coupleId,
          uploaded_by: userId,
          file_path: filePath,
          file_type: fileType,
          caption: null,
        });

      if (insertError) throw insertError;

      toast({
        title: t('success'),
        description: t('mediaUploaded'),
      });

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <h3 className="font-medium">{t('uploadToGallery')}</h3>
        <p className="text-sm text-muted-foreground">{t('uploadPhotosToGallery')}</p>
      </div>
      <Button
        onClick={handleClick}
        disabled={uploading}
        variant="outline"
      >
        {uploading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            {t('uploading')}
          </>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            {t('upload')}
          </>
        )}
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFileUpload}
        disabled={uploading}
        className="hidden"
      />
    </div>
  );
};
