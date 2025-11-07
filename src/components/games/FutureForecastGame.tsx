import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Send } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCoupleProgress } from "@/hooks/useCoupleProgress";
import { getFutureForecastQuestions, calculateExperienceGain } from "@/lib/gameQuestions";
import { Progress } from "@/components/ui/progress";

interface FutureForecastGameProps {
  coupleId: string;
  userId: string;
  partnerId: string | null;
  onBack: () => void;
}

export const FutureForecastGame = ({ coupleId, userId, partnerId, onBack }: FutureForecastGameProps) => {
  const [sessionId, setSessionId] = useState<string>("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [partnerAnswers, setPartnerAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [isWaitingForPartner, setIsWaitingForPartner] = useState(false);
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const { progress, addExperience } = useCoupleProgress(coupleId);
  
  const questions = getFutureForecastQuestions(progress.currentLevel, language);
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    checkExistingSession();
    const channel = supabase
      .channel('future-forecast-game')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'game_responses',
        filter: `couple_id=eq.${coupleId}`
      }, () => {
        loadPartnerAnswers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [coupleId]);

  const checkExistingSession = async () => {
    const { data } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('couple_id', coupleId)
      .eq('game_type', 'future_forecast')
      .eq('status', 'pending')
      .or(`initiated_by.eq.${userId},partner_id.eq.${userId}`)
      .single();

    if (data) {
      setSessionId(data.session_id);
      setIsWaitingForPartner(data.initiated_by !== userId);
      loadPartnerAnswers();
    } else {
      createNewSession();
    }
  };

  const createNewSession = async () => {
    if (!partnerId) return;
    
    const newSessionId = `future_forecast_${Date.now()}`;
    setSessionId(newSessionId);

    await supabase
      .from('game_sessions')
      .insert({
        couple_id: coupleId,
        initiated_by: userId,
        partner_id: partnerId,
        game_type: 'future_forecast',
        session_id: newSessionId,
        status: 'pending'
      });
  };

  const loadPartnerAnswers = async () => {
    if (!sessionId) return;

    const { data } = await supabase
      .from('game_responses')
      .select('*')
      .eq('session_id', sessionId)
      .eq('game_type', 'future_forecast')
      .neq('user_id', userId);

    if (data) {
      const answers: Record<number, string> = {};
      data.forEach(response => {
        const qIndex = parseInt(response.question_id.split('_')[1]);
        answers[qIndex] = response.answer;
      });
      setPartnerAnswers(answers);
    }
  };

  const handleAnswerSubmit = async (answer: string) => {
    const newAnswers = { ...userAnswers, [currentQuestionIndex]: answer };
    setUserAnswers(newAnswers);

    const experienceGained = calculateExperienceGain(progress.currentLevel, 'correct');

    await supabase
      .from('game_responses')
      .insert({
        couple_id: coupleId,
        user_id: userId,
        game_type: 'future_forecast',
        session_id: sessionId,
        question_id: `q_${currentQuestionIndex}`,
        answer: answer,
        experience_earned: experienceGained,
        level_earned: progress.currentLevel
      });

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsWaitingForPartner(true);
      checkIfBothCompleted(newAnswers);
    }
  };

  const checkIfBothCompleted = async (myAnswers: Record<number, string>) => {
    await loadPartnerAnswers();
    
    if (Object.keys(partnerAnswers).length === questions.length) {
      await supabase
        .from('game_sessions')
        .update({ status: 'completed' })
        .eq('session_id', sessionId);

      const totalExperience = questions.length * calculateExperienceGain(progress.currentLevel, 'correct');
      await addExperience(totalExperience);
      
      setShowResults(true);
    }
  };

  if (showResults) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col p-4">
        <Button variant="ghost" onClick={onBack} className="self-start mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t.back}
        </Button>

        <Card className="flex-1 p-6 overflow-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">{t.yourFutureTogether}</h2>

          <div className="space-y-4">
            {questions.map((q, index) => (
              <Card key={index} className="p-4">
                <p className="font-semibold mb-3">{q.question}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">{t.yourVision}</p>
                    <p>{userAnswers[index] || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">{t.partnerVision}</p>
                    <p>{partnerAnswers[index] || '-'}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Button onClick={onBack} className="w-full mt-6">{t.playAgain}</Button>
        </Card>
      </div>
    );
  }

  if (isWaitingForPartner) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col p-4">
        <Button variant="ghost" onClick={onBack} className="self-start mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t.back}
        </Button>
        <Card className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="animate-pulse mb-4">🔮</div>
            <h3 className="text-xl font-semibold mb-2">{t.waitingForPartner}</h3>
            <p className="text-muted-foreground">{t.partnerStillAnswering}</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col p-4">
      <Button variant="ghost" onClick={onBack} className="self-start mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        {t.back}
      </Button>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            {t.question} {currentQuestionIndex + 1} / {questions.length}
          </span>
          <span className="text-sm font-bold text-primary">
            {t.level} {progress.currentLevel}
          </span>
        </div>
        <Progress value={(currentQuestionIndex / questions.length) * 100} />
      </div>

      <Card className="flex-1 p-6 flex flex-col">
        <h3 className="text-xl font-semibold mb-6">{currentQuestion.question}</h3>
        
        <div className="flex-1">
          <textarea
            className="w-full h-full p-4 border rounded-lg resize-none min-h-32"
            placeholder={t.shareYourDreams}
            value={userAnswers[currentQuestionIndex] || ''}
            onChange={(e) => setUserAnswers({ ...userAnswers, [currentQuestionIndex]: e.target.value })}
          />
        </div>

        <Button
          onClick={() => handleAnswerSubmit(userAnswers[currentQuestionIndex] || '')}
          disabled={!userAnswers[currentQuestionIndex]?.trim()}
          className="w-full mt-4"
        >
          <Send className="w-4 h-4 mr-2" />
          {currentQuestionIndex === questions.length - 1 ? t.finish : t.next}
        </Button>
      </Card>
    </div>
  );
};