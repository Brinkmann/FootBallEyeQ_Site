import "server-only";
import { cookies } from "next/headers";
import { getAdminAuth, getAdminFirestore } from "../utils/firebaseAdmin";
import { UserProfile, AccountType } from "../types/account";

const SESSION_COOKIE_NAME = "__session";
const SESSION_EXPIRY_DAYS = 5;
const SUPER_ADMIN_EMAIL = "obrinkmann@gmail.com";

export interface SessionUser {
  uid: string;
  email: string | undefined;
  emailVerified: boolean;
}

export interface AuthenticatedUser extends SessionUser {
  profile: UserProfile | null;
}

export async function verifySession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionCookie) {
      return null;
    }

    const auth = getAdminAuth();
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, false);

    return {
      uid: decodedClaims.uid,
      email: decodedClaims.email,
      emailVerified: decodedClaims.email_verified || false,
    };
  } catch (error) {
    console.error("Session verification failed:", error);
    return null;
  }
}

export async function getUserProfile(uid: string, email?: string): Promise<UserProfile | null> {
  try {
    const db = getAdminFirestore();
    
    const signupsQuery = db.collection("signups").where("uid", "==", uid).limit(1);
    const snapshot = await signupsQuery.get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();
    if (!data) return null;

    const isSuperAdmin = email === SUPER_ADMIN_EMAIL;

    const normalizedAccountType = data.accountType === "club_admin" ? "clubCoach" : data.accountType;
    const normalizedClubRole = data.clubRole === true ? "admin" : data.clubRole;

    return {
      uid: data.uid || uid,
      email: data.email || email || "",
      fname: data.fname || "",
      lname: data.lname || "",
      organization: data.organization,
      accountType: normalizedAccountType || "free",
      clubId: data.clubId,
      clubRole: normalizedClubRole,
      admin: isSuperAdmin || data.admin || false,
      createdAt: data.createdAt?.toDate?.() || new Date(),
      accountStatus: data.accountStatus,
      suspendedAt: data.suspendedAt?.toDate?.(),
      suspendedReason: data.suspendedReason,
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  const session = await verifySession();
  if (!session) return null;

  const profile = await getUserProfile(session.uid, session.email);

  return {
    ...session,
    profile,
  };
}

export async function requireAuth(): Promise<AuthenticatedUser> {
  const user = await getAuthenticatedUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

export async function requireAdmin(): Promise<AuthenticatedUser> {
  const user = await requireAuth();
  if (!user.profile?.admin) {
    throw new Error("FORBIDDEN");
  }
  return user;
}

export async function requireClubAdmin(clubId?: string): Promise<AuthenticatedUser> {
  const user = await requireAuth();

  if (!user.profile) {
    throw new Error("FORBIDDEN");
  }

  if (user.profile.admin) {
    return user;
  }

  if (user.profile.accountType !== "clubCoach" || user.profile.clubRole !== "admin") {
    throw new Error("FORBIDDEN");
  }

  if (clubId && user.profile.clubId !== clubId) {
    throw new Error("FORBIDDEN");
  }

  return user;
}

export async function requireAccountType(
  allowedTypes: AccountType[]
): Promise<AuthenticatedUser> {
  const user = await requireAuth();

  if (!user.profile) {
    throw new Error("FORBIDDEN");
  }

  if (user.profile.admin) {
    return user;
  }

  if (!allowedTypes.includes(user.profile.accountType)) {
    throw new Error("FORBIDDEN");
  }

  return user;
}

export async function createSessionCookie(idToken: string): Promise<string> {
  const auth = getAdminAuth();
  const expiresIn = SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

  const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
  return sessionCookie;
}

export function getSessionCookieOptions() {
  return {
    name: SESSION_COOKIE_NAME,
    maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };
}
