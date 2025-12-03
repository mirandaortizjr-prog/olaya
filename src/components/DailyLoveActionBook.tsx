import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, CheckCircle2, Sparkles, Star, ArrowLeft, ChevronRight } from 'lucide-react';
import { getDailyAction, DailyAction } from '@/lib/loveLanguages/dailyActions';
import { getBasicDailyAction, BasicDailyAction } from '@/lib/loveLanguages/basicDailyActions';
import { LoveLanguageScore, scoreLoveLanguageQuiz } from '@/lib/loveLanguages/scoring';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSubscription } from '@/hooks/useSubscription';
import { useNavigate } from 'react-router-dom';
import { loveLanguageQuiz, LoveLanguageQuestion } from '@/lib/loveLanguages/quizData';
import { Progress } from '@/components/ui/progress';

interface DailyLoveActionBookProps {
  userId: string;
  partnerUserId: string | null;
  onOpenGames?: () => void;
}

type View = 'action' | 'quiz';

export const DailyLoveActionBook = ({ userId, partnerUserId, onOpenGames }: DailyLoveActionBookProps) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isPremium, isLoading: isPremiumLoading } = useSubscription(userId);
  
  const [view, setView] = useState<View>('action');
  const [currentDay, setCurrentDay] = useState(1);
  const [todayAction, setTodayAction] = useState<DailyAction | null>(null);
  const [basicAction, setBasicAction] = useState<BasicDailyAction | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [partnerLanguages, setPartnerLanguages] = useState<LoveLanguageScore[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState(false);
  
  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Array<'words' | 'quality_time' | 'gifts' | 'acts' | 'touch'>>([]);

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
      youNeedQuiz: "Complete the Love Language Quiz to unlock your personalized daily actions.",
      goToDailyAction: "Enter Daily Love Action",
      upgradePremium: "Upgrade to Premium",
      upgradeDesc: "Get personalized daily actions based on your partner's love languages",
      basic: "Basic",
      loading: "Loading your daily action...",
      takeQuiz: "Take Language Decoder",
      retakeQuiz: "Retake Quiz",
      quizTitle: "Language Decoder",
      quizSubtitle: "Discover how you prefer to give and receive love",
      question: "Question",
      back: "Back",
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
      youNeedQuiz: "Completa el Quiz de Lenguaje del Amor para desbloquear tus acciones diarias personalizadas.",
      goToDailyAction: "Ir a Acción de Amor",
      upgradePremium: "Mejorar a Premium",
      upgradeDesc: "Obtén acciones diarias personalizadas basadas en los lenguajes de amor de tu pareja",
      basic: "Básico",
      loading: "Cargando tu acción diaria...",
      takeQuiz: "Tomar Decodificador de Lenguaje",
      retakeQuiz: "Repetir Quiz",
      quizTitle: "Decodificador de Lenguaje",
      quizSubtitle: "Descubre cómo prefieres dar y recibir amor",
      question: "Pregunta",
      back: "Volver",
    }
  };

  const texts = t[language as 'en' | 'es'] || t.en;

  useEffect(() => {
    loadData();
  }, [userId, partnerUserId]);

  const loadData = async () => {
    try {
      // Check if user has completed quiz
      const { data: userData } = await supabase
        .from('love_languages')
        .select('all_scores, current_day, last_action_date')
        .eq('user_id', userId)
        .maybeSingle();

      if (userData?.all_scores) {
        setHasCompletedQuiz(true);
      }

      if (userData) {
        const day = userData.current_day || 1;
        setCurrentDay(day);

        const today = new Date().toISOString().split('T')[0];
        setIsCompleted(userData.last_action_date === today);
      }

      // Load partner's languages if available
      if (partnerUserId) {
        const { data: partnerData } = await supabase
          .from('love_languages')
          .select('all_scores')
          .eq('user_id', partnerUserId)
          .maybeSingle();

        if (partnerData?.all_scores) {
          const loadedPartnerLanguages = partnerData.all_scores as unknown as LoveLanguageScore[];
          setPartnerLanguages(loadedPartnerLanguages);

          if (isPremium) {
            const action = getDailyAction(userData?.current_day || 1, loadedPartnerLanguages);
            setTodayAction(action);
          }
        }
      }

      // Set basic action for non-premium users
      if (!isPremium) {
        const action = getBasicDailyAction(userData?.current_day || 1);
        setBasicAction(action);
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
    // After 365 days, continue counting but the action selection will use modular arithmetic
    const nextDay = currentDay + 1;

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
    // Show day within current 365-day cycle
    const displayDay = ((currentDay - 1) % 365) + 1;
    toast({
      title: '💝 Action Completed!',
      description: `Day ${displayDay}/365 complete!`
    });
  };

  const handleAnswer = async (answer: 'words' | 'quality_time' | 'gifts' | 'acts' | 'touch') => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestionIndex < loveLanguageQuiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz complete - calculate and save results
      const profile = scoreLoveLanguageQuiz(newAnswers);
      await saveQuizResults(profile);
    }
  };

  const saveQuizResults = async (profile: ReturnType<typeof scoreLoveLanguageQuiz>) => {
    const { error } = await supabase
      .from('love_languages')
      .upsert({
        user_id: userId,
        primary_language: profile.primaryLanguage,
        secondary_language: profile.secondaryLanguage,
        all_scores: profile.scores as unknown as any,
        profile_title: profile.profileTitle,
        quiz_completed_at: new Date().toISOString(),
        current_day: currentDay || 1,
      }, {
        onConflict: 'user_id'
      });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to save quiz results',
        variant: 'destructive'
      });
      return;
    }

    setHasCompletedQuiz(true);
    
    // Format the language name for display
    const languageDisplay = profile.primaryLanguage
      .replace(/_/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
    
    toast({
      title: '🎉 Quiz Complete!',
      description: `Your primary love language is ${languageDisplay}!`
    });
    setView('action');
    setCurrentQuestionIndex(0);
    setAnswers([]);
    
    // Reload data to get updated partner info if they also completed
    await loadData();
  };

  if (loading || isPremiumLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Heart className="w-8 h-8 text-pink-500 animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">{texts.loading}</p>
        </div>
      </div>
    );
  }

  // Quiz View
  if (view === 'quiz') {
    const currentQuestion: LoveLanguageQuestion = loveLanguageQuiz[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / loveLanguageQuiz.length) * 100;

    return (
      <div className="px-4 py-4 max-w-lg mx-auto">
        <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView('action')}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {texts.back}
          </Button>

          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-foreground mb-1">{texts.quizTitle}</h2>
            <p className="text-sm text-muted-foreground">{texts.quizSubtitle}</p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>{texts.question} {currentQuestionIndex + 1}/{loveLanguageQuiz.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <p className="text-foreground text-center mb-6 font-medium">
            {language === 'es' ? currentQuestion.question.es : currentQuestion.question.en}
          </p>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full text-left justify-start h-auto py-4 px-4 bg-background/50 hover:bg-primary/10 border-border/50 hover:border-primary/50 transition-colors"
                onClick={() => handleAnswer(option.language)}
              >
                <span className="text-foreground">
                  {language === 'es' ? option.text.es : option.text.en}
                </span>
                <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground" />
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Daily Action View
  return (
    <div className="px-4 py-4 max-w-lg mx-auto">
      <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border/50 min-h-[500px] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
        
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">{texts.day} {((currentDay - 1) % 365) + 1} {texts.of} 365</span>
            <Star className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-1">{texts.title}</h2>
          <p className="text-sm text-muted-foreground">
            {isPremium ? texts.subtitle : texts.basicSubtitle}
          </p>
          {!isPremium && (
            <span className="inline-block mt-2 text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
              {texts.basic}
            </span>
          )}
        </div>

        {/* Quiz Button - always show if user hasn't completed quiz */}
        {!hasCompletedQuiz ? (
          <div className="space-y-4">
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
              <p className="text-sm text-foreground text-center">
                {texts.youNeedQuiz}
              </p>
            </div>
            <Button
              onClick={() => setView('quiz')}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Heart className="w-4 h-4 mr-2" />
              {texts.takeQuiz}
            </Button>
          </div>
        ) : !partnerLanguages ? (
          /* User completed quiz but partner hasn't */
          <div className="space-y-4">
            <div className="mb-6">
              <Button
                variant="outline"
                onClick={() => setView('quiz')}
                className="w-full bg-primary/10 hover:bg-primary/20 border-primary/30 text-foreground"
              >
                <Heart className="w-4 h-4 mr-2 text-primary" />
                {texts.retakeQuiz}
              </Button>
            </div>
            <div className="p-4 bg-secondary/50 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground text-center">
                {texts.partnerQuizNeeded}
              </p>
            </div>
          </div>
        ) : (
          /* Both partners completed quiz - show daily action */
          <>
            <div className="mb-6">
              <Button
                variant="outline"
                onClick={() => setView('quiz')}
                className="w-full bg-primary/10 hover:bg-primary/20 border-primary/30 text-foreground"
              >
                <Heart className="w-4 h-4 mr-2 text-primary" />
                {texts.retakeQuiz}
              </Button>
            </div>

            <div className="bg-background/50 rounded-lg p-5 border border-border/50 mb-6">
              <div className="flex items-start gap-3">
                <Heart className="w-6 h-6 text-pink-500 flex-shrink-0 mt-1" />
                <p className="text-lg leading-relaxed text-foreground">
                  {isPremium && todayAction 
                    ? todayAction.action[language as 'en' | 'es']
                    : basicAction?.action[language as 'en' | 'es']
                  }
                </p>
              </div>
            </div>

            {!isPremium && (
              <div className="p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-lg border border-amber-500/30 mb-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-2">
                    <p className="text-sm font-medium text-foreground">
                      {texts.upgradePremium}
                    </p>
                    <p className="text-xs text-muted-foreground">
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
              <div className="flex items-center justify-center gap-2 text-green-400 py-3 bg-green-500/20 rounded-lg border border-green-500/30">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-semibold">{texts.completedToday}</span>
              </div>
            )}
          </>
        )}

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <span className="text-xs text-muted-foreground/50 italic">~ {currentDay} ~</span>
        </div>
      </div>
    </div>
  );
};
