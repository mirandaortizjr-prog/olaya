import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfilePictureUpload } from "@/components/ProfilePictureUpload";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Heart, Calendar, MapPin, Mail, Edit2, Check, X, Lock } from "lucide-react";

interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  birthday?: string;
  location?: string;
}

export default function CoupleProfiles() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [partnerProfile, setPartnerProfile] = useState<Profile | null>(null);
  const [coupleId, setCoupleId] = useState<string | null>(null);
  const [editingOwn, setEditingOwn] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Edit form states
  const [editForm, setEditForm] = useState({
    full_name: "",
    bio: "",
    birthday: "",
    location: "",
  });

  // Password change states
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

    setUser(session.user);
    await fetchProfiles(session.user.id);
    setLoading(false);
  };

  const fetchProfiles = async (userId: string) => {
    try {
      // Get couple membership
      const { data: membership } = await supabase
        .from("couple_members")
        .select("couple_id")
        .eq("user_id", userId)
        .order("joined_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!membership) {
        navigate("/dashboard");
        return;
      }

      setCoupleId(membership.couple_id);

      // Get own profile
      const { data: ownProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (ownProfile) {
        setUserProfile(ownProfile as Profile);
        setEditForm({
          full_name: ownProfile.full_name || "",
          bio: (ownProfile as any).bio || "",
          birthday: (ownProfile as any).birthday || "",
          location: (ownProfile as any).location || "",
        });
      }

      // Get partner profile
      const { data: partner } = await supabase.rpc(
        "get_partner_profile",
        { c_id: membership.couple_id }
      );

      if (partner && partner.length > 0) {
        const partnerId = partner[0].user_id;
        const { data: partnerData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", partnerId)
          .single();

        if (partnerData) {
          setPartnerProfile(partnerData as Profile);
        }
      }
    } catch (error: any) {
      console.error("Error fetching profiles:", error);
      toast({
        title: "Error",
        description: "Failed to load profiles",
        variant: "destructive",
      });
    }
  };

  const saveProfile = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: editForm.full_name,
          bio: editForm.bio,
          birthday: editForm.birthday || null,
          location: editForm.location || null,
        })
        .eq("id", user.id);

      if (error) throw error;

      setUserProfile({
        ...userProfile!,
        full_name: editForm.full_name,
        bio: editForm.bio,
        birthday: editForm.birthday || undefined,
        location: editForm.location || undefined,
      });

      setEditingOwn(false);
      toast({
        title: "Success! 💕",
        description: "Your profile has been updated",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    try {
      setPasswordLoading(true);
      
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword,
      });

      if (error) throw error;

      toast({
        title: "Success! 🔒",
        description: "Your password has been updated",
      });

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const ProfileCard = ({ profile, isOwn }: { profile: Profile; isOwn: boolean }) => {
    const isEditing = isOwn && editingOwn;

    return (
      <Card className="bg-gradient-to-br from-card to-card/50 border-primary/10 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              {isOwn ? "Your Profile" : "Partner's Profile"}
            </span>
            {isOwn && !isEditing && (
              <Button variant="ghost" size="sm" onClick={() => setEditingOwn(true)}>
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            {isOwn ? (
              <ProfilePictureUpload
                userId={profile.id}
                currentAvatarUrl={profile.avatar_url}
                onUploadComplete={(url) => {
                  setUserProfile({ ...profile, avatar_url: url });
                }}
              />
            ) : (
              <Avatar className="h-32 w-32 ring-4 ring-primary/20">
                <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                <AvatarFallback className="bg-primary/10 text-primary text-3xl">
                  {profile.full_name?.charAt(0) || "?"}
                </AvatarFallback>
              </Avatar>
            )}
          </div>

          {/* Profile Information */}
          <div className="space-y-4">
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={editForm.full_name}
                    onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                    placeholder="Your name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    placeholder="Tell your partner about yourself..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthday">Birthday</Label>
                  <Input
                    id="birthday"
                    type="date"
                    value={editForm.birthday}
                    onChange={(e) => setEditForm({ ...editForm, birthday: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    placeholder="City, Country"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={saveProfile} className="flex-1">
                    <Check className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingOwn(false);
                      setEditForm({
                        full_name: profile.full_name || "",
                        bio: profile.bio || "",
                        birthday: profile.birthday || "",
                        location: profile.location || "",
                      });
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <h3 className="text-2xl font-bold text-center mb-2">
                    {profile.full_name}
                  </h3>
                  {profile.bio && (
                    <p className="text-sm text-muted-foreground text-center italic">
                      "{profile.bio}"
                    </p>
                  )}
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.email}</span>
                  </div>

                  {profile.birthday && (
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(profile.birthday).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  )}

                  {profile.location && (
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Couple Profiles
            </h1>
            <p className="text-sm text-muted-foreground">
              Get to know each other better 💕
            </p>
          </div>
        </div>

        {/* Profiles Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {userProfile && <ProfileCard profile={userProfile} isOwn={true} />}
          {partnerProfile && <ProfileCard profile={partnerProfile} isOwn={false} />}
        </div>

        {/* Password Change Section */}
        <Card className="bg-gradient-to-br from-card to-card/50 border-primary/10 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Change Password
              </span>
              {!showPasswordChange && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowPasswordChange(true)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {showPasswordChange ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    placeholder="Enter new password (min 6 characters)"
                    minLength={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                    minLength={6}
                  />
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handlePasswordChange} 
                    className="flex-1"
                    disabled={passwordLoading}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    {passwordLoading ? "Updating..." : "Update Password"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowPasswordChange(false);
                      setPasswordForm({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                    }}
                    disabled={passwordLoading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Click the edit button to change your password
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
