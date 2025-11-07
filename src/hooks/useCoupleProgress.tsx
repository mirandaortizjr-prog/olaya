import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface CoupleProgress {
  currentLevel: number;
  totalExperience: number;
  experienceForNextLevel: number;
}

export const useCoupleProgress = (coupleId: string | null) => {
  const [progress, setProgress] = useState<CoupleProgress>({
    currentLevel: 1,
    totalExperience: 0,
    experienceForNextLevel: 100
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    if (!coupleId) {
      setLoading(false);
      return;
    }

    loadProgress();

    // Subscribe to progress updates
    const channel = supabase
      .channel('couple-progress-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'couple_progress',
          filter: `couple_id=eq.${coupleId}`
        },
        () => {
          loadProgress();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [coupleId]);

  const loadProgress = async () => {
    if (!coupleId) return;

    try {
      const { data, error } = await supabase
        .from('couple_progress')
        .select('*')
        .eq('couple_id', coupleId)
        .maybeSingle();

      if (error) {
        console.error('Error loading couple progress:', error);
        setLoading(false);
        return;
      }

      if (data) {
        setProgress({
          currentLevel: data.current_level,
          totalExperience: data.total_experience,
          experienceForNextLevel: 100 * data.current_level // Linear progression
        });
      } else {
        // Initialize progress for new couple
        const { data: newProgress, error: insertError } = await supabase
          .from('couple_progress')
          .insert({ couple_id: coupleId })
          .select()
          .single();

        if (!insertError && newProgress) {
          setProgress({
            currentLevel: 1,
            totalExperience: 0,
            experienceForNextLevel: 100
          });
        }
      }
    } catch (error) {
      console.error('Error in loadProgress:', error);
    } finally {
      setLoading(false);
    }
  };

  const addExperience = async (experienceGained: number) => {
    if (!coupleId) return;

    try {
      // Call the database function to update progress
      const { data, error } = await supabase.rpc('update_couple_progress', {
        p_couple_id: coupleId,
        p_experience_gained: experienceGained
      });

      if (error) {
        console.error('Error updating progress:', error);
        toast({
          title: t('error'),
          description: 'Failed to update progress',
          variant: 'destructive'
        });
        return;
      }

      if (data && data.length > 0) {
        const result = data[0];
        
        // Show level up notification
        if (result.leveled_up) {
          toast({
            title: t('levelUp'),
            description: `${t('youReachedLevel')} ${result.new_level}! 🎉`,
            duration: 5000,
          });
        } else {
          toast({
            title: `+${experienceGained} ${t('experience')}`,
            description: `${t('level')} ${progress.currentLevel} • ${result.new_experience}/${100 * progress.currentLevel} ${t('experience')}`,
            duration: 3000,
          });
        }

        // Reload progress
        await loadProgress();
      }
    } catch (error) {
      console.error('Error adding experience:', error);
    }
  };

  return {
    progress,
    loading,
    addExperience
  };
};
