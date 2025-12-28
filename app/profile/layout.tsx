import type { ReactNode } from "react";
import StructuredData from "../components/StructuredData";
import { buildBreadcrumbJsonLd, buildMetadata } from "../utils/seo";

export const metadata = buildMetadata({
  title: "Your Profile | Football EyeQ",
  description: "Manage your Football EyeQ profile, saved exercises, and session planning preferences.",
  path: "/profile",
});

export default function ProfileLayout({ children }: { children: ReactNode }) {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Profile", path: "/profile" },
  ]);

  return (
    <>
      <StructuredData data={breadcrumbJsonLd} />
      {children}
    </>
  );
}
