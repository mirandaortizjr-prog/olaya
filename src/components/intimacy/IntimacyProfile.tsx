import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuizResult } from "@/lib/intimacyLanguages/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { Flame, Sparkles } from "lucide-react";

interface IntimacyProfileProps {
  lustResult: QuizResult | null;
  sexResult: QuizResult | null;
  onRetakeQuiz: (type: 'lust' | 'sex') => void;
}

export const IntimacyProfile = ({ lustResult, sexResult, onRetakeQuiz }: IntimacyProfileProps) => {
  const { language, t } = useLanguage();

  const getDescription = (lang: string) => {
    const descMap: Record<string, string> = {
      'Romantic': 'romanticDesc',
      'Romántico/a': 'romanticDesc',
      'Sensual': 'sensualDesc',
      'Playful': 'playfulDesc',
      'Juguetón/a': 'playfulDesc',
      'Dominant': 'dominantDesc',
      'Dominante': 'dominantDesc',
      'Fun': 'funDesc',
      'Diversión': 'funDesc',
      'Desire': 'desireDesc',
      'Deseo': 'desireDesc',
      'Pleasure': 'pleasureDesc',
      'Placer': 'pleasureDesc',
      'Patience': 'patienceDesc',
      'Paciencia': 'patienceDesc',
      'Celebration': 'celebrationDesc',
      'Celebración': 'celebrationDesc',
    };
    return t(descMap[lang] || 'romanticDesc');
  };

  return (
    <div className="space-y-6 p-4">
      {lustResult && (
        <Card className="p-6 bg-gradient-to-br from-rose-500/10 to-pink-500/10">
          <div className="flex items-center gap-3 mb-4">
            <Flame className="w-8 h-8 text-rose-500" />
            <h3 className="text-2xl font-semibold">
              {t('yourLustLanguage')}
            </h3>
          </div>
          <div className="mb-4">
            <p className="text-3xl font-bold text-primary mb-2">{lustResult.primary}</p>
            <p className="text-muted-foreground">
              {getDescription(lustResult.primary)}
            </p>
          </div>
          {lustResult.secondary.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm font-medium mb-2">
                {t('youAlsoResonateWith')}
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
            {t('retakeQuiz')}
          </Button>
        </Card>
      )}

      {sexResult && (
        <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-indigo-500/10">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-purple-500" />
            <h3 className="text-2xl font-semibold">
              {t('yourSexLanguage')}
            </h3>
          </div>
          <div className="mb-4">
            <p className="text-3xl font-bold text-primary mb-2">{sexResult.primary}</p>
            <p className="text-muted-foreground">
              {getDescription(sexResult.primary)}
            </p>
          </div>
          {sexResult.secondary.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm font-medium mb-2">
                {t('youAlsoResonateWith')}
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
            {t('retakeQuiz')}
          </Button>
        </Card>
      )}
    </div>
  );
};
