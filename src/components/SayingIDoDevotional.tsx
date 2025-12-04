import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Copy, BookOpen, Check, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getSayingIDoDevotional, SayingIDoEntry } from '@/lib/sayingIDoData';

interface SayingIDoDevotionalProps {
  userId: string;
  coupleId: string;
}

export const SayingIDoDevotional = ({ userId, coupleId }: SayingIDoDevotionalProps) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [currentDay, setCurrentDay] = useState(1);
  const [maxUnlockedDay, setMaxUnlockedDay] = useState(1);
  const [startedAt, setStartedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showArchive, setShowArchive] = useState(false);

  const t = {
    en: {
      title: "Saying I Do",
      subtitle: "Pre-Marriage Devotional Series",
      day: "Day",
      of: "of",
      totalDays: "22",
      locked: "Unlocks in",
      hours: "hours",
      archive: "Archive",
      backToReading: "Back to Reading",
      copied: "Copied to clipboard",
      scriptureAnchor: "Scripture Anchor",
      exposition: "Exposition",
      realityCheck: "Reality Check",
      practicalImplications: "Practical Implications",
      closingCharge: "Closing Charge",
      reflectionQuestions: "Reflection Questions",
      practiceBox: "Practice Box",
      loading: "Loading..."
    },
    es: {
      title: "Diciendo Sí Acepto",
      subtitle: "Serie Devocional Pre-Matrimonial",
      day: "Día",
      of: "de",
      totalDays: "22",
      locked: "Se desbloquea en",
      hours: "horas",
      archive: "Archivo",
      backToReading: "Volver a Lectura",
      copied: "Copiado al portapapeles",
      scriptureAnchor: "Ancla de Escritura",
      exposition: "Exposición",
      realityCheck: "Confrontación de Realidad",
      practicalImplications: "Implicaciones Prácticas",
      closingCharge: "Exhortación Final",
      reflectionQuestions: "Preguntas de Reflexión",
      practiceBox: "Caja de Práctica",
      loading: "Cargando..."
    }
  };

  const texts = t[language as 'en' | 'es'] || t.en;
  const lang = (language as 'en' | 'es') || 'en';

  useEffect(() => {
    loadProgress();
  }, [userId, coupleId]);

  const loadProgress = async () => {
    try {
      // Use a different table or column to track Saying I Do progress
      // For now, we'll use localStorage until we add a database migration
      const savedProgress = localStorage.getItem(`sayingido_progress_${userId}`);
      if (savedProgress) {
        const data = JSON.parse(savedProgress);
        setCurrentDay(data.currentDay || 1);
        setStartedAt(data.startedAt);
        
        // Calculate max unlocked day based on start date
        if (data.startedAt) {
          const startDate = new Date(data.startedAt);
          const now = new Date();
          const daysSinceStart = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
          setMaxUnlockedDay(Math.min(22, daysSinceStart + 1));
        }
      } else {
        // First time - initialize progress
        const now = new Date().toISOString();
        const newProgress = { currentDay: 1, startedAt: now };
        localStorage.setItem(`sayingido_progress_${userId}`, JSON.stringify(newProgress));
        setStartedAt(now);
        setMaxUnlockedDay(1);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = (day: number) => {
    try {
      const progress = {
        currentDay: day,
        startedAt: startedAt || new Date().toISOString()
      };
      localStorage.setItem(`sayingido_progress_${userId}`, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const entry = getSayingIDoDevotional(currentDay);

  const copyDevotional = (entry: SayingIDoEntry) => {
    const text = `
${texts.day} ${entry.day}: ${entry.title[lang]}

${texts.scriptureAnchor}:
${entry.scriptureAnchor[lang]}

${texts.exposition}:
${entry.exposition[lang]}

${texts.realityCheck}:
${entry.realityCheck[lang]}

${texts.practicalImplications}:
${entry.practicalImplications[lang]}

${texts.closingCharge}:
${entry.closingCharge[lang]}

${texts.reflectionQuestions}:
${entry.reflectionQuestions.map((q, i) => `${i + 1}. ${q[lang]}`).join('\n')}

${texts.practiceBox}:
${entry.practiceBox.map((p, i) => `• ${p[lang]}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: texts.copied,
      duration: 2000
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const navigateDay = (direction: 'prev' | 'next') => {
    const newDay = direction === 'prev' ? currentDay - 1 : currentDay + 1;
    if (newDay >= 1 && newDay <= maxUnlockedDay) {
      setCurrentDay(newDay);
      saveProgress(newDay);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white/60">{texts.loading}</div>
      </div>
    );
  }

  if (showArchive) {
    return (
      <div className="px-4 py-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-white mb-2">{texts.archive}</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowArchive(false)}
            className="text-pink-400 hover:text-pink-300"
          >
            {texts.backToReading}
          </Button>
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 22 }, (_, i) => i + 1).map((day) => {
            const isUnlocked = day <= maxUnlockedDay;
            const devotional = getSayingIDoDevotional(day);
            return (
              <button
                key={day}
                onClick={() => {
                  if (isUnlocked) {
                    setCurrentDay(day);
                    saveProgress(day);
                    setShowArchive(false);
                  }
                }}
                disabled={!isUnlocked}
                className={`p-3 rounded-lg text-center transition-all ${
                  isUnlocked
                    ? 'bg-pink-900/50 hover:bg-pink-800/50 text-white'
                    : 'bg-white/5 text-white/30 cursor-not-allowed'
                } ${currentDay === day ? 'ring-2 ring-pink-500' : ''}`}
              >
                <div className="text-xs text-white/60">{texts.day}</div>
                <div className="text-lg font-bold">{day}</div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white/60">Devotional not found</div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 w-full">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">{texts.title}</h1>
        <p className="text-white/60 text-sm">{texts.subtitle}</p>
        <div className="flex items-center justify-center gap-2 mt-2 text-pink-400">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">{texts.day} {currentDay} {texts.of} {texts.totalDays}</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateDay('prev')}
          disabled={currentDay <= 1}
          className="text-white hover:bg-white/10 disabled:opacity-30"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowArchive(true)}
            className="text-pink-400 hover:text-pink-300 hover:bg-white/10"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            {texts.archive}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyDevotional(entry)}
            className="text-pink-400 hover:text-pink-300 hover:bg-white/10"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateDay('next')}
          disabled={currentDay >= maxUnlockedDay}
          className="text-white hover:bg-white/10 disabled:opacity-30"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Title */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-white">{entry.title[lang]}</h2>
        </div>

        {/* Scripture Anchor */}
        <div className="bg-pink-900/30 rounded-lg p-4 border border-pink-500/20">
          <h3 className="text-pink-400 font-semibold mb-2 text-sm uppercase tracking-wide">
            {texts.scriptureAnchor}
          </h3>
          <p className="text-white/90 whitespace-pre-line italic text-sm leading-relaxed">
            {entry.scriptureAnchor[lang]}
          </p>
        </div>

        {/* Exposition */}
        <div className="bg-white/5 rounded-lg p-4">
          <h3 className="text-pink-400 font-semibold mb-3 text-sm uppercase tracking-wide">
            {texts.exposition}
          </h3>
          <p className="text-white/80 whitespace-pre-line text-sm leading-relaxed">
            {entry.exposition[lang]}
          </p>
        </div>

        {/* Reality Check */}
        <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/20">
          <h3 className="text-red-400 font-semibold mb-3 text-sm uppercase tracking-wide">
            {texts.realityCheck}
          </h3>
          <p className="text-white/80 whitespace-pre-line text-sm leading-relaxed">
            {entry.realityCheck[lang]}
          </p>
        </div>

        {/* Practical Implications */}
        <div className="bg-white/5 rounded-lg p-4">
          <h3 className="text-pink-400 font-semibold mb-3 text-sm uppercase tracking-wide">
            {texts.practicalImplications}
          </h3>
          <p className="text-white/80 whitespace-pre-line text-sm leading-relaxed">
            {entry.practicalImplications[lang]}
          </p>
        </div>

        {/* Closing Charge */}
        <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/20">
          <h3 className="text-purple-400 font-semibold mb-3 text-sm uppercase tracking-wide">
            {texts.closingCharge}
          </h3>
          <p className="text-white/80 whitespace-pre-line text-sm leading-relaxed">
            {entry.closingCharge[lang]}
          </p>
        </div>

        {/* Reflection Questions */}
        <div className="bg-white/5 rounded-lg p-4">
          <h3 className="text-pink-400 font-semibold mb-3 text-sm uppercase tracking-wide">
            {texts.reflectionQuestions}
          </h3>
          <ol className="space-y-2">
            {entry.reflectionQuestions.map((question, index) => (
              <li key={index} className="text-white/80 text-sm flex gap-2">
                <span className="text-pink-400 font-semibold">{index + 1}.</span>
                <span>{question[lang]}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Practice Box */}
        <div className="bg-pink-900/30 rounded-lg p-4 border border-pink-500/20">
          <h3 className="text-pink-400 font-semibold mb-3 text-sm uppercase tracking-wide">
            {texts.practiceBox}
          </h3>
          <ul className="space-y-2">
            {entry.practiceBox.map((practice, index) => (
              <li key={index} className="text-white/80 text-sm flex gap-2">
                <span className="text-pink-400">•</span>
                <span>{practice[lang]}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
