import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { initializeNativePushListeners } from "@/utils/notifications";

// Run SW cleanup in background without blocking app startup
const swCleanup = () => {
  setTimeout(async () => {
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
        sessionStorage.clear();
      }
    } catch (e) {
      console.warn("SW cleanup skipped:", e);
    }
  }, 0);
};

const start = () => {
  // Run SW cleanup in background (non-blocking)
  swCleanup();
  
  // Initialize native push notification listeners
  initializeNativePushListeners();
  
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("Root element not found");
  
  // Render app immediately - React splash will handle everything
  createRoot(rootElement).render(
    <LanguageProvider>
      <App />
    </LanguageProvider>
  );
};

start();
