import type { ReactNode } from "react";
import StructuredData from "../components/StructuredData";
import { buildBreadcrumbJsonLd, buildMetadata } from "../utils/seo";

export const metadata = buildMetadata({
  title: "Why Scanning Matters | Football EyeQ",
  description: "Learn why scanning is critical for modern footballers and how Football EyeQ trains visual awareness on the pitch.",
  path: "/why-scanning",
});

export default function WhyScanningLayout({ children }: { children: ReactNode }) {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Why Scanning", path: "/why-scanning" },
  ]);

  return (
    <>
      <StructuredData data={breadcrumbJsonLd} />
      {children}
    </>
  );
}
