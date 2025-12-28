import type { ReactNode } from "react";
import StructuredData from "../../components/StructuredData";
import { buildBreadcrumbJsonLd, buildMetadata, buildProductJsonLd } from "../../utils/seo";

export const metadata = buildMetadata({
  title: "Checkout | Secure Your Football EyeQ Upgrade",
  description: "Complete your Football EyeQ Pro upgrade with secure checkout and immediate access to premium training features.",
  path: "/upgrade/checkout",
  type: "product",
});

export default function UpgradeCheckoutLayout({ children }: { children: ReactNode }) {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Upgrade", path: "/upgrade" },
    { name: "Checkout", path: "/upgrade/checkout" },
  ]);

  const productJsonLd = buildProductJsonLd({
    name: "Football EyeQ Pro Subscription",
    description: "Premium Football EyeQ access with advanced session planning, smart cone control, and priority support.",
    path: "/upgrade/checkout",
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
