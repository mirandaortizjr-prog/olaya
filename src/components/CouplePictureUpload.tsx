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
    <div className="relative group">
      <div className="w-40 h-40 rounded-full border-8 border-black overflow-hidden bg-[#F5E6D3] flex items-center justify-center">
        {currentPictureUrl ? (
          <img src={currentPictureUrl} alt="Couple" className="w-full h-full object-cover" />
        ) : (
          <span className="text-3xl">Photo</span>
        )}
      </div>
      <Button
        type="button"
        size="icon"
        className="absolute bottom-2 right-2 h-10 w-10 rounded-full bg-white shadow-lg hover:bg-gray-100"
        onClick={handleClick}
        disabled={uploading}
        aria-label="Upload couple picture"
      >
        {uploading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Camera className="h-5 w-5" />
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
  );
};
