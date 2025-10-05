import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Heart, Sparkles, Plus, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DesireVaultProps {
  coupleId: string;
  userId: string;
}

export const DesireVault = ({ coupleId, userId }: DesireVaultProps) => {
  const [desires, setDesires] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('romantic');
  const [isPrivate, setIsPrivate] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDesires();
  }, [coupleId]);

  const fetchDesires = async () => {
    const { data, error } = await supabase
      .from('desire_vault')
      .select('*')
      .eq('couple_id', coupleId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching desires:', error);
      return;
    }

    setDesires(data || []);
  };

  const addDesire = async () => {
    if (!title.trim()) return;

    const { error } = await supabase.from('desire_vault').insert({
      couple_id: coupleId,
      user_id: userId,
      title,
      description,
      category,
      is_private: isPrivate,
    });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to add desire',
        variant: 'destructive',
      });
      return;
    }

    setTitle('');
    setDescription('');
    setIsOpen(false);
    fetchDesires();
    toast({
      title: 'Desire Added',
      description: 'Your desire has been saved to the vault',
    });
  };

  const toggleFulfilled = async (id: string, fulfilled: boolean) => {
    const { error } = await supabase
      .from('desire_vault')
      .update({ 
        fulfilled: !fulfilled,
        fulfilled_at: !fulfilled ? new Date().toISOString() : null 
      })
      .eq('id', id);

    if (!error) {
      fetchDesires();
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          Desire Vault
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full mb-4">
              <Plus className="h-4 w-4 mr-2" />
              Add Desire
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Desire</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="What do you desire?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Textarea
                placeholder="Details (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="romantic">Romantic</SelectItem>
                  <SelectItem value="adventure">Adventure</SelectItem>
                  <SelectItem value="intimate">Intimate</SelectItem>
                  <SelectItem value="experience">Experience</SelectItem>
                  <SelectItem value="gift">Gift</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={addDesire} className="w-full">Add to Vault</Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {desires.map((desire) => (
            <Card key={desire.id} className={desire.fulfilled ? 'opacity-60' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{desire.title}</h4>
                      {desire.is_private && <Badge variant="secondary">Private</Badge>}
                      <Badge variant="outline">{desire.category}</Badge>
                    </div>
                    {desire.description && (
                      <p className="text-sm text-muted-foreground">{desire.description}</p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant={desire.fulfilled ? 'secondary' : 'ghost'}
                    onClick={() => toggleFulfilled(desire.id, desire.fulfilled)}
                  >
                    {desire.fulfilled ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
