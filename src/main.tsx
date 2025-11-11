import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { initializeNativePushListeners } from "@/utils/notifications";

const swCleanup = async () => {
  try {
    const host = location.hostname;
    const isLovableHost = host.includes("lovable");
    const shouldUnregister = import.meta.env.MODE !== "production" || isLovableHost;
    if (shouldUnregister && "serviceWorker" in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));
      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
      // Clear sessionStorage to ensure fresh start
      sessionStorage.clear();
      if (!localStorage.getItem("reloadedAfterSWCleanup")) {
        localStorage.setItem("reloadedAfterSWCleanup", "true");
        location.reload();
        return false;
      }
    }
  } catch (e) {
    console.warn("SW cleanup skipped:", e);
  }
  return true;
};

const start = async () => {
  const proceed = await swCleanup();
  if (!proceed) return;
  
  // Initialize native push notification listeners
  initializeNativePushListeners();
  
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("Root element not found");
  createRoot(rootElement).render(
    <LanguageProvider>
      <App />
    </LanguageProvider>
  );
  
  // Hide initial splash after React mounts
  setTimeout(() => {
    const splash = document.getElementById("initial-splash");
    if (splash) {
      splash.classList.add("hidden");
      // Remove from DOM after transition
      setTimeout(() => splash.remove(), 300);
    }
  }, 100);
};

start();
