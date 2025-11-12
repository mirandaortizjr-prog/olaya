import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Heart, MessageSquare, Sparkles, CheckCircle2, Upload, Camera, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCoupleProgress } from "@/hooks/useCoupleProgress";
import { useTogetherCoins } from "@/hooks/useTogetherCoins";
import { generateTruthOrDareQuestions } from "@/lib/gameQuestions";
import { Camera as CapCamera, CameraResultType, CameraSource } from "@capacitor/camera";
import { videoRecording } from "@/utils/videoRecording";

interface GameProps {
  coupleId: string;
  userId: string;
  onBack: () => void;
}

type GameMode = 'instructions' | 'choose' | 'question' | 'waiting' | 'complete' | 'finished';
type ChallengeType = 'truth' | 'tender';

interface Round {
  playerId: string;
  type: ChallengeType;
  question: string;
  answer?: string;
  completed: boolean;
  validated: boolean;
}

export const TruthOrTenderGame = ({ coupleId, userId, onBack }: GameProps) => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { progress } = useCoupleProgress(coupleId);
  const { addCoins } = useTogetherCoins(userId);

  const [gameMode, setGameMode] = useState<GameMode>('instructions');
  const [currentRound, setCurrentRound] = useState(0);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [currentPlayerId, setCurrentPlayerId] = useState<string>(userId);
  const [answer, setAnswer] = useState("");
  const [questions, setQuestions] = useState<Array<{ truth: string; dare: string }>>([]);
  const [hasPlayedToday, setHasPlayedToday] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showCameraPreview, setShowCameraPreview] = useState(false);
  const [uploadedProofs, setUploadedProofs] = useState<Array<{ name: string; url: string; type: string }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);

  // Load questions based on level
  useEffect(() => {
    const level = progress?.currentLevel || 1;
    const loadedQuestions = generateTruthOrDareQuestions(level, language);
    setQuestions(loadedQuestions);
  }, [progress, language]);

  // Fetch uploaded proofs
  useEffect(() => {
    const fetchProofs = async () => {
      try {
        const { data: files, error } = await supabase.storage
          .from('truth-dare-proofs')
          .list(`${userId}/`, {
            limit: 100,
            sortBy: { column: 'created_at', order: 'desc' }
          });

        if (error) throw error;

        if (files) {
          const proofsWithUrls = await Promise.all(
            files.map(async (file) => {
              const { data: urlData } = supabase.storage
                .from('truth-dare-proofs')
                .getPublicUrl(`${userId}/${file.name}`);
              
              return {
                name: file.name,
                url: urlData.publicUrl,
                type: file.metadata?.mimetype || 'unknown'
              };
            })
          );
          setUploadedProofs(proofsWithUrls);
        }
      } catch (error) {
        console.error('Error fetching proofs:', error);
      }
    };

    if (userId) {
      fetchProofs();
    }
  }, [userId, uploading]);

  // Check if already played today
  useEffect(() => {
    const checkPlayedToday = async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('couple_id', coupleId)
        .eq('game_type', 'truth_or_tender')
        .eq('status', 'completed')
        .gte('created_at', `${today}T00:00:00`)
        .lte('created_at', `${today}T23:59:59`);

      if (!error && data && data.length > 0) {
        setHasPlayedToday(true);
      }
    };

    checkPlayedToday();
  }, [coupleId]);

  const startGame = () => {
    setGameMode('choose');
    setCurrentRound(1);
    setRounds([]);
  };

  const selectChallenge = (type: ChallengeType) => {
    if (questions.length === 0) return;

    const questionIndex = Math.floor(Math.random() * questions.length);
    const question = type === 'truth' 
      ? questions[questionIndex].truth 
      : questions[questionIndex].dare;

    const newRound: Round = {
      playerId: currentPlayerId,
      type,
      question,
      completed: false,
      validated: false
    };

    setRounds([...rounds, newRound]);
    setGameMode('question');
    setAnswer("");
  };

  const submitAnswer = async () => {
    const currentRoundData = rounds[rounds.length - 1];
    
    if (currentRoundData.type === 'truth' && !answer.trim()) {
      toast({
        title: t('error'),
        description: "Please provide an answer",
        variant: "destructive"
      });
      return;
    }

    // Require proof for tender (dare) challenges
    if (currentRoundData.type === 'tender' && !proofFile) {
      toast({
        title: t('truthOrDareProofNeeded'),
        description: t('truthOrDareProofNeedDesc'),
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      let fileName = null;

      // Upload proof file if provided
      if (proofFile) {
        const fileExt = proofFile.name.split('.').pop();
        fileName = `${userId}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('truth-dare-proofs')
          .upload(fileName, proofFile);

        if (uploadError) throw uploadError;
      }

      // Update round with answer and proof
      const updatedRounds = [...rounds];
      updatedRounds[updatedRounds.length - 1] = {
        ...currentRoundData,
        answer: answer || "Completed",
        completed: true
      };
      setRounds(updatedRounds);
      
      // Clean up proof files
      setProofFile(null);
      setProofPreview(null);
      setGameMode('waiting');

      // Wait for partner validation (in real app, this would be real-time)
      // For now, simulate validation after 2 seconds
      setTimeout(() => {
        validateRound(true);
      }, 2000);
    } catch (error) {
      console.error('Error uploading proof:', error);
      toast({
        title: t('truthOrDareError'),
        description: t('truthOrDareFailedUpload'),
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const validateRound = (isValid: boolean) => {
    setIsValidating(true);
    
    setTimeout(() => {
      const updatedRounds = [...rounds];
      updatedRounds[updatedRounds.length - 1] = {
        ...updatedRounds[updatedRounds.length - 1],
        validated: isValid
      };
      setRounds(updatedRounds);
      setIsValidating(false);

      if (isValid) {
        toast({
          title: t('roundComplete'),
          description: `${t('roundsCompleted')}: ${currentRound}/5`
        });

        if (currentRound >= 5) {
          finishGame();
        } else {
          setGameMode('complete');
        }
      } else {
        toast({
          title: "Try Again",
          description: "That round wasn't completed. Try another challenge!",
          variant: "destructive"
        });
        setGameMode('choose');
      }
    }, 1000);
  };

  const nextRound = () => {
    setCurrentRound(currentRound + 1);
    setGameMode('choose');
    setAnswer("");
  };

  const finishGame = async () => {
    setGameMode('finished');

    // Save game session
    const { error: sessionError } = await supabase
      .from('game_sessions')
      .insert({
        couple_id: coupleId,
        initiated_by: userId,
        partner_id: userId, // In real app, get actual partner
        game_type: 'truth_or_tender',
        status: 'completed',
        session_id: `tot_${Date.now()}`
      });

    if (sessionError) {
      console.error('Error saving game session:', sessionError);
    }

    // Award coins if haven't played today
    if (!hasPlayedToday && rounds.length >= 5) {
      try {
        await addCoins(10, 'Truth or Tender game completed', coupleId);
        toast({
          title: t('earnedReward'),
          description: t('earnedReward')
        });
        setHasPlayedToday(true);
      } catch (error) {
        console.error('Error awarding coins:', error);
      }
    }
  };

  const resetGame = () => {
    setGameMode('instructions');
    setCurrentRound(0);
    setRounds([]);
    setAnswer("");
    setProofFile(null);
    setProofPreview(null);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (15MB images, 100MB videos)
    const isVideo = file.type.startsWith('video/');
    const maxSize = isVideo ? 100 * 1024 * 1024 : 15 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: t('truthOrDareFileTooLarge'),
        description: isVideo ? "Please upload videos up to 100MB." : "Please upload photos up to 15MB.",
        variant: "destructive",
      });
      return;
    }

    setProofFile(file);
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setProofPreview(null);
    }
  };

  const handleTakePhoto = async () => {
    try {
      const image = await CapCamera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 80,
      });

      if (image.webPath) {
        const response = await fetch(image.webPath);
        const blob = await response.blob();
        const file = new File([blob], `proof-${Date.now()}.jpg`, { type: 'image/jpeg' });
        
        setProofFile(file);
        setProofPreview(image.webPath);
      }
    } catch (error) {
      console.error('Camera error:', error);
    }
  };

  const handleStartVideoRecording = async () => {
    try {
      await videoRecording.recorder.startRecording();
      setIsRecording(true);
      setShowCameraPreview(true);
      
      // Set video preview stream and ensure playback (iOS/Safari requires explicit play())
      const stream = videoRecording.recorder.getStream();
      if (videoPreviewRef.current && stream) {
        const videoEl = videoPreviewRef.current;
        videoEl.srcObject = stream;
        videoEl.muted = true;
        videoEl.playsInline = true;
        try {
          await videoEl.play();
        } catch {
          setTimeout(() => {
            videoEl.play().catch(() => {});
          }, 50);
        }
      }
      
      toast({
        title: t('truthOrDareRecordingStarted'),
        description: t('truthOrDareRecordingDesc'),
      });
    } catch (error) {
      console.error('Error starting video recording:', error);
      toast({
        title: t('truthOrDareError'),
        description: t('truthOrDareRecordingFailed'),
        variant: "destructive",
      });
    }
  };

  const handleStopVideoRecording = async () => {
    try {
      const recording = await videoRecording.recorder.stopRecording();
      setIsRecording(false);
      setShowCameraPreview(false);
      
      // Clear video preview
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = null;
      }
      
      // Convert data URL to blob
      const response = await fetch(recording.dataUrl);
      const blob = await response.blob();
      const file = new File([blob], `proof-${Date.now()}.webm`, { type: recording.mimeType });
      
      // Validate size for recorded video (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        toast({
          title: t('truthOrDareFileTooLarge'),
          description: "Recorded video is over 100MB. Please record a shorter clip.",
          variant: "destructive",
        });
        return;
      }
      
      setProofFile(file);
      setProofPreview(null); // No preview for videos
      
      toast({
        title: t('truthOrDareRecordingSaved'),
        description: t('truthOrDareRecordingSavedDesc'),
      });
    } catch (error) {
      console.error('Error stopping video recording:', error);
      setIsRecording(false);
      setShowCameraPreview(false);
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = null;
      }
      toast({
        title: t('truthOrDareError'),
        description: t('truthOrDareRecordingFailed'),
        variant: "destructive",
      });
    }
  };

  // Render instructions
  if (gameMode === 'instructions') {
    return (
      <>
        {/* Camera Preview Modal */}
        {showCameraPreview && (
          <div className="fixed inset-0 bg-black z-[100] flex flex-col">
            <div className="flex items-center justify-between p-4 bg-black/50">
              <p className="text-white font-semibold">{t('truthOrDareRecording') || "Recording..."}</p>
              <Button
                onClick={handleStopVideoRecording}
                className="bg-red-500 hover:bg-red-600"
              >
                {t('truthOrDareStopRecording')}
              </Button>
            </div>
            <video
              ref={videoPreviewRef}
              autoPlay
              playsInline
              muted
              className="flex-1 w-full h-full object-cover"
            />
          </div>
        )}

        <div className="fixed inset-0 bg-background z-50 flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 p-4 border-b flex-shrink-0">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-semibold">{t('truthOrTenderTitle')}</h2>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4">
          <Card className="p-6 bg-gradient-to-br from-pink-500/10 to-purple-500/10 border-pink-200 dark:border-pink-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-pink-500/20">
                <Heart className="w-6 h-6 text-pink-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{t('truthOrTenderSubtitle')}</h3>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              {t('truthOrTenderHow')}
            </h3>
            <p className="text-muted-foreground mb-4">
              {t('truthOrTenderObjective')}
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-3">{t('truthOrTenderRules')}</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>{t('truthOrTenderRule1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>{t('truthOrTenderRule2')}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>{t('truthOrTenderRule3')}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>{t('truthOrTenderRule4')}</span>
              </li>
            </ul>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-200 dark:border-yellow-800">
            <h3 className="text-lg font-semibold mb-3">{t('truthOrTenderRewards')}</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <span>{t('truthOrTenderReward1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <span>{t('truthOrTenderReward2')}</span>
              </li>
            </ul>
          </Card>

          {hasPlayedToday && (
            <Card className="p-4 bg-blue-500/10 border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-600 dark:text-blue-400 text-center">
                {t('playAgainTomorrow')}
              </p>
            </Card>
          )}
        </div>

        <div className="p-4 border-t flex-shrink-0">
          <Button onClick={startGame} className="w-full" size="lg">
            {t('startNewGame') || "Start New Game"}
          </Button>
        </div>
        </div>
      </>
    );
  }

  // Render choose challenge mode
  if (gameMode === 'choose') {
    return (
      <>
        {/* Camera Preview Modal */}
        {showCameraPreview && (
          <div className="fixed inset-0 bg-black z-[100] flex flex-col">
            <div className="flex items-center justify-between p-4 bg-black/50">
              <p className="text-white font-semibold">{t('truthOrDareRecording') || "Recording..."}</p>
              <Button
                onClick={handleStopVideoRecording}
                className="bg-red-500 hover:bg-red-600"
              >
                {t('truthOrDareStopRecording')}
              </Button>
            </div>
            <video
              ref={videoPreviewRef}
              autoPlay
              playsInline
              muted
              className="flex-1 w-full h-full object-cover"
            />
          </div>
        )}

        <div className="fixed inset-0 bg-background z-50 flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 p-4 border-b">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-semibold">{t('truthOrTenderTitle')}</h2>
        </div>

        <div className="flex-1 p-4 flex flex-col items-center justify-center space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">{t('yourTurn') || "Your Turn!"}</h3>
            <p className="text-muted-foreground">
              {t('roundsCompleted')}: {currentRound - 1}/5
            </p>
          </div>

          <div className="w-full max-w-md">
            <h4 className="text-lg font-semibold text-center mb-4">{t('chooseMode') || "Choose Your Challenge"}</h4>
            
            <div className="grid gap-4">
              <Card 
                className="p-6 cursor-pointer hover:bg-accent transition-colors border-2 hover:border-primary"
                onClick={() => selectChallenge('truth')}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-blue-500/20">
                    <MessageSquare className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-lg">{t('truthMode')}</h5>
                    <p className="text-sm text-muted-foreground">{t('truthDescription')}</p>
                  </div>
                </div>
              </Card>

              <Card 
                className="p-6 cursor-pointer hover:bg-accent transition-colors border-2 hover:border-primary"
                onClick={() => selectChallenge('tender')}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-pink-500/20">
                    <Heart className="w-6 h-6 text-pink-500" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-lg">{t('tenderMode')}</h5>
                    <p className="text-sm text-muted-foreground">{t('tenderDescription')}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
      </>
    );
  }

  // Render question/dare
  if (gameMode === 'question') {
    const currentRoundData = rounds[rounds.length - 1];
    const isTruth = currentRoundData.type === 'truth';

    return (
      <>
        {/* Camera Preview Modal */}
        {showCameraPreview && (
          <div className="fixed inset-0 bg-black z-[100] flex flex-col">
            <div className="flex items-center justify-between p-4 bg-black/50">
              <p className="text-white font-semibold">{t('truthOrDareRecording') || "Recording..."}</p>
              <Button
                onClick={handleStopVideoRecording}
                className="bg-red-500 hover:bg-red-600"
              >
                {t('truthOrDareStopRecording')}
              </Button>
            </div>
            <video
              ref={videoPreviewRef}
              autoPlay
              playsInline
              muted
              className="flex-1 w-full h-full object-cover"
            />
          </div>
        )}

        <div className="fixed inset-0 bg-background z-50 flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 p-4 border-b">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-semibold">{t('truthOrTenderTitle')}</h2>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-6">
          <div className="text-center">
            <p className="text-muted-foreground mb-1">
              {t('roundsCompleted')}: {currentRound}/5
            </p>
          </div>

          <Card className={`p-6 ${isTruth ? 'bg-blue-500/10 border-blue-200 dark:border-blue-800' : 'bg-pink-500/10 border-pink-200 dark:border-pink-800'}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-full ${isTruth ? 'bg-blue-500/20' : 'bg-pink-500/20'}`}>
                {isTruth ? (
                  <MessageSquare className="w-6 h-6 text-blue-500" />
                ) : (
                  <Heart className="w-6 h-6 text-pink-500" />
                )}
              </div>
              <h3 className="text-lg font-semibold">
                {isTruth ? t('truthQuestion') : t('tenderDare')}
              </h3>
            </div>
            <p className="text-lg">{currentRoundData.question}</p>
          </Card>

          {isTruth ? (
            <div className="space-y-3">
              <label className="text-sm font-medium">{t('answerQuestion')}</label>
              <Textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder={t('typeYourAnswer') || "Type your answer..."}
                rows={4}
                className="resize-none"
              />
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-center text-muted-foreground">
                📸 {t('truthOrDareProofRequired')}
              </p>
            
              {proofPreview && (
                <div className="relative">
                  <img 
                    src={proofPreview} 
                    alt="Proof preview" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setProofFile(null);
                      setProofPreview(null);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {proofFile && !proofPreview && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-sm text-green-400 text-center">
                    ✓ {t('truthOrDareVideoSelected')} {proofFile.name}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={handleTakePhoto}
                  className="w-full"
                  disabled={isRecording}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  {t('truthOrDareTakePhoto')}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                  disabled={isRecording}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {t('truthOrDareUploadFile')}
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {!isRecording ? (
                  <Button
                    variant="outline"
                    onClick={handleStartVideoRecording}
                    className="w-full bg-red-500/10 hover:bg-red-500/20 border-red-500/30"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    {t('truthOrDareRecordVideo')}
                  </Button>
                ) : (
                  <Button
                    variant="destructive"
                    onClick={handleStopVideoRecording}
                    className="w-full animate-pulse"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    {t('truthOrDareStopRecording')}
                  </Button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                capture="user"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}
        </div>

        <div className="p-4 border-t flex-shrink-0">
          <Button 
            onClick={submitAnswer} 
            className="w-full" 
            size="lg"
            disabled={(isTruth && !answer.trim()) || (!isTruth && !proofFile) || uploading}
          >
            {uploading ? t('truthOrDareUploading') : (isTruth ? t('submit') : t('confirmCompleted'))}
          </Button>
        </div>
      </div>
      </>
    );
  }

  // Render waiting for validation
  if (gameMode === 'waiting') {
    return (
      <>
        {/* Camera Preview Modal */}
        {showCameraPreview && (
          <div className="fixed inset-0 bg-black z-[100] flex flex-col">
            <div className="flex items-center justify-between p-4 bg-black/50">
              <p className="text-white font-semibold">{t('truthOrDareRecording') || "Recording..."}</p>
              <Button
                onClick={handleStopVideoRecording}
                className="bg-red-500 hover:bg-red-600"
              >
                {t('truthOrDareStopRecording')}
              </Button>
            </div>
            <video
              ref={videoPreviewRef}
              autoPlay
              playsInline
              muted
              className="flex-1 w-full h-full object-cover"
            />
          </div>
        )}

        <div className="fixed inset-0 bg-background z-50 flex flex-col">
        <div className="flex items-center gap-2 p-4 border-b">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-semibold">{t('truthOrTenderTitle')}</h2>
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="p-8 text-center max-w-md">
            <div className="animate-pulse mb-4">
              <Sparkles className="w-12 h-12 text-primary mx-auto" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('validating')}</h3>
            <p className="text-muted-foreground">{t('waitingForPartnerToValidate')}</p>
          </Card>
        </div>
      </div>
      </>
    );
  }

  // Render round complete
  if (gameMode === 'complete') {
    return (
      <>
        {/* Camera Preview Modal */}
        {showCameraPreview && (
          <div className="fixed inset-0 bg-black z-[100] flex flex-col">
            <div className="flex items-center justify-between p-4 bg-black/50">
              <p className="text-white font-semibold">{t('truthOrDareRecording') || "Recording..."}</p>
              <Button
                onClick={handleStopVideoRecording}
                className="bg-red-500 hover:bg-red-600"
              >
                {t('truthOrDareStopRecording')}
              </Button>
            </div>
            <video
              ref={videoPreviewRef}
              autoPlay
              playsInline
              muted
              className="flex-1 w-full h-full object-cover"
            />
          </div>
        )}

        <div className="fixed inset-0 bg-background z-50 flex flex-col">
        <div className="flex items-center gap-2 p-4 border-b">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-semibold">{t('truthOrTenderTitle')}</h2>
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="p-8 text-center max-w-md">
            <div className="mb-4">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
            </div>
            <h3 className="text-2xl font-bold mb-2">{t('roundComplete')}</h3>
            <p className="text-muted-foreground mb-6">
              {t('roundsCompleted')}: {currentRound}/5
            </p>
            
            <div className="space-y-3">
              <Button onClick={nextRound} className="w-full" size="lg">
                {currentRound >= 5 ? t('finishGame') || "Finish Game" : t('nextRound') || "Next Round"}
              </Button>
              {currentRound >= 5 && (
                <Button onClick={finishGame} variant="outline" className="w-full">
                  {t('finishGame') || "Finish Game"}
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
      </>
    );
  }

  // Render game finished
  if (gameMode === 'finished') {
    return (
      <>
        {/* Camera Preview Modal */}
        {showCameraPreview && (
          <div className="fixed inset-0 bg-black z-[100] flex flex-col">
            <div className="flex items-center justify-between p-4 bg-black/50">
              <p className="text-white font-semibold">{t('truthOrDareRecording') || "Recording..."}</p>
              <Button
                onClick={handleStopVideoRecording}
                className="bg-red-500 hover:bg-red-600"
              >
                {t('truthOrDareStopRecording')}
              </Button>
            </div>
            <video
              ref={videoPreviewRef}
              autoPlay
              playsInline
              muted
              className="flex-1 w-full h-full object-cover"
            />
          </div>
        )}

        <div className="fixed inset-0 bg-background z-50 flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 p-4 border-b flex-shrink-0">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-semibold">{t('truthOrTenderTitle')}</h2>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4">
          <Card className="p-8 text-center bg-gradient-to-br from-pink-500/10 to-purple-500/10 border-pink-200 dark:border-pink-800">
            <div className="mb-4">
              <Heart className="w-20 h-20 text-pink-500 mx-auto" />
            </div>
            <h3 className="text-3xl font-bold mb-2">{t('gameCompleted') || "Game Completed!"}</h3>
            <p className="text-muted-foreground mb-6">
              {t('totalRounds') || "Total Rounds"}: {rounds.length}
            </p>
            
            {!hasPlayedToday && rounds.length >= 5 && (
              <Card className="p-4 mb-6 bg-yellow-500/10 border-yellow-200 dark:border-yellow-800">
                <p className="font-semibold text-yellow-600 dark:text-yellow-400">
                  {t('earnedReward')}
                </p>
              </Card>
            )}

            {hasPlayedToday && (
              <Card className="p-4 mb-6 bg-blue-500/10 border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  {t('playAgainTomorrow')}
                </p>
              </Card>
            )}
            
            <Button onClick={resetGame} className="w-full" size="lg">
              {t('backToHome') || "Back to Home"}
            </Button>
          </Card>

          {/* Uploaded Proofs Gallery */}
          {uploadedProofs.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary" />
                {t('truthOrDareYourProofs') || "Your Dare Proofs"}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {uploadedProofs.map((proof, index) => (
                  <div key={index} className="relative group">
                    {proof.type.startsWith('image/') ? (
                      <img 
                        src={proof.url} 
                        alt={`Proof ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border-2 border-border hover:border-primary transition-colors"
                      />
                    ) : (
                      <div className="w-full h-32 bg-muted rounded-lg border-2 border-border hover:border-primary transition-colors flex flex-col items-center justify-center">
                        <Camera className="w-8 h-8 text-muted-foreground mb-2" />
                        <p className="text-xs text-muted-foreground">Video Proof</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
      </>
    );
  }

  return null;
};
