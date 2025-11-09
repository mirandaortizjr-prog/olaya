import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuizResult } from "@/lib/intimacyLanguages/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { Flame, Heart, Sparkles } from "lucide-react";

interface IntimacyProfileProps {
  lustResult: QuizResult | null;
  sexResult: QuizResult | null;
  onRetakeQuiz: (type: 'lust' | 'sex') => void;
}

export const IntimacyProfile = ({ lustResult, sexResult, onRetakeQuiz }: IntimacyProfileProps) => {
  const { language } = useLanguage();

  const profileDescriptions = {
    en: {
      'Romantic': 'You connect through emotional depth, loving words, and meaningful gestures. Romance fuels your desire.',
      'Sensual': 'Physical sensations, touch, and slow exploration light you up. You savor every moment.',
      'Playful': 'Laughter, teasing, and spontaneity keep things exciting. Fun is your aphrodisiac.',
      'Dominant': 'Confidence, control, and clear intentions turn you on. You thrive on intensity.',
      'Fun': 'Variety, adventure, and spontaneity energize your intimate life. Keep it fresh!',
      'Desire': 'Raw passion and intense craving drive you. You love expressing and receiving urgency.',
      'Pleasure': 'Mutual satisfaction and balance matter most. Giving and receiving equally fulfills you.',
      'Patience': 'Slow, mindful moments create the deepest connection. You value presence over speed.',
      'Celebration': 'Making intimacy special and cherished matters to you. Every moment is an event.',
    },
    es: {
      'Romántico/a': 'Te conectas a través de profundidad emocional, palabras amorosas y gestos significativos.',
      'Sensual': 'Sensaciones físicas, tacto y exploración lenta te iluminan. Saboreas cada momento.',
      'Juguetón/a': 'Risas, juegos y espontaneidad mantienen las cosas emocionantes. La diversión es tu afrodisíaco.',
      'Dominante': 'Confianza, control e intenciones claras te excitan. Prosperas en intensidad.',
      'Diversión': '¡Variedad, aventura y espontaneidad energizan tu vida íntima. Mantenlo fresco!',
      'Deseo': 'Pasión cruda y anhelo intenso te impulsan. Amas expresar y recibir urgencia.',
      'Placer': 'Satisfacción mutua y balance importan más. Dar y recibir igualmente te completa.',
      'Paciencia': 'Momentos lentos y conscientes crean la conexión más profunda. Valoras presencia sobre velocidad.',
      'Celebración': 'Hacer la intimidad especial y apreciada te importa. Cada momento es un evento.',
    }
  };

  return (
    <div className="space-y-6 p-4">
      {lustResult && (
        <Card className="p-6 bg-gradient-to-br from-rose-500/10 to-pink-500/10">
          <div className="flex items-center gap-3 mb-4">
            <Flame className="w-8 h-8 text-rose-500" />
            <h3 className="text-2xl font-semibold">
              {language === 'es' ? 'Tu Lenguaje de Deseo' : 'Your Lust Language'}
            </h3>
          </div>
          <div className="mb-4">
            <p className="text-3xl font-bold text-primary mb-2">{lustResult.primary}</p>
            <p className="text-muted-foreground">
              {profileDescriptions[language as 'en' | 'es'][lustResult.primary as keyof typeof profileDescriptions.en]}
            </p>
          </div>
          {lustResult.secondary.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm font-medium mb-2">
                {language === 'es' ? 'También resuenas con:' : 'You also resonate with:'}
              </p>
              <div className="flex flex-wrap gap-2">
                {lustResult.secondary.map((lang, i) => (
                  <span key={i} className="px-3 py-1 bg-primary/20 rounded-full text-sm">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}
          <Button 
            variant="outline" 
            className="mt-4 w-full"
            onClick={() => onRetakeQuiz('lust')}
          >
            {language === 'es' ? 'Retomar Quiz' : 'Retake Quiz'}
          </Button>
        </Card>
      )}

      {sexResult && (
        <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-indigo-500/10">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-purple-500" />
            <h3 className="text-2xl font-semibold">
              {language === 'es' ? 'Tu Lenguaje Sexual' : 'Your Sex Language'}
            </h3>
          </div>
          <div className="mb-4">
            <p className="text-3xl font-bold text-primary mb-2">{sexResult.primary}</p>
            <p className="text-muted-foreground">
              {profileDescriptions[language as 'en' | 'es'][sexResult.primary as keyof typeof profileDescriptions.en]}
            </p>
          </div>
          {sexResult.secondary.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm font-medium mb-2">
                {language === 'es' ? 'También resuenas con:' : 'You also resonate with:'}
              </p>
              <div className="flex flex-wrap gap-2">
                {sexResult.secondary.map((lang, i) => (
                  <span key={i} className="px-3 py-1 bg-primary/20 rounded-full text-sm">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}
          <Button 
            variant="outline" 
            className="mt-4 w-full"
            onClick={() => onRetakeQuiz('sex')}
          >
            {language === 'es' ? 'Retomar Quiz' : 'Retake Quiz'}
          </Button>
        </Card>
      )}
    </div>
  );
};
