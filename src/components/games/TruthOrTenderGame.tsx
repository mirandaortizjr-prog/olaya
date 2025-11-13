import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, Share2, Check, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { generateTruthOrDareQuestions } from "@/lib/gameQuestions";

interface GameProps {
  coupleId: string;
  userId: string;
  onBack: () => void;
}

type GameMode = 'choose' | 'truth' | 'dare';

interface ProofMedia {
  id: string;
  url: string;
  type: string;
  created_at: string;
  name: string;
}

interface ViewerState {
  isOpen: boolean;
  url: string;
  type: string;
}

interface TruthAnswer {
  id: string;
  user_id: string;
  question: string;
  answer: string;
  approved: boolean;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
}

export const TruthOrTenderGame = ({ coupleId, userId, onBack }: GameProps) => {
  const { t, language } = useLanguage();
  const { toast } = useToast();

  const [gameMode, setGameMode] = useState<GameMode>('choose');
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [questions, setQuestions] = useState<Array<{ truth: string; dare: string }>>([]);
  const [uploadedProofs, setUploadedProofs] = useState<ProofMedia[]>([]);
  const [uploading, setUploading] = useState(false);
  const [viewer, setViewer] = useState<ViewerState>({ isOpen: false, url: '', type: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [truthAnswer, setTruthAnswer] = useState("");
  const [truthAnswers, setTruthAnswers] = useState<TruthAnswer[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Load questions
  useEffect(() => {
    const loadedQuestions = generateTruthOrDareQuestions(1, language);
    setQuestions(loadedQuestions);
  }, [language]);

  // Fetch truth answers
  useEffect(() => {
    const fetchTruthAnswers = async () => {
      try {
        const { data, error } = await supabase
          .from('truth_answers')
          .select('*')
          .eq('couple_id', coupleId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setTruthAnswers(data || []);
      } catch (error) {
        console.error('Error fetching truth answers:', error);
      }
    };

    fetchTruthAnswers();
  }, [coupleId, submitting]);

  // Fetch uploaded proofs for dares
  useEffect(() => {
    const fetchProofs = async () => {
      try {
        // Fetch both partners' proofs: each user stores under their user_id folder
        const { data: members, error: membersError } = await supabase
          .from('couple_members')
          .select('user_id')
          .eq('couple_id', coupleId);

        if (membersError) {
          console.error('Error fetching couple members:', membersError);
        }

        const memberIds = (members?.map(m => m.user_id) || []).length > 0
          ? members!.map(m => m.user_id)
          : [userId];

        const allFiles: Array<{ file: any; ownerId: string }> = [];
        for (const ownerId of memberIds) {
          const { data: files, error } = await supabase.storage
            .from('truth-dare-proofs')
            .list(`${ownerId}/`, {
              limit: 100,
              sortBy: { column: 'created_at', order: 'desc' }
            });
          if (error) {
            console.error('Error listing proofs for', ownerId, error);
            continue;
          }
          (files || [])
            .filter(file => file.name !== '.emptyFolderPlaceholder')
            .forEach(file => allFiles.push({ file, ownerId }));
        }

        if (allFiles.length > 0) {
          const proofsWithUrls = await Promise.all(
            allFiles.map(async ({ file, ownerId }) => {
              const { data: urlData } = await supabase.storage
                .from('truth-dare-proofs')
                .createSignedUrl(`${ownerId}/${file.name}`, 604800); // 7 days

              const isVideo = /\.(mp4|mov|avi|webm)$/i.test(file.name);

              return {
                id: file.id || `${ownerId}/${file.name}`,
                url: urlData?.signedUrl || '',
                type: isVideo ? 'video' : 'image',
                created_at: file.created_at || '',
                name: file.name
              } as ProofMedia;
            })
          );
          setUploadedProofs(proofsWithUrls.filter(p => p.url));
        }
      } catch (error) {
        console.error('Error fetching proofs:', error);
      }
    };

    fetchProofs();
  }, [coupleId, uploading]);

  const selectTruth = () => {
    if (questions.length === 0) return;
    const questionIndex = Math.floor(Math.random() * questions.length);
    setCurrentQuestion(questions[questionIndex].truth);
    setGameMode('truth');
  };

  const selectDare = () => {
    if (questions.length === 0) return;
    const questionIndex = Math.floor(Math.random() * questions.length);
    setCurrentQuestion(questions[questionIndex].dare);
    setGameMode('dare');
  };

  const handleBack = () => {
    setGameMode('choose');
    setCurrentQuestion("");
    setTruthAnswer("");
  };

  const handleSubmitTruthAnswer = async () => {
    if (!truthAnswer.trim()) {
      toast({
        title: "Please enter an answer",
        description: "You need to write your truth answer",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('truth_answers')
        .insert({
          couple_id: coupleId,
          user_id: userId,
          question: currentQuestion,
          answer: truthAnswer.trim(),
        });

      if (error) throw error;

      toast({
        title: "Answer submitted!",
        description: "Your partner can now see and approve your answer",
      });

      setTruthAnswer("");
      handleBack();
    } catch (error) {
      console.error('Error submitting truth answer:', error);
      toast({
        title: "Submission failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproveTruthAnswer = async (answerId: string) => {
    try {
      const { error } = await supabase
        .from('truth_answers')
        .update({
          approved: true,
          approved_by: userId,
          approved_at: new Date().toISOString(),
        })
        .eq('id', answerId);

      if (error) throw error;

      toast({
        title: "Answer approved!",
        description: "You confirmed your partner's truth answer",
      });

      setSubmitting(!submitting); // Trigger refresh
    } catch (error) {
      console.error('Error approving answer:', error);
      toast({
        title: "Approval failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: isVideo ? "Videos must be under 50MB" : "Images must be under 10MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const objectName = `${unique}.${fileExt}`;
      const path = `${userId}/${objectName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('truth-dare-proofs')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type || undefined,
        });

      if (uploadError) throw uploadError;

      // Create a signed URL for immediate viewing (bucket is private)
      const { data: urlData, error: signErr } = await supabase.storage
        .from('truth-dare-proofs')
        .createSignedUrl(path, 604800); // 7 days
      if (signErr) throw signErr;

      const proof: ProofMedia = {
        id: path,
        url: urlData?.signedUrl || '',
        type: isVideo ? 'video' : 'image',
        created_at: new Date().toISOString(),
        name: objectName,
      };
      setUploadedProofs(prev => [proof, ...prev]);

      toast({
        title: "Proof uploaded!",
        description: "Your dare proof has been saved",
      });
    } catch (error: any) {
      console.error('Error uploading proof:', error);
      toast({
        title: "Upload failed",
        description: error?.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleShareToFeed = async (proofUrl: string, proofType: string) => {
    setUploading(true);
    try {
      const { error: postError } = await supabase
        .from('posts')
        .insert({
          couple_id: coupleId,
          author_id: userId,
          content: "🎥 Truth or Tender dare completed!",
          media_urls: [proofUrl]
        });

      if (postError) throw postError;
      
      toast({
        title: "Shared to feed!",
        description: "Your dare proof is now on your main feed",
      });
    } catch (error) {
      console.error('Error posting to feed:', error);
      toast({
        title: "Share failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProof = async (proof: ProofMedia) => {
    try {
      // Extract the file path from the proof id (format: userId/filename)
      const filePath = proof.id;
      
      // Only allow deletion if it's the user's own proof
      if (!filePath.startsWith(userId)) {
        toast({
          title: "Cannot delete",
          description: "You can only delete your own proofs",
          variant: "destructive",
        });
        return;
      }

      // Delete from storage
      const { error: deleteError } = await supabase.storage
        .from('truth-dare-proofs')
        .remove([filePath]);

      if (deleteError) throw deleteError;

      // Update local state
      setUploadedProofs(prev => prev.filter(p => p.id !== proof.id));

      toast({
        title: "Proof deleted",
        description: "Your dare proof has been removed",
      });
    } catch (error) {
      console.error('Error deleting proof:', error);
      toast({
        title: "Delete failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  // Choose mode - Truth or Dare buttons
  if (gameMode === 'choose') {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 p-4 border-b flex-shrink-0">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-semibold">{t('truthOrTenderTitle')}</h2>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              size="lg"
              onClick={selectTruth}
              className="h-32 text-lg bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              Truth
            </Button>
            <Button
              size="lg"
              onClick={selectDare}
              className="h-32 text-lg bg-gradient-to-br from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
            >
              Tender (Dare)
            </Button>
          </div>

          {truthAnswers.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Truth Answers</h3>
              <div className="space-y-3">
                {truthAnswers.map((ta) => (
                  <Card key={ta.id} className="p-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Q: {ta.question}</p>
                      <p className="text-base">A: {ta.answer}</p>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          {ta.approved ? (
                            <div className="flex items-center gap-1 text-green-600">
                              <Check className="w-4 h-4" />
                              <span className="text-sm">Approved</span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">Pending approval</span>
                          )}
                        </div>
                        {!ta.approved && ta.user_id !== userId && (
                          <Button
                            size="sm"
                            onClick={() => handleApproveTruthAnswer(ta.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {uploadedProofs.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Dare Proofs Gallery</h3>
              <div className="grid grid-cols-2 gap-2">
                {uploadedProofs.map((proof) => (
                  <Card 
                    key={proof.id} 
                    className="overflow-hidden relative group cursor-pointer"
                    onClick={() => setViewer({ isOpen: true, url: proof.url, type: proof.type })}
                  >
                    {proof.type === 'video' ? (
                      <div className="w-full h-40 bg-muted flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-primary/20 flex items-center justify-center">
                            <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                            </svg>
                          </div>
                          <p className="text-sm text-muted-foreground">Video Proof</p>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={proof.url}
                        alt="Dare proof"
                        className="w-full h-40 object-cover"
                      />
                    )}
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShareToFeed(proof.url, proof.type);
                      }}
                      disabled={uploading}
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {viewer.isOpen && (
            <div 
              className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
              onClick={() => setViewer({ isOpen: false, url: '', type: '' })}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-white hover:bg-white/20"
                onClick={() => setViewer({ isOpen: false, url: '', type: '' })}
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
                {viewer.type === 'video' ? (
                  <video
                    src={viewer.url}
                    className="w-full rounded-lg"
                    controls
                    autoPlay
                    preload="metadata"
                    playsInline
                  />
                ) : (
                  <img
                    src={viewer.url}
                    alt="Proof"
                    className="w-full rounded-lg"
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Truth question mode
  if (gameMode === 'truth') {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 p-4 border-b flex-shrink-0">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-semibold">Truth</h2>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4">
          <Card className="p-6">
            <p className="text-lg text-center mb-6">{currentQuestion}</p>
            
            <div className="space-y-3">
              <Textarea
                value={truthAnswer}
                onChange={(e) => setTruthAnswer(e.target.value)}
                placeholder="Type your honest answer here..."
                className="min-h-32"
                disabled={submitting}
              />
              
              <Button
                onClick={handleSubmitTruthAnswer}
                className="w-full"
                size="lg"
                disabled={submitting || !truthAnswer.trim()}
              >
                {submitting ? "Submitting..." : "Submit Answer"}
              </Button>
            </div>
          </Card>
          
          <p className="text-sm text-muted-foreground text-center">
            Your partner will be able to see and approve your answer
          </p>
        </div>
      </div>
    );
  }

  // Dare mode
  if (gameMode === 'dare') {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 p-4 border-b flex-shrink-0">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-semibold">Tender (Dare)</h2>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4">
          <Card className="p-6">
            <p className="text-lg text-center mb-4">{currentQuestion}</p>
          </Card>

          <div className="space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
              size="lg"
              disabled={uploading}
            >
              <Upload className="w-5 h-5 mr-2" />
              {uploading ? "Uploading..." : "Upload Photo/Video Proof"}
            </Button>
          </div>

          {uploadedProofs.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Your Dare Proofs</h3>
              <div className="grid grid-cols-2 gap-2">
                {uploadedProofs.map((proof) => (
                  <Card key={proof.id} className="overflow-hidden relative group">
                    {proof.type === 'video' ? (
                      <video
                        src={proof.url}
                        className="w-full h-40 object-cover"
                        controls
                        preload="none"
                        playsInline
                      />
                    ) : (
                      <img
                        src={proof.url}
                        alt="Dare proof"
                        className="w-full h-40 object-cover"
                      />
                    )}
                    <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleShareToFeed(proof.url, proof.type)}
                        disabled={uploading}
                      >
                        <Share2 className="w-4 h-4 mr-1" />
                        Share
                      </Button>
                      {proof.id.startsWith(userId) && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteProof(proof)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};
