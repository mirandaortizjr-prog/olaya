import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Eye, EyeOff, Fingerprint } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { biometrics } from "@/utils/biometrics";
import { Capacitor } from "@capacitor/core";

interface BiometricPrivacyDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode: 'set' | 'verify';
  onVerify?: (password: string) => Promise<boolean>;
  onSet?: (password: string) => Promise<boolean>;
}

export const BiometricPrivacyDialog = ({ 
  open, 
  onClose, 
  onSuccess, 
  mode,
  onVerify,
  onSet 
}: BiometricPrivacyDialogProps) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);
  const [biometryName, setBiometryName] = useState("Biometric");
  const { toast } = useToast();

  useEffect(() => {
    checkBiometrics();
  }, []);

  const checkBiometrics = async () => {
    const available = await biometrics.isAvailable();
    setBiometricsAvailable(available);
    
    if (available) {
      const name = await biometrics.getBiometryName();
      setBiometryName(name);
    }
  };

  const handleBiometricAuth = async () => {
    setLoading(true);
    try {
      const success = await biometrics.authenticate(
        mode === 'verify' 
          ? 'Verify your identity to access Private'
          : 'Authenticate to set up privacy protection'
      );

      if (success) {
        onSuccess();
        handleClose();
        toast({
          title: "Success",
          description: `Authenticated with ${biometryName}`,
        });
      } else {
        toast({
          title: "Authentication Failed",
          description: `${biometryName} authentication was cancelled or failed`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Biometric auth error:', error);
      toast({
        title: "Error",
        description: "Biometric authentication failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
      if (mode === 'verify' && onVerify) {
        const isValid = await onVerify(password);
        if (isValid) {
          onSuccess();
          handleClose();
        } else {
          toast({
            title: "Incorrect Password",
            description: "Please try again",
            variant: "destructive",
          });
        }
      } else if (mode === 'set' && onSet) {
        const success = await onSet(password);
        if (success) {
          toast({
            title: "Password Set",
            description: "Your privacy password has been set successfully",
          });
          onSuccess();
          handleClose();
        } else {
          toast({
            title: "Error",
            description: "Failed to set password. Please try again.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Password error:', error);
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            {mode === 'set' ? 'Set Privacy Password' : 'Enter Privacy Password'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'set' 
              ? 'Create a 4-digit password to protect your private content'
              : 'Enter your password to access private content'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {biometricsAvailable && Capacitor.isNativePlatform() && mode === 'verify' && (
            <Button
              onClick={handleBiometricAuth}
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              <Fingerprint className="w-4 h-4 mr-2" />
              Use {biometryName}
            </Button>
          )}

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter 4-digit password"
              value={password}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                setPassword(value);
              }}
              onKeyPress={handleKeyPress}
              maxLength={4}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {mode === 'set' && (
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm 4-digit password"
                value={confirmPassword}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setConfirmPassword(value);
                }}
                onKeyPress={handleKeyPress}
                maxLength={4}
                className="pr-10"
              />
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || password.length !== 4}
              className="flex-1"
            >
              {loading ? "Processing..." : mode === 'set' ? 'Set Password' : 'Unlock'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
