import "./globals.css";
import type { Metadata } from 'next'
import PlanSyncProvider from "./components/PlanSyncProvider";
import { FavoritesProvider } from "./components/FavoritesProvider";
import { EntitlementProvider } from "./components/EntitlementProvider";

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
    <html lang="en">
      <body className="bg-background text-foreground min-h-screen">
        <EntitlementProvider>
          <FavoritesProvider>
            <PlanSyncProvider>
              <main className="w-full">{children}</main>
            </PlanSyncProvider>
          </FavoritesProvider>
        </EntitlementProvider>
      </body>
    </html>
  );
}