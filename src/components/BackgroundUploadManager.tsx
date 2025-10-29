import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BackgroundUploadManagerProps {
  coupleId: string;
}

export const BackgroundUploadManager = ({ coupleId }: BackgroundUploadManagerProps) => {
  const [images, setImages] = useState<Array<{ id: string; url: string; path: string }>>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchImages();
  }, [coupleId]);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from("couple_background_images")
        .select("*")
        .eq("couple_id", coupleId)
        .order("display_order", { ascending: true });

      if (error) throw error;

      if (data) {
        const imagesWithUrls = await Promise.all(
          data.map(async (item) => {
            const { data: signedUrlData } = await supabase.storage
              .from("couple_media")
              .createSignedUrl(item.image_path, 3600);
            return {
              id: item.id,
              url: signedUrlData?.signedUrl || "",
              path: item.image_path,
            };
          })
        );
        setImages(imagesWithUrls.filter(img => img.url));
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (images.length >= 10) {
      toast({
        title: "Maximum reached",
        description: "You can only upload up to 10 background images",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${coupleId}/backgrounds/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("couple_media")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from("couple_background_images")
        .insert({
          couple_id: coupleId,
          image_path: filePath,
          display_order: images.length,
        });

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Background image uploaded successfully",
      });

      await fetchImages();
    } catch (error) {
      console.error("Error uploading:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload background image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, path: string) => {
    try {
      await supabase.storage.from("couple_media").remove([path]);
      
      const { error } = await supabase
        .from("couple_background_images")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Deleted",
        description: "Background image removed",
      });

      await fetchImages();
    } catch (error) {
      console.error("Error deleting:", error);
      toast({
        title: "Delete failed",
        description: "Failed to delete background image",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Background Slideshow ({images.length}/10)</h3>
        <Button
          onClick={() => document.getElementById("background-upload")?.click()}
          disabled={uploading || images.length >= 10}
          size="sm"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload
        </Button>
        <input
          id="background-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {images.map((image) => (
          <div key={image.id} className="relative group aspect-video">
            <img
              src={image.url}
              alt="Background"
              className="w-full h-full object-cover rounded-lg"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleDelete(image.id, image.path)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
