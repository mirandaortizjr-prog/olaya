import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Camera, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CouplePictureUploadProps {
  coupleId: string;
  currentPictureUrl?: string;
  onUploadComplete: (url: string) => void;
}

export const CouplePictureUpload = ({
  coupleId,
  currentPictureUrl,
  onUploadComplete,
}: CouplePictureUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadCouplePicture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${coupleId}/${Date.now()}.${fileExt}`;

      // Upload to couple_media bucket
      const { error: uploadError } = await supabase.storage
        .from("couple_media")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("couple_media")
        .getPublicUrl(filePath);

      // Update couple record with picture URL
      const { error: updateError } = await supabase
        .from("couples")
        .update({ couple_picture_url: urlData.publicUrl })
        .eq("id", coupleId);

      if (updateError) throw updateError;

      onUploadComplete(urlData.publicUrl);

      toast({
        title: "Success! 💕",
        description: "Your couple picture has been updated",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <Avatar className="h-24 w-24 ring-4 ring-primary/20 transition-all group-hover:ring-primary/40">
          <AvatarImage src={currentPictureUrl || undefined} alt="Couple" />
          <AvatarFallback className="bg-gradient-romantic text-white text-3xl">
            💑
          </AvatarFallback>
        </Avatar>
        <label
          htmlFor="couple-picture-upload"
          className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-white cursor-pointer hover:bg-primary/90 transition-all shadow-lg group-hover:scale-110"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
        </label>
        <input
          id="couple-picture-upload"
          type="file"
          accept="image/*"
          onChange={uploadCouplePicture}
          disabled={uploading}
          className="hidden"
        />
      </div>
      <p className="text-sm text-muted-foreground text-center">
        Click the camera icon to upload your couple picture
      </p>
    </div>
  );
};
