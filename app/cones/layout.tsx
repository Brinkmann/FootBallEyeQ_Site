import type { ReactNode } from "react";
import StructuredData from "../components/StructuredData";
import { buildBreadcrumbJsonLd, buildMetadata, buildProductJsonLd } from "../utils/seo";

export const metadata = buildMetadata({
  title: "Smart Cones | Football EyeQ Training Hardware",
  description: "Control Football EyeQ smart cones to run visual scanning patterns that sharpen player reactions and awareness.",
  path: "/cones",
  type: "product",
});

export default function ConesLayout({ children }: { children: ReactNode }) {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Smart Cones", path: "/cones" },
  ]);

  const productJsonLd = buildProductJsonLd({
    name: "Football EyeQ Smart Cones",
    description: "Interactive light cones powered by Football EyeQ to drive scanning and rapid decision-making exercises.",
    path: "/cones",
    price: "249.00",
    currency: "USD",
  });

  return (
    <>
      <StructuredData data={[breadcrumbJsonLd, productJsonLd]} />
      {children}
    </>
  );
}
