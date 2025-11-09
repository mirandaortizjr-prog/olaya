import { useEffect } from "react";
import PullToRefresh from "pulltorefreshjs";
import { toast } from "@/components/ui/use-toast";

// Simple reusable hook to enable pull-to-refresh across the app
export default function usePullToRefresh(options?: { onRefresh?: () => Promise<void> | void }) {
  useEffect(() => {
    const ptr = PullToRefresh.init({
      mainElement: "body",
      shouldPullToRefresh: () => window.scrollY === 0,
      distThreshold: 60,
      distMax: 80,
      distReload: 70,
      passive: true,
      instructionsPullToRefresh: "Pull to refresh",
      instructionsReleaseToRefresh: "Release to refresh",
      instructionsRefreshing: "Refreshing…",
      onRefresh: async () => {
        const t = toast({ title: "Refreshing…" });
        try {
          if (options?.onRefresh) {
            await options.onRefresh();
          } else {
            window.location.reload();
          }
        } finally {
          setTimeout(() => t.dismiss(), 600);
        }
      },
    });

    return () => {
      try {
        // Destroy all instances to avoid duplicates on hot reloads
        PullToRefresh.destroyAll();
      } catch {}
    };
  }, []);
}
