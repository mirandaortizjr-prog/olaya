import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft } from 'lucide-react';
import { loveLanguageQuiz } from '@/lib/loveLanguages/quizData';
import { scoreLoveLanguageQuiz, LoveLanguageProfile } from '@/lib/loveLanguages/scoring';
import { useLanguage } from '@/contexts/LanguageContext';

interface LoveLanguageQuizProps {
  onComplete: (profile: LoveLanguageProfile) => void;
  onBack: () => void;
}

export const LoveLanguageQuiz = ({ onComplete, onBack }: LoveLanguageQuizProps) => {
  const { language } = useLanguage();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Array<'words' | 'quality_time' | 'gifts' | 'acts' | 'touch'>>([]);

  const handleAnswer = (selectedLanguage: 'words' | 'quality_time' | 'gifts' | 'acts' | 'touch') => {
    const newAnswers = [...answers, selectedLanguage];
    setAnswers(newAnswers);

    if (currentQuestion < loveLanguageQuiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz complete - score it
      const profile = scoreLoveLanguageQuiz(newAnswers);
      onComplete(profile);
    }
  };

  const question = loveLanguageQuiz[currentQuestion];
  const progress = ((currentQuestion + 1) / loveLanguageQuiz.length) * 100;

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Question {currentQuestion + 1} of {loveLanguageQuiz.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="bg-card/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-xl">
            {question.question[language as 'en' | 'es']}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {question.options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full justify-start text-left h-auto py-4 px-4 hover:bg-primary/10 hover:border-primary transition-all"
              onClick={() => handleAnswer(option.language)}
            >
              <span className="mr-3 text-primary font-bold">
                {String.fromCharCode(65 + index)}
              </span>
              {option.text[language as 'en' | 'es']}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
