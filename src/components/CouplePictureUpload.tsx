import { useState, useRef } from "react";
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

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

      // Create a signed URL for immediate display
      const { data: signedData } = await supabase.storage
        .from("couple_media")
        .createSignedUrl(filePath, 60 * 60 * 24 * 7); // 7 days

      // Store the storage path in DB (bucket/path)
      const storagePath = `couple_media/${filePath}`;

      // Update couple record with storage path
      const { error: updateError } = await supabase
        .from("couples")
        .update({ couple_picture_url: storagePath })
        .eq("id", coupleId);

      if (updateError) throw updateError;

      // Inform UI with a signed URL for immediate display
      onUploadComplete(signedData?.signedUrl || "");

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
        <Button
          type="button"
          size="icon"
          className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg group-hover:scale-110"
          onClick={handleClick}
          disabled={uploading}
          aria-label="Upload couple picture"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
        </Button>
        <input
          ref={fileInputRef}
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
