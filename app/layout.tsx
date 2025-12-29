import "./globals.css";
import type { Metadata } from 'next'
import { defaultLocale } from "./localization/translations";
import { AnalyticsProvider } from "./components/AnalyticsProvider";
import PlanSyncProvider from "./components/PlanSyncProvider";
import { FavoritesProvider } from "./components/FavoritesProvider";
import { EntitlementProvider } from "./components/EntitlementProvider";
import { ExerciseTypeProvider } from "./components/ExerciseTypeProvider";
import Footer from "./components/Footer";
import AnalyticsConsentBanner from "./components/AnalyticsConsentBanner";
import { LocalizationProvider } from "./components/LocalizationProvider";

export const metadata: Metadata = {
  title: "Football EyeQ",
  description: "Smart Soccer Exercise Catalogue and Session Planner",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={defaultLocale}>
      <head>
        <link rel="preconnect" href="https://www.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://firebase.googleapis.com" crossOrigin="anonymous" />
        <link rel="prefetch" href="/catalog" as="document" />
        <link rel="prefetch" href="/planner" as="document" />
      </head>
      <body className="bg-background text-foreground min-h-screen flex flex-col">
        <LocalizationProvider>
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
        </LocalizationProvider>
      </body>
    </html>
  );
}