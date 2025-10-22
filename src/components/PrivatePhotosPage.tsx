import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Lock, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PrivatePhoto {
  id: string;
  file_path: string;
  caption: string | null;
  uploaded_by: string;
  created_at: string;
}

interface PrivatePhotosPageProps {
  coupleId: string;
  userId: string;
  onClose: () => void;
}

export const PrivatePhotosPage = ({ coupleId, userId, onClose }: PrivatePhotosPageProps) => {
  const [photos, setPhotos] = useState<PrivatePhoto[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadPhotos();
  }, [coupleId]);

  const loadPhotos = async () => {
    const { data, error } = await supabase
      .from('shared_media')
      .select('*')
      .eq('couple_id', coupleId)
      .eq('file_type', 'private_photo')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPhotos(data);
    }
  };

  const uploadPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const filePath = `private/${coupleId}/${userId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('couple_media')
      .upload(filePath, file);

    if (uploadError) {
      toast({ title: "Error uploading photo", variant: "destructive" });
      setUploading(false);
      return;
    }

    const { error: dbError } = await supabase
      .from('shared_media')
      .insert({
        couple_id: coupleId,
        uploaded_by: userId,
        file_path: filePath,
        file_type: 'private_photo'
      });

    if (dbError) {
      toast({ title: "Error saving photo", variant: "destructive" });
    } else {
      toast({ title: "Photo uploaded!" });
      loadPhotos();
    }
    setUploading(false);
  };

  const deletePhoto = async (id: string, filePath: string) => {
    await supabase.storage.from('couple_media').remove([filePath]);
    await supabase.from('shared_media').delete().eq('id', id);
    loadPhotos();
  };

  const getPhotoUrl = async (path: string) => {
    const { data } = await supabase.storage.from('couple_media').createSignedUrl(path, 3600);
    return data?.signedUrl;
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Private Photos</h2>
        </div>
        <Button variant="ghost" onClick={onClose}>Close</Button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <label htmlFor="photo-upload">
            <Button className="w-full" disabled={uploading} asChild>
              <span>
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? "Uploading..." : "Upload Private Photo"}
              </span>
            </Button>
          </label>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={uploadPhoto}
          />

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo) => (
              <Card key={photo.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <img
                    src={`/api/placeholder/400/400`}
                    alt="Private"
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={async () => {
                      const url = await getPhotoUrl(photo.file_path);
                      if (url) setSelectedPhoto(url);
                    }}
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    {photo.uploaded_by === userId && (
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8"
                        onClick={() => deletePhoto(photo.id, photo.file_path)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <img src={selectedPhoto} alt="Full size" className="max-w-full max-h-full" />
        </div>
      )}
    </div>
  );
};
