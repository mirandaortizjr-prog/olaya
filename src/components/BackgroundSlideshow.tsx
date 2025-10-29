import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface BackgroundSlideshowProps {
  coupleId: string;
}

export const BackgroundSlideshow = ({ coupleId }: BackgroundSlideshowProps) => {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBackgroundImages();
  }, [coupleId]);

  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  const fetchBackgroundImages = async () => {
    try {
      const { data, error } = await supabase
        .from("couple_background_images")
        .select("image_path")
        .eq("couple_id", coupleId)
        .order("display_order", { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        const signedUrls = await Promise.all(
          data.map(async (item) => {
            const { data: signedUrlData } = await supabase.storage
              .from("couple_media")
              .createSignedUrl(item.image_path, 3600);
            return signedUrlData?.signedUrl || "";
          })
        );
        setImages(signedUrls.filter(url => url));
      }
    } catch (error) {
      console.error("Error fetching background images:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || images.length === 0) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 animate-pulse" />
    );
  }

  return (
    <div className="relative w-full h-full">
      {images.map((url, index) => (
        <img
          key={index}
          src={url}
          alt={`Background ${index + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
};
