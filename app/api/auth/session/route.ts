import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminAuth } from "@/app/lib/firebaseAdmin";
import { createSessionCookie, getSessionCookieOptions } from "@/app/lib/serverAuth";

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json(
        { error: "Invalid request: idToken required" },
        { status: 400 }
      );
    }

    const auth = getAdminAuth();
    const decodedToken = await auth.verifyIdToken(idToken);

    const authTime = decodedToken.auth_time * 1000;
    if (Date.now() - authTime > 5 * 60 * 1000) {
      return NextResponse.json(
        { error: "Recent sign in required. Please sign in again." },
        { status: 401 }
      );
    }

    const sessionCookie = await createSessionCookie(idToken);
    const cookieOptions = getSessionCookieOptions();

    const cookieStore = await cookies();
    cookieStore.set(cookieOptions.name, sessionCookie, {
      maxAge: cookieOptions.maxAge,
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      path: cookieOptions.path,
    });

    return NextResponse.json({ 
      success: true,
      uid: decodedToken.uid,
    });
  } catch (error) {
    console.error("Session creation error:", error);

    const message = error instanceof Error ? error.message : "Authentication failed";

    if (message.includes("Missing Firebase Admin credentials")) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 }
    );
  }
}
