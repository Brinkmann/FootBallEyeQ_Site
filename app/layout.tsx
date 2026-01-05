import "./globals.css";
import type { Metadata } from 'next'
import AppProviders from "./components/AppProviders";

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
      <head></head>
      <body className="bg-background text-foreground min-h-screen flex flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}