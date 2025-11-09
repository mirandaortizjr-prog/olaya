import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Flame, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { IntimacyQuiz } from "@/components/intimacy/IntimacyQuiz";
import { IntimacyProfile } from "@/components/intimacy/IntimacyProfile";
import { RitualDisplay } from "@/components/intimacy/RitualDisplay";
import { PartnerComparison } from "@/components/intimacy/PartnerComparison";
import { QuizResult } from "@/lib/intimacyLanguages/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GameProps {
  coupleId: string;
  userId: string;
  partnerId: string | null;
  onBack: () => void;
}

type View = 'menu' | 'lust-quiz' | 'sex-quiz' | 'profile' | 'rituals' | 'comparison';

export const LoveLanguageGame = ({ coupleId, userId, partnerId, onBack }: GameProps) => {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [view, setView] = useState<View>('menu');
  const [lustResult, setLustResult] = useState<QuizResult | null>(null);
  const [sexResult, setSexResult] = useState<QuizResult | null>(null);
  const [partnerLustResult, setPartnerLustResult] = useState<QuizResult | null>(null);
  const [partnerSexResult, setPartnerSexResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, [userId, partnerId]);

  const loadResults = async () => {
    try {
      // Load user results
      const { data: userData } = await supabase
        .from('intimacy_languages')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (userData) {
        if (userData.lust_language) {
          setLustResult(userData.lust_language as unknown as QuizResult);
        }
        if (userData.sex_language) {
          setSexResult(userData.sex_language as unknown as QuizResult);
        }
      }

      // Load partner results if available
      if (partnerId) {
        const { data: partnerData } = await supabase
          .from('intimacy_languages')
          .select('*')
          .eq('user_id', partnerId)
          .maybeSingle();

        if (partnerData) {
          if (partnerData.lust_language) {
            setPartnerLustResult(partnerData.lust_language as unknown as QuizResult);
          }
          if (partnerData.sex_language) {
            setPartnerSexResult(partnerData.sex_language as unknown as QuizResult);
          }
        }
      }
    } catch (error) {
      console.error('Error loading results:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveResult = async (type: 'lust' | 'sex', result: QuizResult) => {
    try {
      const updateData = type === 'lust' 
        ? { lust_language: result }
        : { sex_language: result };

      const { error } = await supabase
        .from('intimacy_languages')
        .upsert([{
          user_id: userId,
          couple_id: coupleId,
          ...updateData,
          updated_at: new Date().toISOString(),
        }] as any);

      if (error) throw error;

      if (type === 'lust') {
        setLustResult(result);
      } else {
        setSexResult(result);
      }

      toast({
        title: language === 'es' ? 'Resultado guardado' : 'Result saved',
        description: language === 'es' 
          ? 'Tu lenguaje de intimidad ha sido guardado.' 
          : 'Your intimacy language has been saved.',
      });

      setView('profile');
    } catch (error) {
      console.error('Error saving result:', error);
      toast({
        title: language === 'es' ? 'Error' : 'Error',
        description: language === 'es' 
          ? 'No se pudo guardar el resultado.' 
          : 'Failed to save result.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
        <p>{language === 'es' ? 'Cargando...' : 'Loading...'}</p>
      </div>
    );
  }

  if (view === 'lust-quiz') {
    return (
      <IntimacyQuiz
        type="lust"
        onComplete={(result) => saveResult('lust', result)}
        onBack={() => setView('menu')}
      />
    );
  }

  if (view === 'sex-quiz') {
    return (
      <IntimacyQuiz
        type="sex"
        onComplete={(result) => saveResult('sex', result)}
        onBack={() => setView('menu')}
      />
    );
  }

  if (view === 'profile' && (lustResult || sexResult)) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col overflow-y-auto">
        <div className="flex items-center gap-2 p-4 border-b sticky top-0 bg-background">
          <Button variant="ghost" size="icon" onClick={() => setView('menu')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-semibold">
            {t('yourIntimacyProfile')}
          </h2>
        </div>
        <IntimacyProfile
          lustResult={lustResult}
          sexResult={sexResult}
          onRetakeQuiz={(type) => setView(type === 'lust' ? 'lust-quiz' : 'sex-quiz')}
        />
      </div>
    );
  }

  if (view === 'rituals' && lustResult) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col overflow-y-auto">
        <div className="flex items-center gap-2 p-4 border-b sticky top-0 bg-background">
          <Button variant="ghost" size="icon" onClick={() => setView('menu')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-semibold">
            {t('viewRituals')}
          </h2>
        </div>
        <div className="p-4">
          <RitualDisplay primaryLanguage={lustResult.primary} entryCount={0} />
        </div>
      </div>
    );
  }

  if (view === 'comparison' && partnerId && partnerLustResult) {
    const userLanguages = [lustResult?.primary, sexResult?.primary].filter(Boolean) as string[];
    const partnerLanguages = [partnerLustResult?.primary, partnerSexResult?.primary].filter(Boolean) as string[];

    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col overflow-y-auto">
        <div className="flex items-center gap-2 p-4 border-b sticky top-0 bg-background">
          <Button variant="ghost" size="icon" onClick={() => setView('menu')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-semibold">
            {t('partnerComparison')}
          </h2>
        </div>
        <PartnerComparison userLanguages={userLanguages} partnerLanguages={partnerLanguages} />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      <div className="flex items-center gap-2 p-4 border-b">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-xl font-semibold">
          {t('intimacyLanguages')}
        </h2>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        <Card className="p-6 bg-gradient-to-br from-rose-500/10 to-pink-500/10">
          <div className="flex items-center gap-3 mb-4">
            <Flame className="w-8 h-8 text-rose-500" />
            <h3 className="text-xl font-semibold">
              {t('lustLanguage')}
            </h3>
          </div>
          <p className="text-muted-foreground mb-4">
            {t('discoverLustLanguage')}
          </p>
          <Button 
            className="w-full"
            onClick={() => setView('lust-quiz')}
          >
            {lustResult ? t('retakeQuiz') : t('startQuiz')}
          </Button>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-indigo-500/10">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-purple-500" />
            <h3 className="text-xl font-semibold">
              {t('sexLanguage')}
            </h3>
          </div>
          <p className="text-muted-foreground mb-4">
            {t('exploreSexLanguage')}
          </p>
          <Button 
            className="w-full"
            onClick={() => setView('sex-quiz')}
          >
            {sexResult ? t('retakeQuiz') : t('startQuiz')}
          </Button>
        </Card>

        {(lustResult || sexResult) && (
          <>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setView('profile')}
            >
              {t('viewMyProfile')}
            </Button>

            {lustResult && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setView('rituals')}
              >
                {t('viewRituals')}
              </Button>
            )}

            {partnerId && partnerLustResult && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setView('comparison')}
              >
                {t('compareWithPartner')}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
