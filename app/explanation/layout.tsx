import type { ReactNode } from "react";
import StructuredData from "../components/StructuredData";
import { buildBreadcrumbJsonLd, buildMetadata } from "../utils/seo";

export const metadata = buildMetadata({
  title: "Football EyeQ Explained | Training Philosophy",
  description: "Understand the Football EyeQ training philosophy and how cognitive drills translate into smarter play on the field.",
  path: "/explanation",
});

export default function ExplanationLayout({ children }: { children: ReactNode }) {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Explanation", path: "/explanation" },
  ]);

  return (
    <>
      <StructuredData data={breadcrumbJsonLd} />
      {children}
    </>
  );
}
