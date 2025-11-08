import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { IntimateJournalForm } from '@/components/IntimateJournalForm';
import { IntimateJournalList } from '@/components/IntimateJournalList';

export default function IntimateJournalPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [coupleId, setCoupleId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      setUserId(user.id);

      const { data: memberData } = await supabase
        .from('couple_members')
        .select('couple_id')
        .eq('user_id', user.id)
        .single();

      if (memberData) {
        setCoupleId(memberData.couple_id);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleEntryAdded = () => {
    setRefreshTrigger(prev => prev + 1);
    toast({
      title: 'Entry Added',
      description: 'Your journal entry has been saved',
    });
  };

  if (!coupleId || !userId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/private')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Private
        </Button>

        <div className="space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
              Our Journal
            </h1>
            <p className="text-muted-foreground">
              Document your special moments together
            </p>
          </div>

          <IntimateJournalForm 
            coupleId={coupleId} 
            userId={userId}
            onSuccess={handleEntryAdded}
          />

          <IntimateJournalList 
            coupleId={coupleId} 
            refreshTrigger={refreshTrigger}
          />
        </div>
      </div>
    </div>
  );
}
