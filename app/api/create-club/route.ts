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
    const { clubName, firstName, lastName } = body;

    if (!clubName || typeof clubName !== "string" || !clubName.trim()) {
      return NextResponse.json({ error: "Club name is required" }, { status: 400 });
    }

    const signupsRef = adminDb.collection("signups");
    const existingSignup = await signupsRef.where("uid", "==", userId).get();
    
    if (!existingSignup.empty) {
      const userData = existingSignup.docs[0].data();
      if (userData.clubId) {
        return NextResponse.json({ 
          error: "You are already a member of a club" 
        }, { status: 400 });
      }
    }

    const batch = adminDb.batch();

    const clubRef = adminDb.collection("clubs").doc();
    batch.set(clubRef, {
      name: clubName.trim(),
      contactEmail: userEmail,
      subscriptionStatus: "trial",
      status: "active",
      createdAt: new Date(),
      createdBy: userId,
    });

    if (!existingSignup.empty) {
      const signupDoc = existingSignup.docs[0];
      batch.update(signupDoc.ref, {
        accountType: "club_admin",
        clubId: clubRef.id,
        clubRole: "admin",
        organization: clubName.trim(),
        updatedAt: new Date(),
      });
    } else {
      const newSignupRef = signupsRef.doc(userId);
      batch.set(newSignupRef, {
        uid: userId,
        email: userEmail,
        fname: firstName || "",
        lname: lastName || "",
        admin: false,
        organization: clubName.trim(),
        accountType: "club_admin",
        accountStatus: "active",
        clubId: clubRef.id,
        clubRole: "admin",
        createdAt: new Date(),
      });
    }

    const membersRef = clubRef.collection("members").doc();
    batch.set(membersRef, {
      userId: userId,
      coachUid: userId,
      email: userEmail,
      role: "admin",
      status: "active",
      joinedAt: new Date(),
    });

    await batch.commit();

    return NextResponse.json({
      success: true,
      clubId: clubRef.id,
      clubName: clubName.trim(),
      message: `Successfully created ${clubName.trim()}!`,
    });

  } catch (error) {
    console.error("Error creating club:", error);
    return NextResponse.json({ error: "Failed to create club" }, { status: 500 });
  }
}
