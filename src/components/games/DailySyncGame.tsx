import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Send } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCoupleProgress } from "@/hooks/useCoupleProgress";
import { getDailySyncQuestions, calculateExperienceGain } from "@/lib/gameQuestions";

interface DailySyncGameProps {
  coupleId: string;
  userId: string;
  onBack: () => void;
}

export const DailySyncGame = ({ coupleId, userId, onBack }: DailySyncGameProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const { progress, addExperience } = useCoupleProgress(coupleId);
  
  const questions = getDailySyncQuestions(progress.currentLevel, language);
  const currentQuestion = questions[currentQuestionIndex];

  const handleSubmit = async () => {
    if (!currentAnswer.trim()) return;

    const newAnswers = [...answers, currentAnswer];
    setAnswers(newAnswers);

    const experienceGained = calculateExperienceGain(progress.currentLevel, 'correct');
    const sessionId = `daily_sync_${Date.now()}`;

    await supabase
      .from('game_responses')
      .insert({
        couple_id: coupleId,
        user_id: userId,
        game_type: 'daily_sync',
        session_id: sessionId,
        question_id: `q_${currentQuestionIndex}`,
        answer: currentAnswer,
        experience_earned: experienceGained,
        level_earned: progress.currentLevel
      });

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentAnswer("");
    } else {
      const totalExp = questions.length * experienceGained;
      await addExperience(totalExp);
      setIsComplete(true);
      
      toast({
        title: t.dailySyncComplete,
        description: `+${totalExp} ${t.experience}`,
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

        <Card className="flex-1 p-6 overflow-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">{t.dailySyncComplete}</h2>
          
          <div className="space-y-4">
            {questions.map((q, index) => (
              <Card key={index} className="p-4">
                <p className="font-semibold mb-2">{q.question}</p>
                <p className="text-muted-foreground">{answers[index]}</p>
              </Card>
            ))}
          </div>

          <Button onClick={onBack} className="w-full mt-6">{t.close}</Button>
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
        <span className="text-sm text-muted-foreground">
          {t.question} {currentQuestionIndex + 1} / {questions.length}
        </span>
        <span className="text-sm font-bold text-primary ml-4">
          {t.level} {progress.currentLevel}
        </span>
      </div>

      <Card className="flex-1 p-6 flex flex-col">
        <h3 className="text-xl font-semibold mb-6">{currentQuestion.question}</h3>
        
        <div className="flex-1">
          <textarea
            className="w-full h-full p-4 border rounded-lg resize-none min-h-48"
            placeholder={t.typeYourThoughts}
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!currentAnswer.trim()}
          className="w-full mt-4"
        >
          <Send className="w-4 h-4 mr-2" />
          {currentQuestionIndex === questions.length - 1 ? t.finish : t.next}
        </Button>
      </Card>
    </div>
  );
};