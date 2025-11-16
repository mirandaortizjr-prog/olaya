import { useEffect } from "react";
import { useOneSignal } from "@/hooks/useOneSignal";

export const OneSignalProvider = ({ children }: { children: React.ReactNode }) => {
  const { registerOneSignal } = useOneSignal();

  useEffect(() => {
    // Initialize OneSignal when app loads
    registerOneSignal();
  }, []);

  return <>{children}</>;
};
