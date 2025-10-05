import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LoveLanguageSelectorProps {
  userId: string;
  partnerUserId?: string;
}

const loveLanguages = [
  { value: 'words_of_affirmation', label: 'Words of Affirmation' },
  { value: 'quality_time', label: 'Quality Time' },
  { value: 'receiving_gifts', label: 'Receiving Gifts' },
  { value: 'acts_of_service', label: 'Acts of Service' },
  { value: 'physical_touch', label: 'Physical Touch' },
];

export const LoveLanguageSelector = ({ userId, partnerUserId }: LoveLanguageSelectorProps) => {
  const [primaryLanguage, setPrimaryLanguage] = useState('');
  const [secondaryLanguage, setSecondaryLanguage] = useState('');
  const [partnerLanguage, setPartnerLanguage] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchLoveLanguages();
  }, [userId, partnerUserId]);

  const fetchLoveLanguages = async () => {
    const { data } = await supabase
      .from('love_languages')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (data) {
      setPrimaryLanguage(data.primary_language);
      setSecondaryLanguage(data.secondary_language || '');
    }

    if (partnerUserId) {
      const { data: partnerData } = await supabase
        .from('love_languages')
        .select('*')
        .eq('user_id', partnerUserId)
        .maybeSingle();

      setPartnerLanguage(partnerData);
    }
  };

  const saveLoveLanguages = async () => {
    if (!primaryLanguage) {
      toast({
        title: 'Error',
        description: 'Please select your primary love language',
        variant: 'destructive',
      });
      return;
    }

    const { error } = await supabase.from('love_languages').upsert({
      user_id: userId,
      primary_language: primaryLanguage,
      secondary_language: secondaryLanguage,
    });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to save love languages',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Saved',
      description: 'Your love languages have been updated',
    });
  };

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          Love Languages
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Your Primary Love Language</label>
          <Select value={primaryLanguage} onValueChange={setPrimaryLanguage}>
            <SelectTrigger>
              <SelectValue placeholder="Select your primary love language" />
            </SelectTrigger>
            <SelectContent>
              {loveLanguages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Your Secondary Love Language</label>
          <Select value={secondaryLanguage} onValueChange={setSecondaryLanguage}>
            <SelectTrigger>
              <SelectValue placeholder="Select your secondary love language" />
            </SelectTrigger>
            <SelectContent>
              {loveLanguages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={saveLoveLanguages} className="w-full">
          Save Love Languages
        </Button>

        {partnerLanguage && (
          <div className="mt-4 p-4 bg-primary/10 rounded-lg">
            <h4 className="font-semibold mb-2">Your Partner's Love Languages</h4>
            <p className="text-sm">
              Primary: {loveLanguages.find(l => l.value === partnerLanguage.primary_language)?.label}
            </p>
            {partnerLanguage.secondary_language && (
              <p className="text-sm">
                Secondary: {loveLanguages.find(l => l.value === partnerLanguage.secondary_language)?.label}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
