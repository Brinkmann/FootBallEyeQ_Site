import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import PlanSyncProvider from "./components/PlanSyncProvider";
import { FavoritesProvider } from "./components/FavoritesProvider";
import { EntitlementProvider } from "./components/EntitlementProvider";
import { ExerciseTypeProvider } from "./components/ExerciseTypeProvider";
import Footer from "./components/Footer";
import StructuredData from "./components/StructuredData";
import { buildBreadcrumbJsonLd, defaultOgImage, siteUrl } from "./utils/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Football EyeQ | Smart Soccer Training Platform",
  description: "Football EyeQ combines cognitive training, smart cones, and a digital planner to build smarter players and better sessions.",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Football EyeQ | Smart Soccer Training Platform",
    description: "Discover cognitive football drills, interactive cones, and a smart session planner to accelerate player decision-making.",
    url: siteUrl,
    siteName: "Football EyeQ",
    type: "website",
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: "Football EyeQ platform overview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Football EyeQ | Smart Soccer Training Platform",
    description: "Unlock smarter player development with Football EyeQ's cognitive drills, smart cones, and planning tools.",
    images: [defaultOgImage],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Football EyeQ",
  url: siteUrl,
  logo: `${siteUrl}/brand/logo-full.png`,
  sameAs: [
    "https://www.youtube.com/@FootballEyeQ",
    "https://www.linkedin.com/company/football-eyeq",
  ],
};

const siteBreadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Home", path: "/" },
]);

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://www.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://firebase.googleapis.com" crossOrigin="anonymous" />
        <link rel="prefetch" href="/catalog" as="document" />
        <link rel="prefetch" href="/planner" as="document" />
        <StructuredData data={[organizationJsonLd, siteBreadcrumbJsonLd]} />
      </head>
      <body className="bg-background text-foreground min-h-screen flex flex-col">
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
      </body>
    </html>
  );
}
