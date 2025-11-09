import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { VideoPlayerProvider } from "@/contexts/VideoPlayerContext";
import { MusicPlayerProvider } from "@/contexts/MusicPlayerContext";
import { GlobalVideoPlayer } from "@/components/GlobalVideoPlayer";
import { GlobalMusicPlayer } from "@/components/GlobalMusicPlayer";
import { SplashScreen } from "@/components/SplashScreen";
import { supabase } from "@/integrations/supabase/client";
import { initializeNativePushListeners, subscribeToPushNotifications } from "@/utils/notifications";
import Index from "./pages/Index";
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
import IntimateJournalPage from "./pages/IntimateJournalPage";
import ShopPage from "./pages/ShopPage";
import GiftsPage from "./pages/GiftsPage";
import GiftCollections from "./pages/GiftCollections";
import VisualEffectsShop from "./pages/VisualEffectsShop";
import usePullToRefresh from "@/hooks/usePullToRefresh";

const queryClient = new QueryClient();

const AppRouter = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Initialize push notifications for authenticated users
          initializeNativePushListeners();
          subscribeToPushNotifications().catch(console.error);
          
          // Check if user has couple profile
          const { data: coupleData } = await supabase
            .from('couples')
            .select('id')
            .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
            .single();
          
          if (coupleData) {
            // User has couple profile, redirect to dashboard after splash
            setTimeout(() => {
              setShowSplash(false);
              setIsCheckingAuth(false);
              navigate('/dashboard');
            }, 2500);
            return;
          }
        }
        
        // New user or no couple profile, show landing page after splash
        setTimeout(() => {
          setShowSplash(false);
          setIsCheckingAuth(false);
        }, 2500);
      } catch (error) {
        console.error('Auth check error:', error);
        setTimeout(() => {
          setShowSplash(false);
          setIsCheckingAuth(false);
        }, 2500);
      }
    };

    checkAuthAndRedirect();
  }, [navigate]);

  // Enable pull-to-refresh across the app
  usePullToRefresh();

  if (showSplash || isCheckingAuth) {
    return <SplashScreen onFinish={() => {}} />;
  }

  return (
    <>
      <GlobalVideoPlayer />
      <GlobalMusicPlayer />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/flirts" element={<FlirtsPage />} />
        <Route path="/desires" element={<DesiresPage />} />
        <Route path="/daily-notes" element={<DailyNotesPage />} />
        <Route path="/couple-profiles" element={<CoupleProfiles />} />
        <Route path="/private" element={<PrivatePage />} />
        <Route path="/intimate-journal" element={<IntimateJournalPage />} />
        <Route path="/mood-customization" element={<MoodCustomization />} />
        <Route path="/flirt-customization" element={<FlirtCustomization />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/shop/gifts" element={<GiftsPage />} />
        <Route path="/gift-collections" element={<GiftCollections />} />
        <Route path="/shop/visual-effects" element={<VisualEffectsShop />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
};

export default App;
