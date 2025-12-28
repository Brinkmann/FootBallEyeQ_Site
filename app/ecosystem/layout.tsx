import type { ReactNode } from "react";
import StructuredData from "../components/StructuredData";
import { buildBreadcrumbJsonLd, buildMetadata } from "../utils/seo";

export const metadata = buildMetadata({
  title: "Football EyeQ Ecosystem | Connected Training Tools",
  description: "Explore the Football EyeQ ecosystem of smart cones, digital planning, and analytics that work together for modern coaching.",
  path: "/ecosystem",
});

export default function EcosystemLayout({ children }: { children: ReactNode }) {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Ecosystem", path: "/ecosystem" },
  ]);

  return (
    <>
      <StructuredData data={breadcrumbJsonLd} />
      {children}
    </>
  );
}
