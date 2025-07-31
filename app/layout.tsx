import "./globals.css";
import Navbar from './components/Navbar'
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
      <body className="bg-black text-white min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4">{children}</main>
      </body>

    </html>
  );
}
