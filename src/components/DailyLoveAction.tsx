import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, CheckCircle2, X } from 'lucide-react';
import { getDailyAction, DailyAction } from '@/lib/loveLanguages/dailyActions';
import { LoveLanguageScore } from '@/lib/loveLanguages/scoring';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DailyLoveActionProps {
  userId: string;
  partnerUserId: string | null;
}

export const DailyLoveAction = ({ userId, partnerUserId }: DailyLoveActionProps) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [currentDay, setCurrentDay] = useState(1);
  const [todayAction, setTodayAction] = useState<DailyAction | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [partnerLanguages, setPartnerLanguages] = useState<LoveLanguageScore[] | null>(null);

  useEffect(() => {
    if (partnerUserId) {
      loadPartnerLanguages();
      loadDailyProgress();
    }
  }, [userId, partnerUserId]);

  const loadPartnerLanguages = async () => {
    if (!partnerUserId) return;

    const { data } = await supabase
      .from('love_languages')
      .select('all_scores')
      .eq('user_id', partnerUserId)
      .maybeSingle();

    if (data?.all_scores) {
      setPartnerLanguages(data.all_scores as unknown as LoveLanguageScore[]);
    }
  };

  const loadDailyProgress = async () => {
    const { data } = await supabase
      .from('love_languages')
      .select('current_day, last_action_date')
      .eq('user_id', userId)
      .maybeSingle();

    if (data) {
      const day = data.current_day || 1;
      setCurrentDay(day);

      const today = new Date().toISOString().split('T')[0];
      setIsCompleted(data.last_action_date === today);

      if (partnerLanguages) {
        const action = getDailyAction(day, partnerLanguages);
        setTodayAction(action);
      }
    }
  };

  useEffect(() => {
    if (partnerLanguages) {
      const action = getDailyAction(currentDay, partnerLanguages);
      setTodayAction(action);
    }
  }, [partnerLanguages, currentDay]);

  const markAsComplete = async () => {
    const today = new Date().toISOString().split('T')[0];
    const nextDay = currentDay >= 365 ? 1 : currentDay + 1;

    const { error } = await supabase
      .from('love_languages')
      .update({
        current_day: nextDay,
        last_action_date: today
      })
      .eq('user_id', userId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to mark action as complete',
        variant: 'destructive'
      });
      return;
    }

    setIsCompleted(true);
    setIsOpen(false);
    toast({
      title: '💝 Action Completed!',
      description: `Day ${currentDay}/365 complete! Come back tomorrow for your next action.`
    });
  };

  if (!partnerUserId) {
    return null;
  }

  if (!todayAction) {
    return (
      <div className="w-full p-4 bg-muted/50 rounded-lg border border-border">
        <div className="flex items-center gap-3">
          <Heart className="w-5 h-5 text-muted-foreground" />
          <div>
            <p className="font-semibold text-foreground">Daily Love Action</p>
            <p className="text-sm text-muted-foreground">Your partner needs to complete the Love Language Quiz in Games first</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full p-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg border border-border/50 hover:border-purple-500/50 transition-all group"
        >
          <div className="flex items-center justify-center gap-3">
            <Heart className="w-5 h-5 text-white" />
            <span className="font-semibold text-white">Daily Love Action</span>
            {isCompleted && (
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            )}
          </div>
          <div className="text-center mt-1">
            <span className="text-xs text-white/70">
              Day {currentDay}/365
            </span>
          </div>
        </button>
      ) : (
        <div className="w-full bg-card rounded-lg border border-border p-6 space-y-4 animate-scale-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">Today's Love Action</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-base leading-relaxed">
              {todayAction.action[language as 'en' | 'es']}
            </p>
          </div>

          <div className="text-sm text-muted-foreground">
            Day {currentDay} of 365 • {todayAction.timeRequired}
          </div>

          {!isCompleted ? (
            <Button
              onClick={markAsComplete}
              className="w-full"
              size="lg"
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Mark as Fulfilled
            </Button>
          ) : (
            <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 py-2">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-semibold">Completed for today!</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
