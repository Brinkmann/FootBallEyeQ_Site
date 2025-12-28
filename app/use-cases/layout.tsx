import type { ReactNode } from "react";
import StructuredData from "../components/StructuredData";
import { buildBreadcrumbJsonLd, buildMetadata } from "../utils/seo";

export const metadata = buildMetadata({
  title: "Football EyeQ Use Cases | Training for Every Level",
  description: "See how academies, clubs, and individual coaches apply Football EyeQ to improve scanning, decision-making, and game awareness.",
  path: "/use-cases",
});

export default function UseCasesLayout({ children }: { children: ReactNode }) {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Use Cases", path: "/use-cases" },
  ]);

  return (
    <>
      <StructuredData data={breadcrumbJsonLd} />
      {children}
    </>
  );
}
