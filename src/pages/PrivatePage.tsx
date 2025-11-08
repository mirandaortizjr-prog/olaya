import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BiometricPrivacyDialog } from "@/components/BiometricPrivacyDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const PrivatePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [passwordExists, setPasswordExists] = useState(false);
  const [coupleId, setCoupleId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserAndCouple();
  }, []);

  useEffect(() => {
    if (coupleId) {
      checkPasswordExists();
    }
  }, [coupleId]);

  const loadUserAndCouple = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/auth");
      return;
    }

    setUserId(user.id);

    const { data: membership } = await supabase
      .from('couple_members')
      .select('couple_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!membership) {
      toast({ 
        title: "No couple found", 
        description: "Please join or create a couple first",
        variant: "destructive" 
      });
      navigate("/dashboard");
      return;
    }

    setCoupleId(membership.couple_id);
    setLoading(false);
    setShowAuthDialog(true);
  };

  const checkPasswordExists = async () => {
    if (!coupleId) return;
    
    const { data } = await supabase
      .from('privacy_settings')
      .select('password_hash')
      .eq('couple_id', coupleId)
      .maybeSingle();
    
    setPasswordExists(!!data?.password_hash);
  };

  const hashPassword = async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const verifyPassword = async (password: string): Promise<boolean> => {
    if (!coupleId) return false;

    const hashedPassword = await hashPassword(password);
    const { data } = await supabase
      .from('privacy_settings')
      .select('password_hash')
      .eq('couple_id', coupleId)
      .maybeSingle();

    return data?.password_hash === hashedPassword;
  };

  const setPassword = async (password: string): Promise<boolean> => {
    if (!coupleId) return false;

    const hashedPassword = await hashPassword(password);
    const { error } = await supabase
      .from('privacy_settings')
      .upsert({
        couple_id: coupleId,
        password_hash: hashedPassword,
      });

    if (!error) {
      setPasswordExists(true);
      return true;
    }
    return false;
  };

  const handleAuthSuccess = () => {
    setIsUnlocked(true);
    setShowAuthDialog(false);
  };

  const privateItems = [
    { id: 'photos', label: 'PHOTOS' },
    { id: 'fantasies', label: 'FANTASIES' },
    { id: 'sex-lust-languages', label: 'SEX & LUST\nLANGUAGES' },
    { id: 'videos', label: 'VIDEOS' },
    { id: 'our-journal', label: 'OUR JOURNAL' },
    { id: 'sex-timeline', label: 'SEX TIMELINE' },
  ];

  if (!isUnlocked) {
    return (
      <>
        <BiometricPrivacyDialog
          open={showAuthDialog}
          onClose={() => navigate(-1)}
          onSuccess={handleAuthSuccess}
          mode={passwordExists ? 'verify' : 'set'}
          onVerify={verifyPassword}
          onSet={setPassword}
        />
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-purple-900 flex items-center justify-center">
          <Lock className="w-32 h-32 text-purple-300/20" />
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-purple-900">
      {/* Header */}
      <div className="relative h-24 flex items-center justify-between px-6">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:bg-white/20"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        
        <div className="flex items-center gap-3">
          <svg className="w-10 h-10 text-purple-400" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M30 70 L50 20 L70 70 L30 70 Z M40 70 L50 40 L60 70" />
            <path d="M30 70 L50 60 L70 70" />
          </svg>
          <h1 className="text-2xl font-bold text-white tracking-wide">
            PRIVATE VAULT
          </h1>
        </div>

        {/* Flower decoration */}
        <svg className="w-20 h-20 text-pink-400" viewBox="0 0 100 100" fill="currentColor">
          <g transform="translate(50, 50)">
            <ellipse rx="12" ry="25" transform="rotate(0)" opacity="0.9"/>
            <ellipse rx="12" ry="25" transform="rotate(72)" opacity="0.9"/>
            <ellipse rx="12" ry="25" transform="rotate(144)" opacity="0.9"/>
            <ellipse rx="12" ry="25" transform="rotate(216)" opacity="0.9"/>
            <ellipse rx="12" ry="25" transform="rotate(288)" opacity="0.9"/>
            <circle r="8" fill="#1a1a2e"/>
          </g>
        </svg>
      </div>

      {/* Grid of Private Items */}
      <div className="px-6 py-8">
        <div className="grid grid-cols-3 gap-x-6 gap-y-8 max-w-2xl mx-auto">
          {privateItems.map((item) => (
            <button
              key={item.id}
              className="flex flex-col items-center gap-2 group"
              onClick={() => {
                console.log(`Opening ${item.id}`);
                toast({ title: `Opening ${item.label}` });
              }}
            >
              <div className="w-28 h-28 rounded-full bg-gray-600 transition-transform group-hover:scale-105 shadow-lg" />
              <span className="text-xs font-semibold text-center text-white leading-tight whitespace-pre-line max-w-[120px]">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* The Wall Section */}
      <div className="px-6 py-8 mt-4">
        <h2 className="text-3xl font-bold text-white mb-6">THE WALL</h2>
        <div className="h-[500px] bg-gradient-to-b from-gray-800/50 to-gray-900/50 rounded-lg" />
      </div>
    </div>
  );
};

export default PrivatePage;
