import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { VideoPlayerProvider } from "@/contexts/VideoPlayerContext";
import { MusicPlayerProvider } from "@/contexts/MusicPlayerContext";
import { GlobalVideoPlayer } from "@/components/GlobalVideoPlayer";
import { GlobalMusicPlayer } from "@/components/GlobalMusicPlayer";
import { SplashScreen } from "@/components/SplashScreen";
import { supabase } from "@/integrations/supabase/client";
import { initializeNativePushListeners, subscribeToPushNotifications } from "@/utils/notifications";
import { OneSignalProvider } from "@/components/OneSignalProvider";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import DailyNotesPage from "./pages/DailyNotesPage";
import CoupleProfiles from "./pages/CoupleProfiles";
import PrivatePage from "./pages/PrivatePage";
import { MoodCustomization } from "./pages/MoodCustomization";
import { FlirtCustomization } from "./pages/FlirtCustomization";
import NotFound from "./pages/NotFound";
import FlirtsPage from "./pages/FlirtsPage";
import DesiresPage from "./pages/DesiresPage";
import FantasiesPage from "./pages/FantasiesPage";
import IntimateJournalPage from "./pages/IntimateJournalPage";
import ShopPage from "./pages/ShopPage";
import GiftsPage from "./pages/GiftsPage";
import GiftCollections from "./pages/GiftCollections";
import VisualEffectsShop from "./pages/VisualEffectsShop";
import AccessoriesPage from "./pages/AccessoriesPage";
import PotionsPage from "./pages/PotionsPage";
import PremiumPlansPage from "./pages/PremiumPlansPage";
import InAppPurchasePage from "./pages/InAppPurchasePage";
import PoemsPage from "./pages/PoemsPage";
import Notifications from "./pages/Notifications";

const queryClient = new QueryClient();

const AppRouter = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Check for creator mode
  const isCreatorMode = new URLSearchParams(location.search).get('creator') === 'true';

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        // Creator mode: Force full journey
        if (isCreatorMode) {
          // Always show splash, then redirect to premium plans
          setTimeout(() => {
            setShowSplash(false);
            setIsCheckingAuth(false);
            if (location.pathname === '/') {
              navigate('/premium-plans?creator=true', { replace: true });
            }
          }, 1800);
          return;
        }

        // Normal mode: Standard auth flow
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Initialize push notifications for authenticated users
          initializeNativePushListeners();
          subscribeToPushNotifications().catch(console.error);
          
          // Check if user has couple profile
          const { data: coupleData } = await supabase
            .from('couple_members')
            .select('couple_id')
            .eq('user_id', user.id)
            .single();
          
          if (coupleData) {
            // User has couple profile - go straight to dashboard
            const onLanding = ["/", "/auth", "/premium-plans", "/purchase"].includes(location.pathname);
            if (onLanding) {
              navigate('/dashboard', { replace: true });
            }
            // Wait for splash animation then hide
            setTimeout(() => {
              setShowSplash(false);
              setIsCheckingAuth(false);
            }, 1800);
            return;
          }
        }
        
        // New user or no couple profile, show landing page after splash
        setTimeout(() => {
          setShowSplash(false);
          setIsCheckingAuth(false);
        }, 1800);
      } catch (error) {
        console.error('Auth check error:', error);
        setTimeout(() => {
          setShowSplash(false);
          setIsCheckingAuth(false);
        }, 1800);
      }
    };

    checkAuthAndRedirect();
  }, [navigate, location.pathname, isCreatorMode]);


  if (showSplash || isCheckingAuth) {
    return <SplashScreen onFinish={() => {}} />;
  }

  return (
    <>
      <GlobalVideoPlayer />
      <GlobalMusicPlayer />
      <Routes key={location.pathname}>
        <Route path="/" element={<PremiumPlansPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/flirts" element={<FlirtsPage />} />
        <Route path="/desires" element={<DesiresPage />} />
        <Route path="/fantasies" element={<FantasiesPage />} />
        <Route path="/daily-notes" element={<DailyNotesPage />} />
        <Route path="/couple-profiles" element={<CoupleProfiles />} />
        <Route path="/private/*" element={<PrivatePage />} />
        <Route path="/intimate-journal" element={<IntimateJournalPage />} />
        <Route path="/mood-customization" element={<MoodCustomization />} />
        <Route path="/flirt-customization" element={<FlirtCustomization />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/shop/gifts" element={<GiftsPage />} />
        <Route path="/shop/potions" element={<PotionsPage />} />
        <Route path="/gift-collections" element={<GiftCollections />} />
        <Route path="/shop/visual-effects" element={<VisualEffectsShop />} />
        <Route path="/shop/accessories" element={<AccessoriesPage />} />
        <Route path="/premium-plans" element={<PremiumPlansPage />} />
        <Route path="/poems" element={<PoemsPage />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/purchase" element={<InAppPurchasePage />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <OneSignalProvider>
        <ThemeProvider>
          <VideoPlayerProvider>
            <MusicPlayerProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <AppRouter />
                </BrowserRouter>
              </TooltipProvider>
            </MusicPlayerProvider>
          </VideoPlayerProvider>
        </ThemeProvider>
      </OneSignalProvider>
    </QueryClientProvider>
  );
};

export default App;
