import type { ReactNode } from "react";
import StructuredData from "../../components/StructuredData";
import { buildBreadcrumbJsonLd, buildMetadata } from "../../utils/seo";

export const metadata = buildMetadata({
  title: "Session Stats | Football EyeQ Planner Insights",
  description: "Review Football EyeQ planner insights and statistics to track session quality and player engagement.",
  path: "/planner/stats",
});

export default function PlannerStatsLayout({ children }: { children: ReactNode }) {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Planner", path: "/planner" },
    { name: "Stats", path: "/planner/stats" },
  ]);

  return (
    <>
      <StructuredData data={breadcrumbJsonLd} />
      {children}
    </>
  );
}
