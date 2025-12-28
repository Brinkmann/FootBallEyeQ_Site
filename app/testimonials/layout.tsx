import type { ReactNode } from "react";
import StructuredData from "../components/StructuredData";
import { buildBreadcrumbJsonLd, buildMetadata } from "../utils/seo";

export const metadata = buildMetadata({
  title: "Football EyeQ Testimonials | Coach and Player Success",
  description: "Read how coaches and players use Football EyeQ to sharpen scanning habits, speed up decisions, and improve match performances.",
  path: "/testimonials",
});

export default function TestimonialsLayout({ children }: { children: ReactNode }) {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Testimonials", path: "/testimonials" },
  ]);

  return (
    <>
      <StructuredData data={breadcrumbJsonLd} />
      {children}
    </>
  );
}
