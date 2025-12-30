import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "../../lib/serverAuth";

export default async function ClubDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/login?redirect=/club/dashboard");
  }

  const isClubAdmin =
    user.profile?.admin ||
    (user.profile?.accountType === "clubCoach" && user.profile?.clubRole === "admin");

  if (!isClubAdmin) {
    redirect("/catalog");
  }

  return <>{children}</>;
}
