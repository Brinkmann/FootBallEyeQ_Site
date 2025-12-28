import type { ReactNode } from "react";
import StructuredData from "../components/StructuredData";
import { buildBreadcrumbJsonLd, buildMetadata } from "../utils/seo";

export const metadata = buildMetadata({
  title: "Exercise Catalog | Cognitive Football Drills",
  description: "Browse scanning-focused football exercises with filters for age groups, decision themes, and formats to sharpen player IQ.",
  path: "/catalog",
});

export default function CatalogLayout({ children }: { children: ReactNode }) {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Catalog", path: "/catalog" },
  ]);

  return (
    <>
      <StructuredData data={breadcrumbJsonLd} />
      {children}
    </>
  );
}
