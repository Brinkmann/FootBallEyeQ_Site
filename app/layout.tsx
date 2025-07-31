import "./globals.css";
import SessionWrapper from "./SessionWrapper";
import type { Metadata } from 'next'

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
      <body className="bg-[#101d42] text-white min-h-screen">
        <SessionWrapper>
          {children}
        </SessionWrapper>
      </body>

    </html>
  );
}
