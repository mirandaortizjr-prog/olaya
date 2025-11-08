import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface IntimateJournalFormProps {
  coupleId: string;
  userId: string;
  onSuccess: () => void;
}

export const IntimateJournalForm = ({ coupleId, userId, onSuccess }: IntimateJournalFormProps) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [userExperience, setUserExperience] = useState('');
  const [partnerExperience, setPartnerExperience] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !description || !userExperience) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in date, description, and your experience',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.from('intimate_journal').insert({
      couple_id: coupleId,
      created_by: userId,
      encounter_date: date,
      encounter_time: time || null,
      location: location || null,
      description: description,
      user_experience: userExperience,
      partner_experience: partnerExperience || null,
    });

    setIsSubmitting(false);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to save journal entry',
        variant: 'destructive',
      });
      return;
    }

    // Reset form
    setDate('');
    setTime('');
    setLocation('');
    setDescription('');
    setUserExperience('');
    setPartnerExperience('');
    
    onSuccess();
  };

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5 text-primary" />
          New Journal Entry
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Place/Location</Label>
            <Input
              id="location"
              placeholder="Where did this happen?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe what happened..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="userExperience">What I Loved About This *</Label>
            <Textarea
              id="userExperience"
              placeholder="Share what you loved about this experience..."
              value={userExperience}
              onChange={(e) => setUserExperience(e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="partnerExperience">What My Partner Loved</Label>
            <Textarea
              id="partnerExperience"
              placeholder="What did your partner love about this experience? (optional)"
              value={partnerExperience}
              onChange={(e) => setPartnerExperience(e.target.value)}
              rows={4}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Entry'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
