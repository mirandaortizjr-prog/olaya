import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import flowerBouquet1 from "@/assets/gifts/flower-bouquet-1.png";
import flowerBouquet2 from "@/assets/gifts/flower-bouquet-2.png";
import flowerBouquet3 from "@/assets/gifts/flower-bouquet-3.png";
import flowerBouquet4 from "@/assets/gifts/flower-bouquet-4.png";
import flowerBouquet5 from "@/assets/gifts/flower-bouquet-5.png";
import flowerBouquet6 from "@/assets/gifts/flower-bouquet-6.png";
import flowerBouquet7 from "@/assets/gifts/flower-bouquet-7.png";
import singleRedRose from "@/assets/gifts/single-red-rose.png";
import pinkHeartBox from "@/assets/gifts/pink-heart-box.png";
import redRoseWrap from "@/assets/gifts/red-rose-wrap.png";
import pinkPurpleBouquet from "@/assets/gifts/pink-purple-bouquet.png";
import hotPinkRoseBouquet from "@/assets/gifts/hot-pink-rose-bouquet.png";
import colorfulSpringBouquet from "@/assets/gifts/colorful-spring-bouquet.png";

const flowerImages: { [key: string]: string } = {
  'flower-bouquet-1': flowerBouquet1,
  'flower-bouquet-2': flowerBouquet2,
  'flower-bouquet-3': flowerBouquet3,
  'flower-bouquet-4': flowerBouquet4,
  'flower-bouquet-5': flowerBouquet5,
  'flower-bouquet-6': flowerBouquet6,
  'flower-bouquet-7': flowerBouquet7,
  'single-red-rose': singleRedRose,
  'pink-heart-box': pinkHeartBox,
  'red-rose-wrap': redRoseWrap,
  'pink-purple-bouquet': pinkPurpleBouquet,
  'hot-pink-rose-bouquet': hotPinkRoseBouquet,
  'colorful-spring-bouquet': colorfulSpringBouquet,
};

interface PurchasedGift {
  id: string;
  gift_name: string;
  gift_image: string;
  purchased_at: string;
}

interface FloatingGiftsProps {
  coupleId: string;
}

const FloatingGifts = ({ coupleId }: FloatingGiftsProps) => {
  const [activeGifts, setActiveGifts] = useState<PurchasedGift[]>([]);
  const [currentGiftIndex, setCurrentGiftIndex] = useState(0);

  useEffect(() => {
    if (!coupleId) return;

    const fetchActiveGifts = async () => {
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

      const { data, error } = await supabase
        .from('purchased_gifts')
        .select('*')
        .eq('couple_id', coupleId)
        .gte('purchased_at', twentyFourHoursAgo.toISOString())
        .order('purchased_at', { ascending: true });

      if (!error && data) {
        setActiveGifts(data);
      }
    };

    fetchActiveGifts();

    // Subscribe to new gifts
    const channel = supabase
      .channel('purchased_gifts_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'purchased_gifts',
          filter: `couple_id=eq.${coupleId}`,
        },
        (payload) => {
          const newGift = payload.new as PurchasedGift;
          setActiveGifts((prev) => [...prev, newGift]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [coupleId]);

  // Rotate gifts every 10 seconds
  useEffect(() => {
    if (activeGifts.length === 0) return;

    const interval = setInterval(() => {
      setCurrentGiftIndex((prev) => (prev + 1) % activeGifts.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [activeGifts.length]);

  if (activeGifts.length === 0) return null;

  const currentGift = activeGifts[currentGiftIndex];
  const giftImage = flowerImages[currentGift.gift_image];

  return (
    <div className="fixed bottom-24 right-4 z-20 animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-primary/50 blur-xl animate-pulse" />
        <div className="relative w-16 h-16 rounded-full bg-background/80 backdrop-blur-sm border-2 border-primary shadow-lg flex items-center justify-center overflow-hidden">
          {giftImage ? (
            <img
              src={giftImage}
              alt={currentGift.gift_name}
              className="w-12 h-12 object-contain"
            />
          ) : (
            <span className="text-2xl">💝</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FloatingGifts;
