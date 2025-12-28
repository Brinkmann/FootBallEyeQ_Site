import type { ReactNode } from "react";
import StructuredData from "../components/StructuredData";
import { buildBreadcrumbJsonLd, buildMetadata } from "../utils/seo";

export const metadata = buildMetadata({
  title: "Super Admin | Football EyeQ",
  description: "Platform-wide administration tools for Football EyeQ system owners.",
  path: "/super-admin",
});

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Super Admin", path: "/super-admin" },
  ]);

  return (
    <>
      <StructuredData data={breadcrumbJsonLd} />
      {children}
    </>
  );
}
