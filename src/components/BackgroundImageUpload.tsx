import { useState, useRef } from "react";
import { Upload, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BackgroundImageUploadProps {
  coupleId: string;
  backgroundImages: Array<{ id: string; url: string; imagePath: string }>;
  onUploadComplete: () => void;
}

export const BackgroundImageUpload = ({
  coupleId,
  backgroundImages,
  onUploadComplete,
}: BackgroundImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadBackgroundImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${coupleId}/backgrounds/${Math.random()}.${fileExt}`;

      // Check if we already have 10 images
      if (backgroundImages.length >= 10) {
        toast.error("Maximum 10 background images allowed");
        return;
      }

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("couple_media")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the highest display order
      const maxOrder = backgroundImages.length > 0
        ? Math.max(...backgroundImages.map((_, i) => i))
        : -1;

      // Save to database
      const { error: dbError } = await supabase
        .from("couple_background_images")
        .insert({
          couple_id: coupleId,
          image_path: filePath,
          display_order: maxOrder + 1,
        });

      if (dbError) throw dbError;

      toast.success("Background image uploaded successfully!");
      onUploadComplete();
    } catch (error: any) {
      toast.error(error.message || "Error uploading background image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const deleteBackgroundImage = async (imageId: string, imagePath: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("couple_media")
        .remove([imagePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from("couple_background_images")
        .delete()
        .eq("id", imageId);

      if (dbError) throw dbError;

      toast.success("Background image deleted");
      onUploadComplete();
    } catch (error: any) {
      toast.error(error.message || "Error deleting background image");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Background Images ({backgroundImages.length}/10)</h3>
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || backgroundImages.length >= 10}
          variant="outline"
          size="sm"
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? "Uploading..." : "Add Image"}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={uploadBackgroundImage}
          className="hidden"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {backgroundImages.map((image, index) => (
          <div key={image.id} className="relative group">
            <img
              src={image.url}
              alt={`Background ${index + 1}`}
              className="w-full h-24 object-cover rounded-lg"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7"
              onClick={() => deleteBackgroundImage(image.id, image.imagePath)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <div className="absolute bottom-1 left-1 bg-background/80 px-2 py-0.5 rounded text-xs">
              {index + 1}
            </div>
          </div>
        ))}
      </div>

      {backgroundImages.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">
          No background images yet. Add up to 10 images that will rotate every 5 seconds.
        </p>
      )}
    </div>
  );
};