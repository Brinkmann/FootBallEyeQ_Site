import type { ReactNode } from "react";
import StructuredData from "../components/StructuredData";
import { buildBreadcrumbJsonLd, buildMetadata } from "../utils/seo";

export const metadata = buildMetadata({
  title: "Login | Football EyeQ",
  description: "Sign in to Football EyeQ to access your personalized drills, planner, and smart cone integrations.",
  path: "/login",
});

export default function LoginLayout({ children }: { children: ReactNode }) {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Login", path: "/login" },
  ]);

  return (
    <>
      <StructuredData data={breadcrumbJsonLd} />
      {children}
    </>
  );
}
