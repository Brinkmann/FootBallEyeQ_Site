import "./globals.css";
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
      {/* These classes from globals.css will now handle light/dark mode */}
      <body className="bg-background text-foreground min-h-screen">
        <main className="w-full">{children}</main>
      </body>
    </html>
  );
}