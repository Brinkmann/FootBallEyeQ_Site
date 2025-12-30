import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "../../lib/serverAuth";

export default async function StatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/login?redirect=/planner/stats");
  }

  const hasAccess =
    user.profile?.admin ||
    user.profile?.accountType === "clubCoach" ||
    user.profile?.accountType === "individualPremium";

  if (!hasAccess) {
    redirect("/upgrade");
  }

  return <>{children}</>;
}
