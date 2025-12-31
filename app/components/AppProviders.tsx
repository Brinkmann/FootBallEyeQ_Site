"use client";

import { useEffect, useState } from "react";
import AnalyticsConsentBanner from "./AnalyticsConsentBanner";
import { AnalyticsProvider } from "./AnalyticsProvider";
import { EntitlementProvider } from "./EntitlementProvider";
import { ExerciseTypeProvider } from "./ExerciseTypeProvider";
import { FavoritesProvider } from "./FavoritesProvider";
import Footer from "./Footer";
import PlanSyncProvider from "./PlanSyncProvider";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <div className="bg-background text-foreground min-h-screen flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-divider">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-primary" aria-hidden="true" />
            <div>
              <div className="h-3.5 w-32 bg-muted rounded" aria-hidden="true" />
              <div className="h-3 w-20 bg-muted rounded mt-1" aria-hidden="true" />
            </div>
          </div>
          <div className="h-9 w-24 bg-muted rounded" aria-hidden="true" />
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-16">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="h-10 w-10 rounded-full border-b-2 border-primary animate-spin" aria-hidden="true" />
            </div>
            <p className="text-sm text-foreground/70">Loading Football EyeQ…</p>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-divider text-xs text-foreground/60">
          Football EyeQ
        </div>
      </div>
    );
  }

  return (
    <AnalyticsProvider>
      <AnalyticsConsentBanner />
      <EntitlementProvider>
        <ExerciseTypeProvider>
          <FavoritesProvider>
            <PlanSyncProvider>
              <main className="w-full flex-1">{children}</main>
              <Footer />
            </PlanSyncProvider>
          </FavoritesProvider>
        </ExerciseTypeProvider>
      </EntitlementProvider>
    </AnalyticsProvider>
  );
}
