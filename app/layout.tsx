import "./globals.css";
import type { Metadata } from 'next'
import PlanSyncProvider from "./components/PlanSyncProvider";

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
        <PlanSyncProvider>
          <main className="w-full">{children}</main>
        </PlanSyncProvider>
      </body>
    </html>
  );
}