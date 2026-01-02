import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminAuth } from "@/app/utils/firebaseAdmin";
import { getSessionCookieOptions } from "@/app/lib/serverAuth";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const cookieOptions = getSessionCookieOptions();
    const sessionCookie = cookieStore.get(cookieOptions.name)?.value;

    if (sessionCookie) {
      try {
        const auth = getAdminAuth();
        const decodedClaims = await auth.verifySessionCookie(sessionCookie);
        await auth.revokeRefreshTokens(decodedClaims.uid);
      } catch (error) {
        console.error("Error revoking session:", error);
      }
    }

    cookieStore.set(cookieOptions.name, "", {
      maxAge: 0,
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ success: true });
  }
}
