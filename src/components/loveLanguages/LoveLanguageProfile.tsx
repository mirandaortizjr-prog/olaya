import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Award, TrendingUp } from 'lucide-react';
import { LoveLanguageProfile as ProfileType } from '@/lib/loveLanguages/scoring';
import { languageNames } from '@/lib/loveLanguages/scoring';
import { useLanguage } from '@/contexts/LanguageContext';

interface LoveLanguageProfileProps {
  profile: ProfileType;
  onRetakeQuiz: () => void;
}

export const LoveLanguageProfile = ({ profile, onRetakeQuiz }: LoveLanguageProfileProps) => {
  const { language } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      {/* Profile Title Card */}
      <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
        <CardHeader>
          <div className="flex items-center justify-center gap-3 mb-2">
            <Award className="w-8 h-8 text-primary" />
            <CardTitle className="text-3xl text-center">{profile.profileTitle}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-center text-lg text-muted-foreground leading-relaxed">
            {profile.profileDescription[language as 'en' | 'es']}
          </p>
        </CardContent>
      </Card>

      {/* Ranked Love Languages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Your Love Language Ranking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile.scores.map((score, index) => (
            <div key={score.language} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-primary">#{score.rank}</span>
                  <div>
                    <p className="font-semibold">
                      {languageNames[score.language][language as 'en' | 'es']}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {score.score} responses ({score.percentage}%)
                    </p>
                  </div>
                </div>
                <Heart 
                  className={`w-6 h-6 ${
                    index === 0 ? 'fill-primary text-primary' :
                    index === 1 ? 'fill-primary/60 text-primary/60' :
                    'text-muted-foreground'
                  }`} 
                />
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full transition-all ${
                    index === 0 ? 'bg-primary' :
                    index === 1 ? 'bg-primary/70' :
                    index === 2 ? 'bg-primary/40' :
                    'bg-primary/20'
                  }`}
                  style={{ width: `${score.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Primary & Secondary */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-primary/5 border-primary/30">
          <CardHeader>
            <CardTitle className="text-lg">Primary Love Language</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-xl text-primary">
              {languageNames[profile.primaryLanguage as keyof typeof languageNames][language as 'en' | 'es']}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              This is how you most strongly express and receive love
            </p>
          </CardContent>
        </Card>

        <Card className="bg-secondary/5 border-secondary/30">
          <CardHeader>
            <CardTitle className="text-lg">Secondary Love Language</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-xl">
              {languageNames[profile.secondaryLanguage as keyof typeof languageNames][language as 'en' | 'es']}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              This complements your primary language
            </p>
          </CardContent>
        </Card>
      </div>

      <Button onClick={onRetakeQuiz} variant="outline" className="w-full">
        Retake Quiz
      </Button>
    </div>
  );
};
