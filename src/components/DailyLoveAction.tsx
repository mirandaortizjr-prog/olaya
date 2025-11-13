import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, CheckCircle2, X, Sparkles } from 'lucide-react';
import { getDailyAction, DailyAction } from '@/lib/loveLanguages/dailyActions';
import { getBasicDailyAction, BasicDailyAction } from '@/lib/loveLanguages/basicDailyActions';
import { LoveLanguageScore } from '@/lib/loveLanguages/scoring';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSubscription } from '@/hooks/useSubscription';
import { useNavigate } from 'react-router-dom';
import { translations } from '@/lib/translations';

interface DailyLoveActionProps {
  userId: string;
  partnerUserId: string | null;
  onOpenGames?: () => void;
}

export const DailyLoveAction = ({ userId, partnerUserId, onOpenGames }: DailyLoveActionProps) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isPremium, isLoading: isPremiumLoading } = useSubscription(userId);
  const t = translations[language as 'en' | 'es'];
  const [isOpen, setIsOpen] = useState(false);
  const [currentDay, setCurrentDay] = useState(1);
  const [todayAction, setTodayAction] = useState<DailyAction | null>(null);
  const [basicAction, setBasicAction] = useState<BasicDailyAction | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [partnerLanguages, setPartnerLanguages] = useState<LoveLanguageScore[] | null>(null);

  useEffect(() => {
    if (partnerUserId) {
      loadData();
    }
  }, [userId, partnerUserId]);

  const loadData = async () => {
    if (!partnerUserId) return;

    // Load partner's quiz data first
    const { data: partnerData } = await supabase
      .from('love_languages')
      .select('all_scores')
      .eq('user_id', partnerUserId)
      .maybeSingle();

    let loadedPartnerLanguages: LoveLanguageScore[] | null = null;
    if (partnerData?.all_scores) {
      loadedPartnerLanguages = partnerData.all_scores as unknown as LoveLanguageScore[];
      setPartnerLanguages(loadedPartnerLanguages);
    }

    // Then load user's daily progress
    const { data: progressData } = await supabase
      .from('love_languages')
      .select('current_day, last_action_date')
      .eq('user_id', userId)
      .maybeSingle();

    if (progressData) {
      const day = progressData.current_day || 1;
      setCurrentDay(day);

      const today = new Date().toISOString().split('T')[0];
      setIsCompleted(progressData.last_action_date === today);

      // Set the action only after we have the partner's data
      if (isPremium && loadedPartnerLanguages) {
        const action = getDailyAction(day, loadedPartnerLanguages);
        setTodayAction(action);
      } else if (!isPremium) {
        const action = getBasicDailyAction(day);
        setBasicAction(action);
      }
    }
  };

  useEffect(() => {
    if (isPremium && partnerLanguages && currentDay) {
      const action = getDailyAction(currentDay, partnerLanguages);
      setTodayAction(action);
    } else if (!isPremium && currentDay) {
      const action = getBasicDailyAction(currentDay);
      setBasicAction(action);
    }
  }, [partnerLanguages, currentDay, isPremium]);

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
        title: t.dailyLoveError || 'Error',
        description: t.dailyLoveFailedComplete || 'Failed to mark action as complete',
        variant: 'destructive'
      });
      return;
    }

    setIsCompleted(true);
    setIsOpen(false);
    toast({
      title: t.dailyLoveCompleted || '💝 Action Completed!',
      description: t.dailyLoveCompletedDesc?.replace('{day}', currentDay.toString()) || `Day ${currentDay}/365 complete! Come back tomorrow for your next action.`
    });
  };

  if (!partnerUserId || isPremiumLoading) {
    return null;
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
            <span className="font-semibold text-white">{t.dailyLoveTitle || 'Daily Love Action'}</span>
            {isCompleted && (
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            )}
          </div>
          <div className="text-center mt-1">
            <span className="text-xs text-white/70">
              {t.dailyLoveDay || 'Day'} {currentDay}/365
            </span>
          </div>
        </button>
      ) : (
        <div className="w-full bg-card rounded-lg border border-border p-6 space-y-4 animate-scale-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">{t.dailyLoveTodayAction || "Today's Love Action"}</h3>
              {!isPremium && (
                <span className="text-xs bg-muted px-2 py-1 rounded-full">{t.dailyLoveBasic || 'Basic'}</span>
              )}
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

          {/* Premium user without partner's quiz data */}
          {isPremium && !todayAction ? (
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground text-center">
                  {t.dailyLovePartnerQuizNeeded || 'Your partner needs to complete the Love Language Quiz in Games to unlock personalized actions'}
                </p>
              </div>
              <Button
                onClick={() => {
                  setIsOpen(false);
                  onOpenGames?.();
                }}
                className="w-full"
                variant="outline"
              >
                {t.dailyLoveGoToGames || 'Go to Games'}
              </Button>
            </div>
          ) : (
            <>
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-base leading-relaxed">
                  {isPremium && todayAction 
                    ? todayAction.action[language as 'en' | 'es']
                    : basicAction?.action[language as 'en' | 'es']
                  }
                </p>
              </div>

              <div className="text-sm text-muted-foreground">
                {t.dailyLoveDay || 'Day'} {currentDay} {t.dailyLoveOf || 'of'} 365 • {isPremium && todayAction ? todayAction.timeRequired : basicAction?.timeRequired}
              </div>

              {/* Upgrade prompt for free users */}
              {!isPremium && (
                <div className="p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-lg border border-amber-500/20">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 space-y-2">
                      <p className="text-sm font-medium text-foreground">
                        {t.dailyLoveGetTailored || 'Get Tailored Love Actions'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t.dailyLoveUpgradeDesc || "Upgrade to Premium for personalized daily actions based on your partner's unique love languages"}
                      </p>
                      <Button
                        onClick={() => navigate('/premium-plans')}
                        size="sm"
                        className="w-full mt-2"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        {t.dailyLoveUpgradePremium || 'Upgrade to Premium'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {!isCompleted ? (
                <Button
                  onClick={markAsComplete}
                  className="w-full"
                  size="lg"
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  {t.dailyLoveMarkFulfilled || 'Mark as Fulfilled'}
                </Button>
              ) : (
                <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 py-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-semibold">{t.dailyLoveCompletedToday || 'Completed for today!'}</span>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
