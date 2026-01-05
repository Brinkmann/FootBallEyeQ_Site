import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, getAdminAuth } from "@/app/utils/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const adminAuth = getAdminAuth();
    const adminDb = getAdminDb();

    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(idToken);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const callerUid = decodedToken.uid;

    const body = await request.json();
    const { clubId, clubName, email } = body;

    if (!clubId || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const callerSignupQuery = await adminDb
      .collection("signups")
      .where("uid", "==", callerUid)
      .get();

    if (callerSignupQuery.empty) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const callerData = callerSignupQuery.docs[0].data();
    if (callerData.clubId !== clubId || callerData.clubRole !== "admin") {
      return NextResponse.json({ error: "Not authorized to manage this club" }, { status: 403 });
    }

    const existingMemberQuery = await adminDb
      .collection(`clubs/${clubId}/members`)
      .where("email", "==", normalizedEmail)
      .get();

    if (!existingMemberQuery.empty) {
      return NextResponse.json({ 
        error: "This email is already a member of your club" 
      }, { status: 400 });
    }

    const existingInviteQuery = await adminDb
      .collection("clubInvites")
      .where("clubId", "==", clubId)
      .where("email", "==", normalizedEmail)
      .where("usedBy", "==", null)
      .get();

    const now = new Date();
    const validPendingInvite = existingInviteQuery.docs.find(doc => {
      const data = doc.data();
      const expiresAt = data.expiresAt?.toDate?.() || data.expiresAt;
      return expiresAt && expiresAt > now;
    });

    if (validPendingInvite) {
      const existingData = validPendingInvite.data();
      return NextResponse.json({
        success: true,
        invite: {
          id: validPendingInvite.id,
          code: existingData.code,
          email: existingData.email,
          createdAt: existingData.createdAt?.toDate?.() || existingData.createdAt,
          expiresAt: existingData.expiresAt?.toDate?.() || existingData.expiresAt,
        },
        message: "An active invite already exists for this email",
        existing: true,
      });
    }

    const code = generateInviteCode();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const inviteRef = await adminDb.collection("clubInvites").add({
      clubId,
      clubName: clubName || "",
      code,
      email: normalizedEmail,
      createdAt: FieldValue.serverTimestamp(),
      expiresAt,
      usedBy: null,
    });

    return NextResponse.json({
      success: true,
      invite: {
        id: inviteRef.id,
        code,
        email: normalizedEmail,
        createdAt: new Date(),
        expiresAt,
      },
      message: "Access code created successfully",
      existing: false,
    });

  } catch (error) {
    console.error("Error creating invite:", error);
    return NextResponse.json({ error: "Failed to create access code" }, { status: 500 });
  }
}
