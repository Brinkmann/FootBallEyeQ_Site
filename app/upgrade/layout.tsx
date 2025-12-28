import type { ReactNode } from "react";
import StructuredData from "../components/StructuredData";
import { buildBreadcrumbJsonLd, buildMetadata, buildProductJsonLd } from "../utils/seo";

export const metadata = buildMetadata({
  title: "Upgrade to Football EyeQ Pro | Unlock Premium Training",
  description: "Upgrade to Football EyeQ Pro for full access to cognitive drills, session planning, and smart cone integrations.",
  path: "/upgrade",
  type: "product",
});

export default function UpgradeLayout({ children }: { children: ReactNode }) {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Upgrade", path: "/upgrade" },
  ]);

  const productJsonLd = buildProductJsonLd({
    name: "Football EyeQ Pro Subscription",
    description: "Premium Football EyeQ access with advanced session planning, smart cone control, and priority support.",
    path: "/upgrade",
    price: "29.99",
    currency: "USD",
  });

  return (
    <>
      <StructuredData data={[breadcrumbJsonLd, productJsonLd]} />
      {children}
    </>
  );
}
