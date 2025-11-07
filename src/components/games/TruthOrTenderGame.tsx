import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Heart, MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCoupleProgress } from "@/hooks/useCoupleProgress";
import { getTruthOrTenderQuestions, calculateExperienceGain } from "@/lib/gameQuestions";

interface TruthOrTenderGameProps {
  coupleId: string;
  userId: string;
  onBack: () => void;
}

export const TruthOrTenderGame = ({ coupleId, userId, onBack }: TruthOrTenderGameProps) => {
  const [currentMode, setCurrentMode] = useState<'truth' | 'tender' | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const { progress, addExperience } = useCoupleProgress(coupleId);
  
  const questions = getTruthOrTenderQuestions(progress.currentLevel, language);
  const currentQuestion = currentMode ? questions.filter(q => q.type === currentMode)[currentQuestionIndex] : null;

  const handleModeSelect = (mode: 'truth' | 'tender') => {
    setCurrentMode(mode);
    setCurrentQuestionIndex(0);
  };

  const handleComplete = async () => {
    if (!currentQuestion) return;

    const experienceGained = calculateExperienceGain(progress.currentLevel, 'correct');
    const sessionId = `truth_or_tender_${Date.now()}`;

    await supabase
      .from('game_responses')
      .insert({
        couple_id: coupleId,
        user_id: userId,
        game_type: 'truth_or_tender',
        session_id: sessionId,
        question_id: `${currentMode}_${currentQuestionIndex}`,
        answer: 'completed',
        experience_earned: experienceGained,
        level_earned: progress.currentLevel
      });

    await addExperience(experienceGained);

    const filteredQuestions = questions.filter(q => q.type === currentMode);
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsComplete(true);
      toast({
        title: t.gameComplete,
        description: `+${experienceGained} ${t.experience}`,
      });
    }
  };

  if (isComplete) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col p-4">
        <Button variant="ghost" onClick={onBack} className="self-start mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t.back}
        </Button>

        <Card className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <Heart className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-2">{t.wellDone}</h2>
            <p className="text-muted-foreground mb-6">{t.keepExploring}</p>
            <Button onClick={onBack}>{t.playAgain}</Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!currentMode) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col p-4">
        <Button variant="ghost" onClick={onBack} className="self-start mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t.back}
        </Button>

        <Card className="flex-1 p-6 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-8 text-center">{t.chooseYourPath}</h2>
          
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            <Button
              variant="outline"
              className="h-40 flex flex-col gap-4"
              onClick={() => handleModeSelect('truth')}
            >
              <MessageCircle className="w-12 h-12" />
              <div>
                <div className="font-bold text-lg">{t.truth}</div>
                <div className="text-sm text-muted-foreground">{t.deepQuestions}</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-40 flex flex-col gap-4"
              onClick={() => handleModeSelect('tender')}
            >
              <Heart className="w-12 h-12" />
              <div>
                <div className="font-bold text-lg">{t.tender}</div>
                <div className="text-sm text-muted-foreground">{t.romanticDares}</div>
              </div>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            {t.level} {progress.currentLevel}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col p-4">
      <Button variant="ghost" onClick={() => setCurrentMode(null)} className="self-start mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        {t.back}
      </Button>

      <Card className="flex-1 p-6 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {currentMode === 'truth' ? (
              <MessageCircle className="w-6 h-6 text-primary" />
            ) : (
              <Heart className="w-6 h-6 text-primary" />
            )}
            <h3 className="text-xl font-semibold">
              {currentMode === 'truth' ? t.truth : t.tender}
            </h3>
          </div>
          <span className="text-sm text-muted-foreground">
            {t.level} {progress.currentLevel}
          </span>
        </div>

        {currentQuestion && (
          <div className="flex-1 flex flex-col">
            <Card className="flex-1 p-6 bg-muted/50 mb-6">
              <p className="text-lg">{currentQuestion.question}</p>
            </Card>

            <Button onClick={handleComplete} className="w-full">
              {t.complete}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};