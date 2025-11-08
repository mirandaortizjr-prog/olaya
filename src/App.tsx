import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SplashScreen } from "@/components/SplashScreen";
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

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  // Only show splash on initial page load
  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    if (hasSeenSplash) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashFinish = () => {
    sessionStorage.setItem('hasSeenSplash', 'true');
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
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
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
