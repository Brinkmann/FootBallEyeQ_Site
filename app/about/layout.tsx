import type { ReactNode } from "react";
import StructuredData from "../components/StructuredData";
import { buildBreadcrumbJsonLd, buildMetadata } from "../utils/seo";

export const metadata = buildMetadata({
  title: "About Football EyeQ | Building Smarter Footballers",
  description: "Meet the team behind Football EyeQ and learn how our cognitive-first training platform accelerates player decision-making.",
  path: "/about",
});

export default function AboutLayout({ children }: { children: ReactNode }) {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ]);

  return (
    <>
      <StructuredData data={breadcrumbJsonLd} />
      {children}
    </>
  );
}
