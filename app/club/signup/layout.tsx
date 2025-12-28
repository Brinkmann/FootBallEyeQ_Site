import type { ReactNode } from "react";
import StructuredData from "../../components/StructuredData";
import { buildBreadcrumbJsonLd, buildMetadata } from "../../utils/seo";

export const metadata = buildMetadata({
  title: "Club Signup | Football EyeQ",
  description: "Enroll your club with Football EyeQ to provide coaches and players with cognitive training resources and planning tools.",
  path: "/club/signup",
});

export default function ClubSignupLayout({ children }: { children: ReactNode }) {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Club Signup", path: "/club/signup" },
  ]);

  return (
    <>
      <StructuredData data={breadcrumbJsonLd} />
      {children}
    </>
  );
}
