import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { lustLanguageQuestions, sexLanguageQuestions } from "@/lib/intimacyLanguages/quizData";
import { scoreQuiz } from "@/lib/intimacyLanguages/scoring";
import { QuizResult } from "@/lib/intimacyLanguages/types";
import { motion, AnimatePresence } from "framer-motion";

interface IntimacyQuizProps {
  type: 'lust' | 'sex';
  onComplete: (result: QuizResult) => void;
  onBack: () => void;
}

export const IntimacyQuiz = ({ type, onComplete, onBack }: IntimacyQuizProps) => {
  const { language } = useLanguage();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const questions = type === 'lust' 
    ? lustLanguageQuestions[language as 'en' | 'es'] 
    : sexLanguageQuestions[language as 'en' | 'es'];

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const result = scoreQuiz(newAnswers, type, language as 'en' | 'es');
      onComplete(result);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-4 flex flex-col">
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          ← {language === 'es' ? 'Atrás' : 'Back'}
        </Button>
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-muted-foreground mt-2 text-center">
          {language === 'es' ? 'Pregunta' : 'Question'} {currentQuestion + 1} {language === 'es' ? 'de' : 'of'} {questions.length}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-1 flex flex-col items-center justify-center"
        >
          <Card className="w-full max-w-2xl p-8">
            <h2 className="text-2xl font-semibold mb-8 text-center">
              {questions[currentQuestion].question}
            </h2>
            
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full h-auto py-4 px-6 text-left justify-start whitespace-normal"
                  onClick={() => handleAnswer(option.value)}
                >
                  <span className="mr-3 text-primary font-semibold">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span>{option.text}</span>
                </Button>
              ))}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
