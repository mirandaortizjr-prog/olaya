import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SeasonalAnimationsProps {
  coupleId?: string;
}

export const SeasonalAnimations = ({ coupleId }: SeasonalAnimationsProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [leaves, setLeaves] = useState<Array<{ id: number; left: number; delay: number; duration: number }>>([]);
  const [hasActiveEffects, setHasActiveEffects] = useState(false);

  // Check for active visual effects
  useEffect(() => {
    if (!coupleId) return;

    const checkActiveEffects = async () => {
      const { data } = await supabase
        .from('active_effects')
        .select('id')
        .eq('couple_id', coupleId)
        .eq('is_active', true)
        .gt('expires_at', new Date().toISOString())
        .limit(1);

      setHasActiveEffects(data && data.length > 0);
    };

    checkActiveEffects();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('seasonal_effects_check')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'active_effects',
          filter: `couple_id=eq.${coupleId}`,
        },
        () => {
          checkActiveEffects();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [coupleId]);

  useEffect(() => {
    setCurrentMonth(new Date().getMonth());
    
    // Generate random leaves for autumn (September=8, October=9, November=10)
    if (currentMonth >= 8 && currentMonth <= 10) {
      const newLeaves = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 8 + Math.random() * 4,
      }));
      setLeaves(newLeaves);
    }
  }, [currentMonth]);

  // November = 10 (Thanksgiving month)
  const showTurkey = currentMonth === 10;
  // Autumn = September (8), October (9), November (10)
  const showLeaves = currentMonth >= 8 && currentMonth <= 10;

  // Don't show seasonal animations if visual effects are active
  if (hasActiveEffects) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {/* Thanksgiving Turkey */}
      {showTurkey && (
        <div className="absolute bottom-24 w-full">
          <div className="animate-walk-turkey">
            <span className="text-4xl">🦃</span>
          </div>
        </div>
      )}

      {/* Autumn Falling Leaves */}
      {showLeaves && leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="absolute -top-10 animate-fall-leaf"
          style={{
            left: `${leaf.left}%`,
            animationDelay: `${leaf.delay}s`,
            animationDuration: `${leaf.duration}s`,
          }}
        >
          <span className="text-2xl opacity-80">
            {['🍂', '🍁', '🍃'][Math.floor(Math.random() * 3)]}
          </span>
        </div>
      ))}
    </div>
  );
};
