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
          // Generate signed URLs for all images with better error handling
          const urlPromises = data.map(async (img) => {
            try {
              const { data: signedUrl, error } = await supabase.storage
                .from("couple_media")
                .createSignedUrl(img.image_path, 86400); // 24 hours
              
              if (error) {
                console.error(`Failed to get signed URL for ${img.image_path}:`, error);
                return null;
              }
              
              return signedUrl?.signedUrl || null;
            } catch (error) {
              console.error(`Error generating signed URL for ${img.image_path}:`, error);
              return null;
            }
          });
          
          const urls = await Promise.allSettled(urlPromises);
          const validUrls = urls
            .filter(result => result.status === 'fulfilled' && result.value)
            .map(result => (result as PromiseFulfilledResult<string>).value);
          
          setBackgroundImages(validUrls);
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
    <div className="relative w-full h-full overflow-hidden pointer-events-none">
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
            className="w-full h-full object-cover object-center"
          />
        </div>
      ))}
    </div>
  );
};