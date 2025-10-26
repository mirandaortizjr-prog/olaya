import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, Plus, Trash2, Upload, Calendar, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PrivacyPasswordDialog } from "./PrivacyPasswordDialog";

interface PrivatePhoto {
  id: string;
  file_path: string;
  caption: string | null;
  uploaded_by: string;
  created_at: string;
}

interface PrivateJournalEntry {
  id: string;
  title: string;
  description: string | null;
  user_id: string;
  created_at: string;
}

interface PrivateVaultProps {
  coupleId: string;
  userId: string;
  onClose: () => void;
}

export const PrivateVault = ({ coupleId, userId, onClose }: PrivateVaultProps) => {
  const [photos, setPhotos] = useState<PrivatePhoto[]>([]);
  const [journalEntries, setJournalEntries] = useState<PrivateJournalEntry[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [showJournalDialog, setShowJournalDialog] = useState(false);
  const [journalTitle, setJournalTitle] = useState("");
  const [journalDescription, setJournalDescription] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordMode, setPasswordMode] = useState<'set' | 'verify'>('verify');
  const { toast } = useToast();

  useEffect(() => {
    checkPassword();
  }, [userId]);

  useEffect(() => {
    if (isUnlocked) {
      loadPhotos();
      loadJournalEntries();
    }
  }, [coupleId, isUnlocked]);

  const checkPassword = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('privacy_password_hash')
      .eq('id', userId)
      .single();

    if (data?.privacy_password_hash) {
      setHasPassword(true);
      setPasswordMode('verify');
      setShowPasswordDialog(true);
    } else {
      setHasPassword(false);
      setPasswordMode('set');
      setShowPasswordDialog(true);
    }
  };

  const hashPassword = async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const verifyPassword = async (password: string): Promise<boolean> => {
    const hash = await hashPassword(password);
    const { data } = await supabase
      .from('profiles')
      .select('privacy_password_hash')
      .eq('id', userId)
      .single();

    return data?.privacy_password_hash === hash;
  };

  const setPassword = async (password: string): Promise<boolean> => {
    const hash = await hashPassword(password);
    const { error } = await supabase
      .from('profiles')
      .update({ privacy_password_hash: hash })
      .eq('id', userId);

    if (!error) {
      setHasPassword(true);
      return true;
    }
    return false;
  };


  const loadPhotos = async () => {
    const { data, error } = await supabase
      .from('shared_media')
      .select('*')
      .eq('couple_id', coupleId)
      .eq('file_type', 'private_photo')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPhotos(data);
    }
  };

  const loadJournalEntries = async () => {
    const { data, error } = await supabase
      .from('private_content')
      .select('*')
      .eq('couple_id', coupleId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setJournalEntries(data);
    }
  };

  const uploadPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const filePath = `private/${coupleId}/${userId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('couple_media')
      .upload(filePath, file);

    if (uploadError) {
      toast({ title: "Error uploading photo", variant: "destructive" });
      setUploading(false);
      return;
    }

    const { error: dbError } = await supabase
      .from('shared_media')
      .insert({
        couple_id: coupleId,
        uploaded_by: userId,
        file_path: filePath,
        file_type: 'private_photo'
      });

    if (dbError) {
      toast({ title: "Error saving photo", variant: "destructive" });
    } else {
      toast({ title: "Photo uploaded!" });
      loadPhotos();
    }
    setUploading(false);
  };

  const deletePhoto = async (id: string, filePath: string) => {
    await supabase.storage.from('couple_media').remove([filePath]);
    await supabase.from('shared_media').delete().eq('id', id);
    loadPhotos();
  };

  const getPhotoUrl = async (path: string) => {
    const { data } = await supabase.storage.from('couple_media').createSignedUrl(path, 3600);
    return data?.signedUrl;
  };

  const addJournalEntry = async () => {
    if (!journalTitle.trim()) return;

    const { error } = await supabase
      .from('private_content')
      .insert({
        couple_id: coupleId,
        user_id: userId,
        content_type: 'journal',
        title: journalTitle.trim(),
        description: journalDescription.trim() || null,
        is_shared: false
      });

    if (error) {
      toast({ title: "Error adding journal entry", variant: "destructive" });
    } else {
      toast({ title: "Journal entry added!" });
      setJournalTitle("");
      setJournalDescription("");
      setShowJournalDialog(false);
      loadJournalEntries();
    }
  };

  const deleteJournalEntry = async (id: string) => {
    const { error } = await supabase
      .from('private_content')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: "Error deleting entry", variant: "destructive" });
    } else {
      loadJournalEntries();
    }
  };

  if (!isUnlocked) {
    return (
      <>
        <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
          <div className="text-center">
            <Lock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Private Vault Locked</h2>
            <p className="text-muted-foreground mb-4">
              {hasPassword ? 'Enter your password to unlock' : 'Set a password to protect your private content'}
            </p>
            <Button variant="outline" onClick={onClose}>Back</Button>
          </div>
        </div>
        <PrivacyPasswordDialog
          open={showPasswordDialog}
          onClose={() => {
            setShowPasswordDialog(false);
            onClose();
          }}
          onSuccess={() => setIsUnlocked(true)}
          mode={passwordMode}
          onVerify={verifyPassword}
          onSet={setPassword}
        />
      </>
    );
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Private Vault</h2>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => {
              setPasswordMode('set');
              setShowPasswordDialog(true);
            }}
            title="Change Password"
          >
            <Settings className="w-5 h-5" />
          </Button>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="photos" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="photos">Private Photos</TabsTrigger>
              <TabsTrigger value="journal">Private Journal</TabsTrigger>
            </TabsList>

            <TabsContent value="photos" className="space-y-4 mt-4">
              <label htmlFor="photo-upload">
                <Button className="w-full" disabled={uploading} asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? "Uploading..." : "Upload Private Photo"}
                  </span>
                </Button>
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={uploadPhoto}
              />

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {photos.map((photo) => (
                  <Card key={photo.id} className="overflow-hidden">
                    <div className="aspect-square relative">
                      <img
                        src={`/api/placeholder/400/400`}
                        alt="Private"
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={async () => {
                          const url = await getPhotoUrl(photo.file_path);
                          if (url) setSelectedPhoto(url);
                        }}
                      />
                      <div className="absolute top-2 right-2 flex gap-1">
                        {photo.uploaded_by === userId && (
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8"
                            onClick={() => deletePhoto(photo.id, photo.file_path)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="journal" className="space-y-4 mt-4">
              <Button onClick={() => setShowJournalDialog(true)} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Journal Entry
              </Button>

              <div className="space-y-3">
                {journalEntries.map((entry) => (
                  <Card key={entry.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold">{entry.title}</h3>
                        {entry.description && (
                          <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                            {entry.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                          <Calendar className="w-3 h-3" />
                          {new Date(entry.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteJournalEntry(entry.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
                {journalEntries.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    <Lock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No private journal entries yet.</p>
                    <p className="text-sm mt-1">Store your hot dates, intimate experiences, fantasies, and more.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <img src={selectedPhoto} alt="Full size" className="max-w-full max-h-full" />
        </div>
      )}

      <Dialog open={showJournalDialog} onOpenChange={setShowJournalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Private Journal Entry</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={journalTitle}
                onChange={(e) => setJournalTitle(e.target.value)}
                placeholder="Hot date at..."
              />
            </div>
            <div>
              <Label>Details</Label>
              <Textarea
                value={journalDescription}
                onChange={(e) => setJournalDescription(e.target.value)}
                placeholder="Describe your experience, fantasies fulfilled, intimate moments..."
                rows={6}
              />
            </div>
            <Button onClick={addJournalEntry} className="w-full">Add Entry</Button>
          </div>
        </DialogContent>
      </Dialog>

      <PrivacyPasswordDialog
        open={showPasswordDialog && passwordMode === 'set'}
        onClose={() => setShowPasswordDialog(false)}
        onSuccess={() => {
          toast({ title: "Password updated successfully" });
        }}
        mode="set"
        onSet={setPassword}
      />
    </div>
  );
};
