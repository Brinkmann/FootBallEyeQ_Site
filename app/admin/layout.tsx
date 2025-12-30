import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "../lib/serverAuth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/login?redirect=/admin");
  }

  if (!user.profile?.admin) {
    redirect("/catalog");
  }

  return <>{children}</>;
}
