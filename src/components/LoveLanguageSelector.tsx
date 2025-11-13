import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LoveLanguageQuiz } from '@/components/loveLanguages/LoveLanguageQuiz';
import { LoveLanguageProfile as ProfileDisplay } from '@/components/loveLanguages/LoveLanguageProfile';
import { DailyActionTracker } from '@/components/loveLanguages/DailyActionTracker';
import { LoveLanguageProfile, LoveLanguageScore } from '@/lib/loveLanguages/scoring';

interface LoveLanguageSelectorProps {
  userId: string;
  partnerUserId?: string;
}

type View = 'menu' | 'quiz' | 'profile' | 'daily-actions';

const loveLanguages = [
  { 
    value: 'words_of_affirmation', 
    label: 'Words of Affirmation',
    description: 'You feel most loved when your partner expresses affection through words, compliments, and verbal encouragement.'
  },
  { 
    value: 'quality_time', 
    label: 'Quality Time',
    description: 'You feel most loved when your partner gives you their undivided attention and spends meaningful time together.'
  },
  { 
    value: 'receiving_gifts', 
    label: 'Receiving Gifts',
    description: 'You feel most loved when your partner gives you thoughtful gifts that show they were thinking of you.'
  },
  { 
    value: 'acts_of_service', 
    label: 'Acts of Service',
    description: 'You feel most loved when your partner does things to help you or make your life easier.'
  },
  { 
    value: 'physical_touch', 
    label: 'Physical Touch',
    description: 'You feel most loved through physical expressions of affection like hugs, kisses, and holding hands.'
  },
];

export const LoveLanguageSelector = ({ userId, partnerUserId }: LoveLanguageSelectorProps) => {
  const [view, setView] = useState<View>('menu');
  const [profile, setProfile] = useState<LoveLanguageProfile | null>(null);
  const [partnerProfile, setPartnerProfile] = useState<LoveLanguageProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadProfiles();
  }, [userId, partnerUserId]);

  const loadProfiles = async () => {
    setLoading(true);
    
    // Load user profile
    const { data: userData } = await supabase
      .from('love_languages')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (userData && userData.all_scores && userData.profile_title) {
      const scores = userData.all_scores as unknown as LoveLanguageScore[];
      setProfile({
        scores,
        profileTitle: userData.profile_title,
        profileDescription: { en: '', es: '' },
        primaryLanguage: userData.primary_language,
        secondaryLanguage: userData.secondary_language || ''
      });
    }

    // Load partner profile
    if (partnerUserId) {
      const { data: partnerData } = await supabase
        .from('love_languages')
        .select('*')
        .eq('user_id', partnerUserId)
        .maybeSingle();

      if (partnerData && partnerData.all_scores && partnerData.profile_title) {
        const partnerScores = partnerData.all_scores as unknown as LoveLanguageScore[];
        setPartnerProfile({
          scores: partnerScores,
          profileTitle: partnerData.profile_title,
          profileDescription: { en: '', es: '' },
          primaryLanguage: partnerData.primary_language,
          secondaryLanguage: partnerData.secondary_language || ''
        });
      }
    }

    setLoading(false);
  };

  const handleQuizComplete = async (completedProfile: LoveLanguageProfile) => {
    try {
      const { error } = await supabase.from('love_languages').upsert([{
        user_id: userId,
        primary_language: completedProfile.primaryLanguage,
        secondary_language: completedProfile.secondaryLanguage,
        all_scores: completedProfile.scores as any,
        profile_title: completedProfile.profileTitle,
        quiz_completed_at: new Date().toISOString(),
        current_day: 1
      }], {
        onConflict: 'user_id'
      });

      if (error) {
        console.error('Quiz save error:', error);
        toast({
          title: 'Error',
          description: 'Failed to save quiz results',
          variant: 'destructive'
        });
        return;
      }

      setProfile(completedProfile);
      setView('profile');
      
      toast({
        title: '🎉 Quiz Complete!',
        description: `You are ${completedProfile.profileTitle}!`
      });
    } catch (err) {
      console.error('Quiz save exception:', err);
      toast({
        title: 'Error',
        description: 'Failed to save quiz results',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (view === 'quiz') {
    return <LoveLanguageQuiz onComplete={handleQuizComplete} onBack={() => setView('menu')} />;
  }

  if (view === 'profile' && profile) {
    return <ProfileDisplay profile={profile} onRetakeQuiz={() => setView('quiz')} />;
  }

  if (view === 'daily-actions' && profile) {
    return <DailyActionTracker userId={userId} rankedLanguages={profile.scores} />;
  }

  // Main menu
  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          Love Language Decoder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!profile ? (
          <>
            <div className="text-center py-6 space-y-3">
              <Sparkles className="w-16 h-16 mx-auto text-primary opacity-50" />
              <h3 className="text-xl font-semibold">Discover Your Love Languages</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Take our comprehensive 20-question quiz to discover all 5 love languages ranked from strongest to weakest, 
                get your unique profile title, and unlock 365 days of personalized daily actions!
              </p>
            </div>
            <Button onClick={() => setView('quiz')} className="w-full" size="lg">
              <Sparkles className="w-5 h-5 mr-2" />
              Start Love Language Quiz
            </Button>
          </>
        ) : (
          <div className="space-y-3">
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <h4 className="font-semibold text-lg">{profile.profileTitle}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Primary: {profile.primaryLanguage} | Secondary: {profile.secondaryLanguage}
              </p>
            </div>

            <div className="grid gap-3">
              <Button onClick={() => setView('profile')} variant="outline" className="w-full">
                <Heart className="w-4 h-4 mr-2" />
                View Full Profile
              </Button>
              
              <Button onClick={() => setView('daily-actions')} className="w-full">
                <Calendar className="w-4 h-4 mr-2" />
                Today's Love Action
              </Button>

              <Button onClick={() => setView('quiz')} variant="ghost" className="w-full">
                Retake Quiz
              </Button>
            </div>
          </div>
        )}

        {partnerProfile && (
          <div className="mt-6 p-4 bg-secondary/10 rounded-lg border border-secondary/20">
            <h4 className="font-semibold mb-2">Your Partner's Profile</h4>
            <p className="text-sm">
              {partnerProfile.profileTitle}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Primary: {partnerProfile.primaryLanguage} | Secondary: {partnerProfile.secondaryLanguage}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
