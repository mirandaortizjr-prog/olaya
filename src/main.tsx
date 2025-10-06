import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import DailyNotesPage from "./pages/DailyNotesPage";
import CoupleProfiles from "./pages/CoupleProfiles";
import NotFound from "./pages/NotFound";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { LanguageProvider } from "@/contexts/LanguageContext";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
  <BrowserRouter>
    <LanguageProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/daily-notes" element={<DailyNotesPage />} />
        <Route path="/couple-profiles" element={<CoupleProfiles />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
      <Toaster />
      <SonnerToaster position="top-center" />
    </LanguageProvider>
  </BrowserRouter>,
);
