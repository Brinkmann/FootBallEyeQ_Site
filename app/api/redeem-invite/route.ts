import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, getAdminAuth } from "@/app/utils/firebaseAdmin";

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

    const userId = decodedToken.uid;
    const userEmail = decodedToken.email;

    const body = await request.json();
    const { inviteCode } = body;

    if (!inviteCode || typeof inviteCode !== "string") {
      return NextResponse.json({ error: "Invite code is required" }, { status: 400 });
    }

    const invitesRef = adminDb.collection("clubInvites");
    const inviteQuery = await invitesRef.where("code", "==", inviteCode.trim().toUpperCase()).get();

    if (inviteQuery.empty) {
      return NextResponse.json({ error: "Invalid invite code" }, { status: 404 });
    }

    const inviteDoc = inviteQuery.docs[0];
    const invite = inviteDoc.data();

    if (invite.usedBy) {
      return NextResponse.json({ error: "This invite code has already been used" }, { status: 400 });
    }

    const expiresAt = invite.expiresAt?.toDate();
    if (expiresAt && expiresAt < new Date()) {
      return NextResponse.json({ error: "This invite code has expired" }, { status: 400 });
    }

    if (invite.email && userEmail?.toLowerCase() !== invite.email.toLowerCase()) {
      return NextResponse.json({ 
        error: "This invite code was created for a different email address" 
      }, { status: 403 });
    }

    const clubRef = adminDb.collection("clubs").doc(invite.clubId);
    const clubDoc = await clubRef.get();
    
    if (!clubDoc.exists) {
      return NextResponse.json({ error: "Club not found" }, { status: 404 });
    }

    const clubData = clubDoc.data();
    const clubName = clubData?.name || "the club";

    const signupsRef = adminDb.collection("signups");
    const signupsQuery = await signupsRef.where("uid", "==", userId).get();

    const batch = adminDb.batch();

    if (!signupsQuery.empty) {
      const signupDoc = signupsQuery.docs[0];
      batch.update(signupDoc.ref, {
        accountType: "clubCoach",
        clubId: invite.clubId,
        clubRole: "coach",
        updatedAt: new Date(),
      });
    } else {
      const newSignupRef = signupsRef.doc(userId);
      batch.set(newSignupRef, {
        uid: userId,
        email: userEmail,
        accountType: "clubCoach",
        clubId: invite.clubId,
        clubRole: "coach",
        createdAt: new Date(),
      });
    }

    const membersRef = clubRef.collection("members").doc();
    batch.set(membersRef, {
      userId: userId,
      coachUid: userId,
      email: userEmail,
      role: "coach",
      status: "active",
      joinedAt: new Date(),
    });

    batch.update(inviteDoc.ref, {
      usedBy: userId,
      usedAt: new Date(),
    });

    await batch.commit();

    return NextResponse.json({
      success: true,
      clubId: invite.clubId,
      clubName: clubName,
      message: `Successfully joined ${clubName}!`,
    });

  } catch (error) {
    console.error("Error redeeming invite:", error);
    return NextResponse.json({ error: "Failed to redeem invite" }, { status: 500 });
  }
}
