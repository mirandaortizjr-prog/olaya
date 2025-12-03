import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Copy, Check, ChevronLeft, ChevronRight, Book, Lock } from 'lucide-react';
import { getDevotional, DevotionalEntry, getCategory } from '@/lib/devotionalData';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CouplesDevotionalProps {
  userId: string;
  coupleId: string;
}

export const CouplesDevotional = ({ userId, coupleId }: CouplesDevotionalProps) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  
  const [currentDay, setCurrentDay] = useState(1);
  const [maxUnlockedDay, setMaxUnlockedDay] = useState(1);
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showArchive, setShowArchive] = useState(false);

  const t = {
    en: {
      title: "Couples Devotional",
      day: "Day",
      of: "of",
      category: "Category",
      reflectionQuestions: "Reflection Questions",
      practiceBox: "Practice Box",
      copyAll: "Copy",
      copied: "Copied!",
      archive: "Archive",
      backToToday: "Back to Today",
      locked: "Unlocks in",
      days: "days",
      devotional: "Devotional",
      loading: "Loading devotional...",
    },
    es: {
      title: "Devocional de Pareja",
      day: "Día",
      of: "de",
      category: "Categoría",
      reflectionQuestions: "Preguntas de Reflexión",
      practiceBox: "Práctica",
      copyAll: "Copiar",
      copied: "¡Copiado!",
      archive: "Archivo",
      backToToday: "Volver a Hoy",
      locked: "Desbloquea en",
      days: "días",
      devotional: "Devocional",
      loading: "Cargando devocional...",
    }
  };

  const texts = t[language as 'en' | 'es'] || t.en;

  useEffect(() => {
    loadProgress();
  }, [userId, coupleId]);

  const loadProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('devotional_progress')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading devotional progress:', error);
      }

      if (data) {
        const started = new Date(data.started_at);
        setStartedAt(started);
        
        // Calculate days since start
        const now = new Date();
        const daysSinceStart = Math.floor((now.getTime() - started.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        const unlocked = Math.min(daysSinceStart, 365);
        
        setMaxUnlockedDay(unlocked);
        setCurrentDay(unlocked);
      } else {
        // Create new progress record
        const { error: insertError } = await supabase
          .from('devotional_progress')
          .insert({
            user_id: userId,
            couple_id: coupleId,
            started_at: new Date().toISOString(),
            current_day: 1
          });

        if (insertError) {
          console.error('Error creating devotional progress:', insertError);
        }

        setStartedAt(new Date());
        setMaxUnlockedDay(1);
        setCurrentDay(1);
      }
    } finally {
      setLoading(false);
    }
  };

  const copyDevotional = async (entry: DevotionalEntry) => {
    const text = `Day ${entry.day} — ${entry.title}

Quote: "${entry.quote}" — ${entry.author}

Devotional:
${entry.devotional}

Reflection Questions:
${entry.reflectionQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

Practice Box:
${entry.practiceBox.map((p, i) => `• ${p}`).join('\n')}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: texts.copied,
        description: `Day ${entry.day} copied to clipboard`
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const navigateDay = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentDay > 1) {
      setCurrentDay(currentDay - 1);
    } else if (direction === 'next' && currentDay < maxUnlockedDay) {
      setCurrentDay(currentDay + 1);
    }
  };

  const getDaysUntilUnlock = (day: number): number => {
    return day - maxUnlockedDay;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Book className="w-8 h-8 text-pink-500 animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">{texts.loading}</p>
        </div>
      </div>
    );
  }

  const entry = getDevotional(currentDay);

  // Archive View
  if (showArchive) {
    return (
      <div className="px-2 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">{texts.archive}</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowArchive(false)}
          >
            {texts.backToToday}
          </Button>
        </div>
        
        <ScrollArea className="h-[450px]">
          <div className="space-y-2 pr-2">
            {Array.from({ length: 365 }, (_, i) => i + 1).map(day => {
              const isUnlocked = day <= maxUnlockedDay;
              const dayEntry = getDevotional(day);
              
              return (
                <button
                  key={day}
                  onClick={() => isUnlocked && (setCurrentDay(day), setShowArchive(false))}
                  disabled={!isUnlocked}
                  className={`w-full p-3 rounded-lg text-left transition-all ${
                    isUnlocked
                      ? 'bg-card hover:bg-accent cursor-pointer'
                      : 'bg-muted/30 cursor-not-allowed opacity-60'
                  } ${day === currentDay ? 'ring-2 ring-primary' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <span className="text-xs text-muted-foreground">
                        {texts.day} {day}
                      </span>
                      <p className="font-medium text-foreground text-sm truncate">
                        {dayEntry.title}
                      </p>
                      <span className="text-xs text-primary/70">
                        {getCategory(day)}
                      </span>
                    </div>
                    {!isUnlocked && (
                      <div className="flex items-center gap-1 text-muted-foreground ml-2">
                        <Lock className="w-4 h-4" />
                        <span className="text-xs">{getDaysUntilUnlock(day)}d</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    );
  }

  // Main Devotional View
  return (
    <div className="px-2 py-2">
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-600/20 to-purple-600/20 p-4 border-b border-border/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-pink-400 uppercase tracking-wide">
                {entry.category}
              </span>
              <span className="text-xs text-muted-foreground">
                {texts.day} {currentDay} {texts.of} 365
              </span>
            </div>
            <h2 className="text-lg font-bold text-foreground">{entry.title}</h2>
          </div>

          {/* Quote */}
          <div className="p-4 bg-background/30 border-b border-border/30">
            <blockquote className="italic text-foreground/90 text-sm">
              "{entry.quote}"
            </blockquote>
            <p className="text-xs text-muted-foreground mt-1">— {entry.author}</p>
          </div>

          {/* Devotional Content */}
          <div className="p-4 border-b border-border/30">
            <h3 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
              <Heart className="w-4 h-4" />
              {texts.devotional}
            </h3>
            <p className="text-foreground/90 leading-relaxed text-sm">
              {entry.devotional}
            </p>
          </div>

          {/* Reflection Questions */}
          <div className="p-4 border-b border-border/30 bg-primary/5">
            <h3 className="text-sm font-semibold text-primary mb-3">
              {texts.reflectionQuestions}
            </h3>
            <ul className="space-y-2">
              {entry.reflectionQuestions.map((question, i) => (
                <li key={i} className="flex gap-2 text-sm text-foreground/90">
                  <span className="text-primary font-medium">{i + 1}.</span>
                  <span>{question}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Practice Box */}
          <div className="p-4 bg-pink-500/10">
            <h3 className="text-sm font-semibold text-pink-400 mb-3">
              {texts.practiceBox}
            </h3>
            <ul className="space-y-2">
              {entry.practiceBox.map((practice, i) => (
                <li key={i} className="flex gap-2 text-sm text-foreground/90">
                  <span className="text-pink-400">•</span>
                  <span>{practice}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="p-3 flex items-center justify-between border-t border-border/30">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => navigateDay('prev')}
                disabled={currentDay <= 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => navigateDay('next')}
                disabled={currentDay >= maxUnlockedDay}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={() => setShowArchive(true)}
              >
                <Book className="w-3 h-3 mr-1" />
                {texts.archive}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={() => copyDevotional(entry)}
              >
                {copied ? (
                  <Check className="w-3 h-3 mr-1 text-green-500" />
                ) : (
                  <Copy className="w-3 h-3 mr-1" />
                )}
                {copied ? texts.copied : texts.copyAll}
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
