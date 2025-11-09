import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
      
      // Force re-render of particles for preview
      if (previewEffect) {
        const timer = setInterval(() => {
          setParticles(Array.from({ length: 20 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 5,
            duration: 8 + Math.random() * 4,
          })));
        }, 100);
        
        return () => clearInterval(timer);
      }
    } else {
      setParticles([]);
    }
  }, [activeEffects, previewEffect]);

  const effectsToRender = previewEffect ? [previewEffect] : activeEffects;
  
  if (effectsToRender.length === 0) return null;

  const getEmoji = (name: string, type: string) => {
    if (type === 'phrase') return name;
    
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

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {effectsToRender.map((effect) =>
        particles.map((particle) => (
          <div
            key={`${effect.id}-${particle.id}`}
            className={`absolute -top-10 ${getAnimation(effect.visual_effects.animation)}`}
            style={{
              left: `${particle.left}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          >
            <span
              className={`
                ${effect.visual_effects.effect_type === 'phrase' ? 'text-base font-bold' : 'text-3xl'}
                opacity-90 drop-shadow-lg
                ${effect.visual_effects.behavior.includes('pulse') ? 'animate-pulse' : ''}
                ${effect.visual_effects.behavior.includes('shimmer') ? 'animate-shimmer' : ''}
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
              {getEmoji(effect.visual_effects.name, effect.visual_effects.effect_type)}
            </span>
          </div>
        ))
      )}
    </div>
  );
};
