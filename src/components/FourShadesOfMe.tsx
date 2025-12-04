import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { temperamentQuiz, scoreTemperamentQuiz, temperamentInfo, TemperamentProfile } from '@/lib/fourShadesQuizData';
import { temperamentChapters } from '@/lib/fourShadesChaptersData';
import { ChevronLeft, ChevronRight, Copy, BookOpen } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface FourShadesOfMeProps {
  userId: string;
  coupleId: string;
}

type View = 'home' | 'quiz' | 'results' | 'chapters' | 'chapter-detail';

export const FourShadesOfMe = ({ userId, coupleId }: FourShadesOfMeProps) => {
  const { language } = useLanguage();
  const lang = language as 'en' | 'es';
  
  const [view, setView] = useState<View>('home');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<('sanguine' | 'choleric' | 'melancholic' | 'phlegmatic')[]>([]);
  const [profile, setProfile] = useState<TemperamentProfile | null>(() => {
    const saved = localStorage.getItem(`four-shades-profile-${userId}`);
    return saved ? JSON.parse(saved) : null;
  });
  const [selectedChapter, setSelectedChapter] = useState<number>(0);

  const t = {
    en: {
      title: "Four Shades of Me",
      subtitle: "Discover your temperament blend",
      takeQuiz: "Take the Quiz",
      viewResults: "View My Results",
      readChapters: "Read Chapters",
      quizTitle: "The Four Shades of Me Quiz",
      question: "Question",
      of: "of",
      next: "Next",
      back: "Back",
      seeResults: "See Results",
      yourProfile: "Your Temperament Profile",
      dominant: "Dominant",
      secondary: "Secondary",
      tertiary: "Tertiary",
      rare: "Rare",
      retakeQuiz: "Retake Quiz",
      chapters: "Chapters",
      copySuccess: "Content copied!",
      scriptureAnchor: "Scripture Anchor",
      exposition: "Exposition",
      realityCheck: "Reality Check",
      practicalImplications: "Practical Implications",
      closingCharge: "Closing Charge",
      reflectionQuestions: "Reflection Questions",
      practiceBox: "Practice Box"
    },
    es: {
      title: "Cuatro Tonos de Mí",
      subtitle: "Descubre tu mezcla de temperamento",
      takeQuiz: "Tomar el Quiz",
      viewResults: "Ver Mis Resultados",
      readChapters: "Leer Capítulos",
      quizTitle: "El Quiz de Cuatro Tonos de Mí",
      question: "Pregunta",
      of: "de",
      next: "Siguiente",
      back: "Atrás",
      seeResults: "Ver Resultados",
      yourProfile: "Tu Perfil de Temperamento",
      dominant: "Dominante",
      secondary: "Secundario",
      tertiary: "Terciario",
      rare: "Raro",
      retakeQuiz: "Repetir Quiz",
      chapters: "Capítulos",
      copySuccess: "¡Contenido copiado!",
      scriptureAnchor: "Ancla de Escritura",
      exposition: "Exposición",
      realityCheck: "Verificación de Realidad",
      practicalImplications: "Implicaciones Prácticas",
      closingCharge: "Llamado Final",
      reflectionQuestions: "Preguntas de Reflexión",
      practiceBox: "Caja de Práctica"
    }
  };

  const texts = t[lang] || t.en;

  const handleAnswer = (temperament: 'sanguine' | 'choleric' | 'melancholic' | 'phlegmatic') => {
    const newAnswers = [...answers, temperament];
    setAnswers(newAnswers);
    
    if (currentQuestion < temperamentQuiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const result = scoreTemperamentQuiz(newAnswers);
      setProfile(result);
      localStorage.setItem(`four-shades-profile-${userId}`, JSON.stringify(result));
      setView('results');
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setView('quiz');
  };

  const copyContent = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({ title: texts.copySuccess });
  };

  const getTemperamentColor = (temp: string) => {
    const colors: Record<string, string> = {
      sanguine: 'bg-yellow-500',
      choleric: 'bg-red-500',
      melancholic: 'bg-blue-500',
      phlegmatic: 'bg-green-500'
    };
    return colors[temp] || 'bg-gray-500';
  };

  // Home View
  if (view === 'home') {
    return (
      <div className="px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">{texts.title}</h1>
          <p className="text-white/60">{texts.subtitle}</p>
        </div>
        
        <div className="space-y-4">
          <Button onClick={() => setView('quiz')} className="w-full bg-gradient-to-r from-yellow-500 via-red-500 to-blue-500">
            {profile ? texts.retakeQuiz : texts.takeQuiz}
          </Button>
          
          {profile && (
            <>
              <Button onClick={() => setView('results')} variant="outline" className="w-full border-white/20 text-white">
                {texts.viewResults}
              </Button>
              <Button onClick={() => setView('chapters')} variant="outline" className="w-full border-white/20 text-white">
                <BookOpen className="w-4 h-4 mr-2" />
                {texts.readChapters}
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  // Quiz View
  if (view === 'quiz') {
    const question = temperamentQuiz[currentQuestion];
    return (
      <div className="px-6 py-8">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-white mb-2">{texts.quizTitle}</h2>
          <p className="text-white/60">{texts.question} {currentQuestion + 1} {texts.of} {temperamentQuiz.length}</p>
        </div>
        
        <div className="bg-white/5 rounded-lg p-4 mb-6">
          <p className="text-white text-lg">{question.question[lang]}</p>
        </div>
        
        <div className="space-y-3">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(option.temperament)}
              className="w-full text-left p-4 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              {option.text[lang]}
            </button>
          ))}
        </div>
        
        {currentQuestion > 0 && (
          <Button
            variant="ghost"
            onClick={() => {
              setCurrentQuestion(currentQuestion - 1);
              setAnswers(answers.slice(0, -1));
            }}
            className="mt-4 text-white"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            {texts.back}
          </Button>
        )}
      </div>
    );
  }

  // Results View
  if (view === 'results' && profile) {
    const ranks = [texts.dominant, texts.secondary, texts.tertiary, texts.rare];
    return (
      <div className="px-6 py-8">
        <h2 className="text-xl font-bold text-white text-center mb-6">{texts.yourProfile}</h2>
        
        <div className="space-y-4">
          {profile.scores.map((score, idx) => {
            const info = temperamentInfo[score.temperament];
            return (
              <div key={score.temperament} className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-4 h-4 rounded-full ${getTemperamentColor(score.temperament)}`} />
                  <span className="text-white font-semibold">{ranks[idx]}: {info.role[lang]}</span>
                </div>
                <p className="text-white/70 text-sm">{info.summary[lang]}</p>
              </div>
            );
          })}
        </div>
        
        <div className="flex gap-3 mt-6">
          <Button onClick={resetQuiz} variant="outline" className="flex-1 border-white/20 text-white">
            {texts.retakeQuiz}
          </Button>
          <Button onClick={() => setView('chapters')} className="flex-1">
            <BookOpen className="w-4 h-4 mr-2" />
            {texts.readChapters}
          </Button>
        </div>
      </div>
    );
  }

  // Chapters List View
  if (view === 'chapters') {
    return (
      <div className="px-6 py-8">
        <h2 className="text-xl font-bold text-white text-center mb-6">{texts.chapters}</h2>
        
        <div className="space-y-3">
          {temperamentChapters.map((chapter, idx) => (
            <button
              key={chapter.id}
              onClick={() => { setSelectedChapter(idx); setView('chapter-detail'); }}
              className="w-full text-left p-4 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${getTemperamentColor(chapter.temperament)}`} />
                <span className="text-white font-semibold">{chapter.title[lang]}</span>
              </div>
            </button>
          ))}
        </div>
        
        <Button onClick={() => setView('home')} variant="ghost" className="mt-4 text-white">
          <ChevronLeft className="w-4 h-4 mr-2" />
          {texts.back}
        </Button>
      </div>
    );
  }

  // Chapter Detail View
  if (view === 'chapter-detail') {
    const chapter = temperamentChapters[selectedChapter];
    const fullContent = `${chapter.title[lang]}\n\n${texts.scriptureAnchor}:\n${chapter.scriptureAnchor[lang]}\n\n${texts.exposition}:\n${chapter.exposition[lang]}\n\n${texts.realityCheck}:\n${chapter.realityCheck[lang]}\n\n${texts.practicalImplications}:\n${chapter.practicalImplications[lang]}\n\n${texts.closingCharge}:\n${chapter.closingCharge[lang]}`;
    
    return (
      <div className="px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <Button onClick={() => setView('chapters')} variant="ghost" className="text-white p-2">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button onClick={() => copyContent(fullContent)} variant="ghost" className="text-white p-2">
            <Copy className="w-5 h-5" />
          </Button>
        </div>
        
        <div className={`w-8 h-8 rounded-full ${getTemperamentColor(chapter.temperament)} mx-auto mb-4`} />
        <h2 className="text-xl font-bold text-white text-center mb-6">{chapter.title[lang]}</h2>
        
        <div className="space-y-6 text-white/90">
          <section>
            <h3 className="text-pink-400 font-semibold mb-2">{texts.scriptureAnchor}</h3>
            <p className="whitespace-pre-line italic">{chapter.scriptureAnchor[lang]}</p>
          </section>
          
          <section>
            <h3 className="text-pink-400 font-semibold mb-2">{texts.exposition}</h3>
            <p className="whitespace-pre-line">{chapter.exposition[lang]}</p>
          </section>
          
          <section>
            <h3 className="text-pink-400 font-semibold mb-2">{texts.realityCheck}</h3>
            <p className="whitespace-pre-line">{chapter.realityCheck[lang]}</p>
          </section>
          
          <section>
            <h3 className="text-pink-400 font-semibold mb-2">{texts.practicalImplications}</h3>
            <p className="whitespace-pre-line">{chapter.practicalImplications[lang]}</p>
          </section>
          
          <section>
            <h3 className="text-pink-400 font-semibold mb-2">{texts.closingCharge}</h3>
            <p className="whitespace-pre-line">{chapter.closingCharge[lang]}</p>
          </section>
          
          <section>
            <h3 className="text-pink-400 font-semibold mb-2">{texts.reflectionQuestions}</h3>
            <ul className="list-disc list-inside space-y-2">
              {chapter.reflectionQuestions.map((q, i) => <li key={i}>{q[lang]}</li>)}
            </ul>
          </section>
          
          <section>
            <h3 className="text-pink-400 font-semibold mb-2">{texts.practiceBox}</h3>
            <ul className="list-disc list-inside space-y-2">
              {chapter.practiceBox.map((p, i) => <li key={i}>{p[lang]}</li>)}
            </ul>
          </section>
        </div>
        
        <div className="flex justify-between mt-8">
          <Button
            onClick={() => setSelectedChapter(Math.max(0, selectedChapter - 1))}
            disabled={selectedChapter === 0}
            variant="ghost"
            className="text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => setSelectedChapter(Math.min(temperamentChapters.length - 1, selectedChapter + 1))}
            disabled={selectedChapter === temperamentChapters.length - 1}
            variant="ghost"
            className="text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return null;
};
