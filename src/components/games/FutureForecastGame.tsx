import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Calendar, Heart, Home, Briefcase, Plane, Sparkles, Target, Clock, CheckCircle2, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCoupleProgress } from "@/hooks/useCoupleProgress";
import { useTogetherCoins } from "@/hooks/useTogetherCoins";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { futureForecastQuestions } from "@/lib/futureForecastQuestions";

interface GameProps {
  coupleId: string;
  userId: string;
  partnerId: string | null;
  onBack: () => void;
}

type GameMode = 'instructions' | 'category' | 'question' | 'summary';
type Category = 'romance' | 'family' | 'career' | 'adventure' | 'life' | 'dreams';

interface Question {
  id: string;
  category: Category;
  text: { en: string; es: string };
  type: 'scale' | 'choice' | 'timeline';
  options?: { en: string[]; es: string[] };
  minLabel?: { en: string; es: string };
  maxLabel?: { en: string; es: string };
}

interface Answer {
  questionId: string;
  value: number | string;
  userId: string;
}

export const FutureForecastGame = ({ coupleId, userId, partnerId, onBack }: GameProps) => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { progress } = useCoupleProgress(coupleId);
  const { addCoins } = useTogetherCoins(userId);
  
  const [gameMode, setGameMode] = useState<GameMode>('instructions');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Answer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<number | string>(50);
  const [questionsCompleted, setQuestionsCompleted] = useState(0);
  const [hasPlayedToday, setHasPlayedToday] = useState(false);

  const categories = [
    { id: 'romance' as Category, icon: Heart, color: 'from-pink-500 to-rose-500', label: language === 'es' ? 'Romance' : 'Romance' },
    { id: 'family' as Category, icon: Home, color: 'from-blue-500 to-cyan-500', label: language === 'es' ? 'Familia' : 'Family' },
    { id: 'career' as Category, icon: Briefcase, color: 'from-purple-500 to-indigo-500', label: language === 'es' ? 'Carrera' : 'Career' },
    { id: 'adventure' as Category, icon: Plane, color: 'from-green-500 to-emerald-500', label: language === 'es' ? 'Aventura' : 'Adventure' },
    { id: 'life' as Category, icon: Target, color: 'from-orange-500 to-amber-500', label: language === 'es' ? 'Vida' : 'Life Goals' },
    { id: 'dreams' as Category, icon: Sparkles, color: 'from-violet-500 to-fuchsia-500', label: language === 'es' ? 'Sueños' : 'Dreams' },
  ];

  const categoryQuestions = selectedCategory 
    ? futureForecastQuestions.filter(q => q.category === selectedCategory)
    : [];

  const currentQuestion = categoryQuestions[currentQuestionIndex];

  useEffect(() => {
    checkIfPlayedToday();
  }, []);

  const checkIfPlayedToday = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('game_sessions')
        .select('id')
        .eq('couple_id', coupleId)
        .eq('initiated_by', userId)
        .eq('game_type', 'future_forecast')
        .gte('created_at', today)
        .single();
      
      setHasPlayedToday(!!data);
    } catch (error) {
      setHasPlayedToday(false);
    }
  };

  const selectCategory = (category: Category) => {
    setSelectedCategory(category);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setQuestionsCompleted(0);
    setCurrentAnswer(50);
    setGameMode('question');
  };

  const submitAnswer = async () => {
    if (!currentQuestion) return;

    const answer: Answer = {
      questionId: currentQuestion.id,
      value: currentAnswer,
      userId
    };

    setUserAnswers([...userAnswers, answer]);

    // Save answer to database
    try {
      const { error } = await supabase.from('game_answers').insert({
        session_id: `future_forecast_${selectedCategory}_${Date.now()}`,
        couple_id: coupleId,
        user_id: userId,
        question_id: currentQuestion.id,
        answer_value: typeof currentAnswer === 'number' ? currentAnswer.toString() : currentAnswer,
        game_type: 'future_forecast'
      });

      if (error) {
        console.error('Error saving answer:', error);
        toast({
          title: language === 'es' ? 'Error' : 'Error',
          description: language === 'es' ? 'No se pudo guardar la respuesta' : 'Failed to save answer',
          variant: 'destructive'
        });
        return;
      }

      // Move to next question
      nextQuestion();
    } catch (error) {
      console.error('Error saving answer:', error);
      toast({
        title: language === 'es' ? 'Error' : 'Error',
        description: language === 'es' ? 'No se pudo guardar la respuesta' : 'Failed to save answer',
        variant: 'destructive'
      });
    }
  };

  const nextQuestion = () => {
    const newCompleted = questionsCompleted + 1;
    setQuestionsCompleted(newCompleted);

    if (newCompleted >= 5) {
      setGameMode('summary');
      completeGame();
    } else if (currentQuestionIndex < categoryQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentAnswer(50);
      setGameMode('question');
    } else {
      setGameMode('summary');
      completeGame();
    }
  };

  const completeGame = async () => {
    try {
      if (!hasPlayedToday && partnerId) {
        await supabase.from('game_sessions').insert({
          session_id: `future_forecast_${Date.now()}`,
          couple_id: coupleId,
          initiated_by: userId,
          partner_id: partnerId,
          game_type: 'future_forecast',
          status: 'completed'
        });

        await addCoins(10, 'Future Forecast game completed', coupleId);
        
        toast({
          title: t('gameComplete') || "Game Complete! 🎉",
          description: t('earnedCoins')?.replace('{amount}', '10') || "You earned 10 Together Coins!",
        });
      }
    } catch (error) {
      console.error('Error completing game:', error);
    }
  };

  const resetGame = () => {
    setGameMode('category');
    setSelectedCategory(null);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setQuestionsCompleted(0);
    setCurrentAnswer(50);
  };

  if (gameMode === 'instructions') {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 p-4 border-b flex-shrink-0">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-semibold">{t('futureForecast') || 'Future Forecast'}</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4">
          <Card className="p-6 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border-violet-200 dark:border-violet-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                {language === 'es' ? 'Explora Tu Futuro Juntos' : 'Explore Your Future Together'}
              </h3>
            </div>
            <p className="text-muted-foreground">
              {language === 'es' 
                ? 'Descubre qué tan alineados están en sus sueños, metas y visión del futuro. Responde preguntas sobre romance, familia, carrera, aventura y más.'
                : 'Discover how aligned you are on your dreams, goals, and vision for the future. Answer questions about romance, family, career, adventure, and more.'}
            </p>
          </Card>

          <Card className="p-6">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              {language === 'es' ? 'Cómo Jugar' : 'How to Play'}
            </h4>
            <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
              <li>{language === 'es' ? 'Elige una categoría que te emocione explorar' : 'Choose a category you\'re excited to explore'}</li>
              <li>{language === 'es' ? 'Ambos responden la misma pregunta por separado' : 'Both answer the same question separately'}</li>
              <li>{language === 'es' ? 'Revela y compara tus respuestas' : 'Reveal and compare your answers'}</li>
              <li>{language === 'es' ? 'Descubre tu porcentaje de alineación' : 'Discover your alignment percentage'}</li>
              <li>{language === 'es' ? 'Completa 5 preguntas para terminar el juego' : 'Complete 5 questions to finish the game'}</li>
            </ol>
          </Card>

          <Card className="p-6">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              {language === 'es' ? 'Cómo Ganar' : 'How to Win'}
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              {language === 'es'
                ? 'No se trata de estar de acuerdo en todo, ¡sino de entender la visión del otro! Cuanto mayor sea tu puntuación de alineación, mejor están sincronizados para el futuro.'
                : 'It\'s not about agreeing on everything—it\'s about understanding each other\'s vision! The higher your alignment score, the better you\'re in sync for the future.'}
            </p>
            <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg">
              <Clock className="w-5 h-5 text-primary" />
              <p className="text-sm font-medium">
                {language === 'es'
                  ? '¡Completa el juego para ganar 10 Monedas Juntos (una vez al día)!'
                  : 'Complete the game to earn 10 Together Coins (once per day)!'}
              </p>
            </div>
          </Card>

          {hasPlayedToday && (
            <Card className="p-4 bg-amber-500/10 border-amber-200 dark:border-amber-800">
              <p className="text-sm text-center text-amber-900 dark:text-amber-100">
                {language === 'es'
                  ? '¡Ya jugaste hoy! Puedes jugar de nuevo, pero las recompensas se otorgan una vez al día.'
                  : 'You\'ve already played today! You can play again, but rewards are given once per day.'}
              </p>
            </Card>
          )}
        </div>

        <div className="p-4 border-t flex-shrink-0">
          <Button onClick={() => setGameMode('category')} className="w-full" size="lg">
            {language === 'es' ? 'Comenzar Juego' : 'Start Game'}
          </Button>
        </div>
      </div>
    );
  }

  if (gameMode === 'category') {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 p-4 border-b flex-shrink-0">
          <Button variant="ghost" size="icon" onClick={() => setGameMode('instructions')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-semibold">{language === 'es' ? 'Elige Categoría' : 'Choose Category'}</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto overscroll-contain p-4">
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Card
                  key={cat.id}
                  className="p-6 cursor-pointer hover:scale-105 transition-all duration-200 active:scale-95"
                  onClick={() => selectCategory(cat.id)}
                >
                  <div className={`w-full h-24 bg-gradient-to-br ${cat.color} rounded-lg flex items-center justify-center mb-3`}>
                    <Icon className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-center font-semibold">{cat.label}</h3>
                  <p className="text-xs text-center text-muted-foreground mt-1">
                    {futureForecastQuestions.filter(q => q.category === cat.id).length} {language === 'es' ? 'preguntas' : 'questions'}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (gameMode === 'question' && currentQuestion) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 p-4 border-b flex-shrink-0">
          <Button variant="ghost" size="icon" onClick={() => setGameMode('category')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h2 className="text-lg font-semibold">{categories.find(c => c.id === selectedCategory)?.label}</h2>
            <p className="text-xs text-muted-foreground">
              {language === 'es' ? 'Pregunta' : 'Question'} {questionsCompleted + 1}/5
            </p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-6">
          <Progress value={(questionsCompleted / 5) * 100} className="h-2" />
          
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10">
            <h3 className="text-xl font-bold mb-6 text-center">
              {currentQuestion.text[language]}
            </h3>
            
            {currentQuestion.type === 'scale' && (
              <div className="space-y-4">
                <div className="text-center">
                  <span className="text-4xl font-bold text-primary">{currentAnswer}</span>
                </div>
                <Slider
                  value={[currentAnswer as number]}
                  onValueChange={(val) => setCurrentAnswer(val[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{currentQuestion.minLabel?.[language]}</span>
                  <span>{currentQuestion.maxLabel?.[language]}</span>
                </div>
              </div>
            )}

            {currentQuestion.type === 'timeline' && (
              <div className="space-y-4">
                <div className="text-center">
                  <span className="text-4xl font-bold text-primary">{currentAnswer}</span>
                </div>
                <Slider
                  value={[currentAnswer as number]}
                  onValueChange={(val) => setCurrentAnswer(val[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{currentQuestion.minLabel?.[language]}</span>
                  <span>{currentQuestion.maxLabel?.[language]}</span>
                </div>
              </div>
            )}

            {currentQuestion.type === 'choice' && currentQuestion.options && (
              <div className="space-y-2">
                {currentQuestion.options[language]?.map((option, index) => (
                  <Button
                    key={index}
                    variant={currentAnswer === option ? "default" : "outline"}
                    className="w-full justify-start text-left h-auto py-3"
                    onClick={() => setCurrentAnswer(option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="p-4 border-t flex-shrink-0">
          <Button onClick={submitAnswer} className="w-full" size="lg">
            {language === 'es' ? 'Enviar Respuesta' : 'Submit Answer'}
          </Button>
        </div>
      </div>
    );
  }


  if (gameMode === 'summary') {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 p-4 border-b flex-shrink-0">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-semibold">{language === 'es' ? 'Resumen del Juego' : 'Game Summary'}</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4">
          <Card className="p-8 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 text-center">
            <Sparkles className="w-16 h-16 mx-auto text-primary mb-4" />
            <h3 className="text-3xl font-bold mb-2">{language === 'es' ? '¡Juego Completo!' : 'Game Complete!'}</h3>
            <p className="text-lg font-semibold mb-4">
              {language === 'es' ? 'Respuestas Guardadas' : 'Answers Saved'}
            </p>
            <p className="text-muted-foreground">
              {language === 'es' 
                ? `Completaste ${questionsCompleted} preguntas sobre ${categories.find(c => c.id === selectedCategory)?.label}`
                : `You completed ${questionsCompleted} questions about ${categories.find(c => c.id === selectedCategory)?.label}`}
            </p>
          </Card>

          {!hasPlayedToday && (
            <Card className="p-6 bg-primary/10 border-primary/20">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-primary">
                  <CheckCircle2 className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-semibold">{language === 'es' ? '¡Ganaste 10 Monedas Juntos!' : 'Earned 10 Together Coins!'}</p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'es' ? 'Regresa mañana para más recompensas' : 'Come back tomorrow for more rewards'}
                  </p>
                </div>
              </div>
            </Card>
          )}

          <Card className="p-6">
            <h4 className="font-semibold mb-3">
              {language === 'es' ? 'Tus Respuestas' : 'Your Answers'}
            </h4>
            <div className="space-y-2">
              {userAnswers.map((ans, idx) => {
                const q = futureForecastQuestions.find(q => q.id === ans.questionId);
                return (
                  <div key={idx} className="p-3 bg-muted rounded-lg text-sm">
                    <p className="font-medium mb-1">{q?.text[language]}</p>
                    <p className="text-muted-foreground">{ans.value}</p>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="p-4 border-t space-y-2 flex-shrink-0">
          <Button onClick={resetGame} className="w-full" size="lg">
            {language === 'es' ? 'Jugar de Nuevo' : 'Play Again'}
          </Button>
          <Button onClick={onBack} variant="outline" className="w-full">
            {language === 'es' ? 'Volver al Inicio' : 'Back to Home'}
          </Button>
        </div>
      </div>
    );
  }

  return null;
};
