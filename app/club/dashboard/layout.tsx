import type { ReactNode } from "react";
import StructuredData from "../../components/StructuredData";
import { buildBreadcrumbJsonLd, buildMetadata } from "../../utils/seo";

export const metadata = buildMetadata({
  title: "Club Dashboard | Football EyeQ",
  description: "Manage your club's Football EyeQ activity with shared exercises, session plans, and player development insights.",
  path: "/club/dashboard",
});

export default function ClubDashboardLayout({ children }: { children: ReactNode }) {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Club", path: "/club/dashboard" },
  ]);

  return (
    <>
      <StructuredData data={breadcrumbJsonLd} />
      {children}
    </>
  );
}
