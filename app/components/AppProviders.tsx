"use client";

import AnalyticsConsentBanner from "./AnalyticsConsentBanner";
import { AnalyticsProvider } from "./AnalyticsProvider";
import { EntitlementProvider } from "./EntitlementProvider";
import { ExerciseTypeProvider } from "./ExerciseTypeProvider";
import { FavoritesProvider } from "./FavoritesProvider";
import Footer from "./Footer";
import PlanSyncProvider from "./PlanSyncProvider";

export default function AppProviders({ children }: { children: React.ReactNode }) {
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
