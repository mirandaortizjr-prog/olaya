import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PrivacyPasswordDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode: 'set' | 'verify';
  onVerify?: (password: string) => Promise<boolean>;
  onSet?: (password: string) => Promise<boolean>;
}

export const PrivacyPasswordDialog = ({ 
  open, 
  onClose, 
  onSuccess, 
  mode,
  onVerify,
  onSet 
}: PrivacyPasswordDialogProps) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    // Validate 4 digits
    if (!/^\d{4}$/.test(password)) {
      toast({
        title: "Invalid Password",
        description: "Password must be exactly 4 digits",
        variant: "destructive",
      });
      return;
    }

    if (mode === 'set' && password !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure both passwords match",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      let success = false;
      
      if (mode === 'verify' && onVerify) {
        success = await onVerify(password);
      } else if (mode === 'set' && onSet) {
        success = await onSet(password);
      }

      if (success) {
        onSuccess();
        setPassword("");
        setConfirmPassword("");
        onClose();
      } else {
        toast({
          title: mode === 'verify' ? "Incorrect Password" : "Failed to Set Password",
          description: mode === 'verify' ? "Please try again" : "Please try again later",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Password error:', error);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            {mode === 'set' ? 'Set Privacy Password' : 'Enter Privacy Password'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'set' 
              ? 'Create a 4-digit password to protect your private content' 
              : 'Enter your 4-digit password to access private content'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                placeholder="Enter 4-digit password"
                value={password}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setPassword(val);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && password.length === 4) {
                    if (mode === 'set' && confirmPassword.length === 4) {
                      handleSubmit();
                    } else if (mode === 'verify') {
                      handleSubmit();
                    }
                  }
                }}
                className="pr-10 text-center text-2xl tracking-widest"
                autoFocus
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {mode === 'set' && (
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={4}
                  placeholder="Confirm 4-digit password"
                  value={confirmPassword}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                    setConfirmPassword(val);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && confirmPassword.length === 4) {
                      handleSubmit();
                    }
                  }}
                  className="pr-10 text-center text-2xl tracking-widest"
                />
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1"
              disabled={loading || password.length !== 4 || (mode === 'set' && confirmPassword.length !== 4)}
            >
              {loading ? 'Processing...' : mode === 'set' ? 'Set Password' : 'Unlock'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};