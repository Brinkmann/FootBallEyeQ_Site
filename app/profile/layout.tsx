import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "../lib/serverAuth";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/login?redirect=/profile");
  }

  return <>{children}</>;
}
