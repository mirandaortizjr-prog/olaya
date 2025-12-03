import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, CheckCircle2, Sparkles, Clock, Star } from 'lucide-react';
import { getDailyAction, DailyAction } from '@/lib/loveLanguages/dailyActions';
import { getBasicDailyAction, BasicDailyAction } from '@/lib/loveLanguages/basicDailyActions';
import { LoveLanguageScore } from '@/lib/loveLanguages/scoring';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSubscription } from '@/hooks/useSubscription';
import { useNavigate } from 'react-router-dom';

interface DailyLoveActionBookProps {
  userId: string;
  partnerUserId: string | null;
  onOpenGames?: () => void;
}

export const DailyLoveActionBook = ({ userId, partnerUserId, onOpenGames }: DailyLoveActionBookProps) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isPremium, isLoading: isPremiumLoading } = useSubscription(userId);
  
  const [currentDay, setCurrentDay] = useState(1);
  const [todayAction, setTodayAction] = useState<DailyAction | null>(null);
  const [basicAction, setBasicAction] = useState<BasicDailyAction | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [partnerLanguages, setPartnerLanguages] = useState<LoveLanguageScore[] | null>(null);
  const [loading, setLoading] = useState(true);

  const t = {
    en: {
      title: "Today's Love Action",
      subtitle: "An action tailored for your partner",
      basicSubtitle: "A general action to strengthen your bond",
      day: "Day",
      of: "of",
      markFulfilled: "Mark as Fulfilled",
      completedToday: "Completed for today!",
      partnerQuizNeeded: "Your partner needs to complete the Love Language Quiz to unlock personalized actions.",
      goToGames: "Go to Games",
      upgradePremium: "Upgrade to Premium",
      upgradeDesc: "Get personalized daily actions based on your partner's love languages",
      basic: "Basic",
      loading: "Loading your daily action...",
    },
    es: {
      title: "Acción de Amor de Hoy",
      subtitle: "Una acción personalizada para tu pareja",
      basicSubtitle: "Una acción general para fortalecer su vínculo",
      day: "Día",
      of: "de",
      markFulfilled: "Marcar como Cumplido",
      completedToday: "¡Completado hoy!",
      partnerQuizNeeded: "Tu pareja necesita completar el Quiz de Lenguaje del Amor.",
      goToGames: "Ir a Juegos",
      upgradePremium: "Mejorar a Premium",
      upgradeDesc: "Obtén acciones diarias personalizadas basadas en los lenguajes de amor de tu pareja",
      basic: "Básico",
      loading: "Cargando tu acción diaria...",
    }
  };

  const texts = t[language as 'en' | 'es'] || t.en;

  useEffect(() => {
    if (partnerUserId) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [userId, partnerUserId]);

  const loadData = async () => {
    if (!partnerUserId) return;

    try {
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

        if (isPremium && loadedPartnerLanguages) {
          const action = getDailyAction(day, loadedPartnerLanguages);
          setTodayAction(action);
        } else if (!isPremium) {
          const action = getBasicDailyAction(day);
          setBasicAction(action);
        }
      } else {
        if (!isPremium) {
          const action = getBasicDailyAction(1);
          setBasicAction(action);
        }
      }
    } finally {
      setLoading(false);
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
    const nextDay = currentDay >= 1825 ? 1 : currentDay + 1;

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
    toast({
      title: '💝 Action Completed!',
      description: `Day ${currentDay}/1825 complete!`
    });
  };

  if (loading || isPremiumLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Heart className="w-8 h-8 text-pink-500 animate-pulse mx-auto mb-4" />
          <p className="text-white/60">{texts.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-4 max-w-lg mx-auto">
      <div className="bg-gradient-to-b from-amber-50 to-amber-100 rounded-xl p-6 shadow-2xl min-h-[500px] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200" />
        
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-700">{texts.day} {currentDay} {texts.of} 1825</span>
            <Star className="w-4 h-4 text-amber-600" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-amber-900 mb-1">{texts.title}</h2>
          <p className="text-sm text-amber-700">
            {isPremium ? texts.subtitle : texts.basicSubtitle}
          </p>
          {!isPremium && (
            <span className="inline-block mt-2 text-xs bg-amber-200 text-amber-800 px-2 py-1 rounded-full">
              {texts.basic}
            </span>
          )}
        </div>

        {isPremium && !todayAction && partnerUserId ? (
          <div className="space-y-4">
            <div className="p-4 bg-amber-200/50 rounded-lg border border-amber-300">
              <p className="text-sm text-amber-800 text-center">
                {texts.partnerQuizNeeded}
              </p>
            </div>
            <Button
              onClick={onOpenGames}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white"
            >
              {texts.goToGames}
            </Button>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg p-5 shadow-inner border border-amber-200 mb-6">
              <div className="flex items-start gap-3">
                <Heart className="w-6 h-6 text-pink-500 flex-shrink-0 mt-1" />
                <p className="text-lg leading-relaxed text-gray-800 font-serif">
                  {isPremium && todayAction 
                    ? todayAction.action[language as 'en' | 'es']
                    : basicAction?.action[language as 'en' | 'es']
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-amber-700 mb-6">
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                {isPremium && todayAction ? todayAction.timeRequired : basicAction?.timeRequired}
              </span>
            </div>

            {!isPremium && (
              <div className="p-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-lg border border-amber-400/50 mb-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-2">
                    <p className="text-sm font-medium text-amber-900">
                      {texts.upgradePremium}
                    </p>
                    <p className="text-xs text-amber-800">
                      {texts.upgradeDesc}
                    </p>
                    <Button
                      onClick={() => navigate('/premium-plans')}
                      size="sm"
                      className="w-full mt-2 bg-amber-600 hover:bg-amber-700"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      {texts.upgradePremium}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {!isCompleted ? (
              <Button
                onClick={markAsComplete}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                size="lg"
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                {texts.markFulfilled}
              </Button>
            ) : (
              <div className="flex items-center justify-center gap-2 text-green-700 py-3 bg-green-100 rounded-lg">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-semibold">{texts.completedToday}</span>
              </div>
            )}
          </>
        )}

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <span className="text-xs text-amber-400 font-serif italic">~ {currentDay} ~</span>
        </div>
      </div>
    </div>
  );
};
