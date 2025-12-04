import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, BookOpen } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { DailyLoveActionBook } from '@/components/DailyLoveActionBook';
import { CouplesDevotional } from '@/components/CouplesDevotional';
import { SayingIDoDevotional } from '@/components/SayingIDoDevotional';
import { FourShadesOfMe } from '@/components/FourShadesOfMe';
import allYearLoveBook from '@/assets/books/all-year-love.png';
import couplesDevotionalBook from '@/assets/books/couples-devotional.png';
import sayingIDoBook from '@/assets/books/saying-i-do.png';
import fourShadesBook from '@/assets/books/four-shades-of-me.png';

interface CouplesLibraryProps {
  userId: string;
  coupleId: string;
  partnerUserId: string | null;
  onOpenGames?: () => void;
}

type BookView = 'library' | 'daily-love-actions' | 'devotional' | 'saying-i-do' | 'four-shades';

export const CouplesLibrary = ({ userId, coupleId, partnerUserId, onOpenGames }: CouplesLibraryProps) => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState<BookView>('library');

  const t = {
    en: {
      title: "Couple's Library",
      subtitle: "Your collection of love guides",
      comingSoon: "Coming Soon",
      backToLibrary: "Back to Library",
      allYearLoveAlt: "All Year Love",
      couplesDevotionalAlt: "Couples Devotional",
      sayingIDoAlt: "Saying I Do",
      fourShadesAlt: "Four Shades of Me",
    },
    es: {
      title: "Biblioteca de Pareja",
      subtitle: "Tu colección de guías de amor",
      comingSoon: "Próximamente",
      backToLibrary: "Volver a Biblioteca",
      allYearLoveAlt: "Amor Todo el Año",
      couplesDevotionalAlt: "Devocional de Pareja",
      sayingIDoAlt: "Diciendo Sí Acepto",
      fourShadesAlt: "Cuatro Tonos de Mí",
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
                    alt={texts.allYearLoveAlt}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </button>

              <button
                onClick={() => setCurrentBook('devotional')}
                className="group relative w-40 transition-transform hover:scale-105 active:scale-95"
              >
                <div className="relative rounded-lg overflow-hidden shadow-2xl shadow-amber-500/20">
                  <img
                    src={couplesDevotionalBook}
                    alt={texts.couplesDevotionalAlt}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </button>

              <button
                onClick={() => setCurrentBook('saying-i-do')}
                className="group relative w-40 transition-transform hover:scale-105 active:scale-95"
              >
                <div className="relative rounded-lg overflow-hidden shadow-2xl shadow-pink-500/20">
                  <img
                    src={sayingIDoBook}
                    alt={texts.sayingIDoAlt}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </button>

              <button
                onClick={() => setCurrentBook('four-shades')}
                className="group relative w-40 transition-transform hover:scale-105 active:scale-95"
              >
                <div className="relative rounded-lg overflow-hidden shadow-2xl shadow-green-500/20">
                  <img
                    src={fourShadesBook}
                    alt={texts.fourShadesAlt}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </button>
            </div>

            <div className="mt-6 h-2 bg-gradient-to-r from-transparent via-pink-900/50 to-transparent rounded-full" />
          </div>
        )}

        {currentBook === 'daily-love-actions' && (
          <DailyLoveActionBook
            userId={userId}
            partnerUserId={partnerUserId}
            onOpenGames={onOpenGames}
          />
        )}

        {currentBook === 'devotional' && (
          <CouplesDevotional
            userId={userId}
            coupleId={coupleId}
          />
        )}

        {currentBook === 'saying-i-do' && (
          <SayingIDoDevotional
            userId={userId}
            coupleId={coupleId}
          />
        )}

        {currentBook === 'four-shades' && (
          <FourShadesOfMe
            userId={userId}
            coupleId={coupleId}
          />
        )}
      </div>
    </div>
  );
};
