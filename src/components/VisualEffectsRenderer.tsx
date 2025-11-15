import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import cyanSnowflake from '@/assets/effects/cyan-snowflake.png';
import pinkSnowflake from '@/assets/effects/pink-snowflake.png';
import roseHeart from '@/assets/effects/rose-heart.png';
import glowingHeart from '@/assets/effects/glowing-heart.png';
import loveCupcake from '@/assets/effects/love-cupcake.png';
import voodooDoll from '@/assets/effects/voodoo-doll.png';
import neonRose from '@/assets/effects/neon-rose.png';
import pinkButterfly from '@/assets/effects/pink-butterfly.png';
import angelWings from '@/assets/effects/angel-wings.png';

interface ActiveEffect {
  id: string;
  effect_id: string;
  expires_at: string;
  visual_effects: {
    name: string;
    effect_type: string;
    animation: string;
    behavior: string;
  };
}

interface Effect {
  id: number;
  left: number;
  delay: number;
  duration: number;
}

interface Props {
  coupleId: string;
  previewEffect?: ActiveEffect;
}

export const VisualEffectsRenderer = ({ coupleId, previewEffect }: Props) => {
  const [activeEffects, setActiveEffects] = useState<ActiveEffect[]>([]);
  const [particles, setParticles] = useState<Effect[]>([]);

  useEffect(() => {
    if (!coupleId) return;

    const fetchActiveEffects = async () => {
      const { data } = await supabase
        .from('active_effects')
        .select('*, visual_effects(*)')
        .eq('couple_id', coupleId)
        .eq('is_active', true)
        .gt('expires_at', new Date().toISOString());

      if (data) {
        setActiveEffects(data as ActiveEffect[]);
      }
    };

    fetchActiveEffects();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('active_effects_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'active_effects',
          filter: `couple_id=eq.${coupleId}`,
        },
        () => {
          fetchActiveEffects();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [coupleId]);

  useEffect(() => {
    const effectsToRender = previewEffect ? [previewEffect] : activeEffects;
    
    if (effectsToRender.length > 0) {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 8 + Math.random() * 4,
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [activeEffects, previewEffect]);

  const effectsToRender = previewEffect ? [previewEffect] : activeEffects;
  
  if (effectsToRender.length === 0) return null;

  const getImage = (name: string) => {
    const imageMap: Record<string, string> = {
      'Cyan Snowflake': cyanSnowflake,
      'Pink Snowflake': pinkSnowflake,
      'Rose Heart': roseHeart,
      'Glowing Heart': glowingHeart,
      'Love Cupcake': loveCupcake,
      'Voodoo Doll': voodooDoll,
      'Neon Rose': neonRose,
      'Pink Butterfly': pinkButterfly,
      'Angel Wings': angelWings,
    };
    return imageMap[name];
  };

  const getEmoji = (name: string, type: string) => {
    if (type === 'phrase') return name;
    if (type === 'image') return null; // Images are handled separately
    
    const emojiMap: Record<string, string> = {
      'Falling Hearts': '💗',
      'Rose Petals': '🌸',
      'Feathers': '🪶',
      'Lantern Sparks': '✨',
      'Starbursts': '⭐',
      'Light Orbs': '💫',
      'Halo Rings': '⭕',
      'Butterflies': '🦋',
      'Moon Dust': '🌙',
      'Cupid Arrows': '💘',
      'Lockets': '🔒',
      'Infinity Symbols': '∞',
      'Silhouettes': '👥',
      'Mirrored Hearts': '💕',
    };
    return emojiMap[name] || '💖';
  };

  const getNeonColor = (behavior: string) => {
    if (behavior.includes('neon pink')) return '#ff006e';
    if (behavior.includes('neon purple')) return '#a855f7';
    if (behavior.includes('neon blue')) return '#3b82f6';
    if (behavior.includes('neon yellow')) return '#fbbf24';
    return '#ffffff';
  };

  const getAnimation = (animation: string) => {
    const animationMap: Record<string, string> = {
      falling: 'animate-fall-leaf',
      floating: 'animate-float',
      flutter: 'animate-flutter',
      fade: 'animate-fade-in',
    };
    return animationMap[animation] || 'animate-fall-leaf';
  };

  const getAdditionalAnimation = (behavior: string) => {
    if (behavior.includes('shimmer') || behavior.includes('blink') || behavior.includes('flicker')) {
      return 'animate-shimmer';
    }
    if (behavior.includes('pulse') || behavior.includes('glow')) {
      return 'animate-pulse';
    }
    return '';
  };
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {effectsToRender.map((effect) =>
        particles.map((particle) => {
          const imageSrc = effect.visual_effects.effect_type === 'image' 
            ? getImage(effect.visual_effects.name) 
            : null;
          const emoji = getEmoji(effect.visual_effects.name, effect.visual_effects.effect_type);

          return (
            <div
              key={`${effect.id}-${particle.id}`}
              className={`absolute -top-10 ${getAnimation(effect.visual_effects.animation)}`}
              style={{
                left: `${particle.left}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
              }}
            >
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt={effect.visual_effects.name}
                  className={`w-12 h-12 opacity-90 drop-shadow-2xl ${getAdditionalAnimation(effect.visual_effects.behavior)}`}
                />
              ) : (
                <span
                  className={`
                    ${effect.visual_effects.effect_type === 'phrase' ? 'text-base font-bold' : 'text-3xl'}
                    text-foreground opacity-90 drop-shadow-lg
                    ${getAdditionalAnimation(effect.visual_effects.behavior)}
                  `}
                  style={{
                    color: effect.visual_effects.effect_type === 'phrase' 
                      ? getNeonColor(effect.visual_effects.behavior)
                      : 'inherit',
                    textShadow: effect.visual_effects.effect_type === 'phrase'
                      ? `0 0 20px ${getNeonColor(effect.visual_effects.behavior)}, 0 0 30px ${getNeonColor(effect.visual_effects.behavior)}`
                      : '0 0 10px rgba(255, 255, 255, 0.5)',
                  }}
                >
                  {emoji}
                </span>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};
