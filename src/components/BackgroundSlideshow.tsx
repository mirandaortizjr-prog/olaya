import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface BackgroundSlideshowProps {
  coupleId: string;
}

export const BackgroundSlideshow = ({ coupleId }: BackgroundSlideshowProps) => {
  const [backgroundImages, setBackgroundImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBackgroundImages = async () => {
      try {
        // Fetch background images from database
        const { data, error } = await supabase
          .from("couple_background_images")
          .select("image_path")
          .eq("couple_id", coupleId)
          .order("display_order", { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          // Generate signed URLs for all images
          const urls = await Promise.all(
            data.map(async (img) => {
              const { data: signedUrl } = await supabase.storage
                .from("couple_media")
                .createSignedUrl(img.image_path, 3600);
              return signedUrl?.signedUrl || "";
            })
          );
          
          setBackgroundImages(urls.filter(url => url !== ""));
        }
      } catch (error) {
        console.error("Error loading background images:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBackgroundImages();

    // Set up realtime subscription for background image changes
    const channel = supabase
      .channel("background-images-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "couple_background_images",
          filter: `couple_id=eq.${coupleId}`,
        },
        () => {
          loadBackgroundImages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [coupleId]);

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    if (backgroundImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  if (isLoading) {
    return (
      <div className="w-full h-full bg-muted/50 animate-pulse" />
    );
  }

  if (backgroundImages.length === 0) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20" />
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {backgroundImages.map((url, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={url}
            alt={`Background ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
};