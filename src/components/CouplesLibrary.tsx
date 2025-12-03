import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, BookOpen } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { DailyLoveActionBook } from '@/components/DailyLoveActionBook';
import allYearLoveBook from '@/assets/books/all-year-love.png';
import couplesDevotionalBook from '@/assets/books/couples-devotional.png';

interface CouplesLibraryProps {
  userId: string;
  partnerUserId: string | null;
  onOpenGames?: () => void;
}

type BookView = 'library' | 'daily-love-actions' | 'devotional';

export const CouplesLibrary = ({ userId, partnerUserId, onOpenGames }: CouplesLibraryProps) => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState<BookView>('library');

  const t = {
    en: {
      title: "Couple's Library",
      subtitle: "Your collection of love guides",
      comingSoon: "Coming Soon",
      backToLibrary: "Back to Library",
    },
    es: {
      title: "Biblioteca de Pareja",
      subtitle: "Tu colección de guías de amor",
      comingSoon: "Próximamente",
      backToLibrary: "Volver a Biblioteca",
    }
  };

  const texts = t[language as 'en' | 'es'] || t.en;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full p-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg border border-border/50 hover:border-purple-500/50 transition-all group"
      >
        <div className="flex items-center justify-center gap-3">
          <BookOpen className="w-5 h-5 text-white" />
          <span className="font-semibold text-white">{texts.title}</span>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
        {currentBook !== 'library' ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentBook('library')}
            className="text-white hover:bg-white/10"
          >
            <X className="w-4 h-4 mr-2" />
            {texts.backToLibrary}
          </Button>
        ) : (
          <div />
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setIsOpen(false);
            setCurrentBook('library');
          }}
          className="text-white hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="h-full overflow-y-auto pt-16 pb-8">
        {currentBook === 'library' && (
          <div className="px-6 py-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">{texts.title}</h1>
              <p className="text-white/60">{texts.subtitle}</p>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setCurrentBook('daily-love-actions')}
                className="group relative w-40 transition-transform hover:scale-105 active:scale-95"
              >
                <div className="relative rounded-lg overflow-hidden shadow-2xl shadow-pink-500/20">
                  <img
                    src={allYearLoveBook}
                    alt="All Year Love"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </button>

              <div className="relative w-40 opacity-60">
                <div className="relative rounded-lg overflow-hidden shadow-2xl">
                  <img
                    src={couplesDevotionalBook}
                    alt="Couples Devotional"
                    className="w-full h-auto object-cover grayscale"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white text-xs font-bold bg-black/60 px-3 py-1 rounded-full">
                      {texts.comingSoon}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 h-2 bg-gradient-to-r from-transparent via-amber-900/50 to-transparent rounded-full" />
          </div>
        )}

        {currentBook === 'daily-love-actions' && (
          <DailyLoveActionBook
            userId={userId}
            partnerUserId={partnerUserId}
            onOpenGames={onOpenGames}
          />
        )}
      </div>
    </div>
  );
};
