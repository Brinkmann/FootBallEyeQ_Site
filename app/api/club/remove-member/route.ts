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

    const callerUid = decodedToken.uid;

    const body = await request.json();
    const { clubId, memberId, memberEmail } = body;

    if (!clubId || !memberId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
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

    const memberDoc = await adminDb.doc(`clubs/${clubId}/members/${memberId}`).get();
    if (!memberDoc.exists) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const memberData = memberDoc.data();
    if (memberData?.role === "admin") {
      return NextResponse.json({ error: "Cannot remove club admin" }, { status: 400 });
    }

    const memberUid = memberData?.userId || memberData?.coachUid;
    const storedEmail = memberData?.email;

    const batch = adminDb.batch();

    batch.delete(adminDb.doc(`clubs/${clubId}/members/${memberId}`));

    let memberSignupDoc = null;

    if (memberUid) {
      const memberSignupQuery = await adminDb
        .collection("signups")
        .where("uid", "==", memberUid)
        .get();

      if (!memberSignupQuery.empty) {
        memberSignupDoc = memberSignupQuery.docs[0];
      }
    }
    
    if (!memberSignupDoc && (storedEmail || memberEmail)) {
      const emailToSearch = storedEmail || memberEmail;
      
      let emailSignupQuery = await adminDb
        .collection("signups")
        .where("email", "==", emailToSearch)
        .get();

      if (emailSignupQuery.empty) {
        emailSignupQuery = await adminDb
          .collection("signups")
          .where("email", "==", emailToSearch.toLowerCase())
          .get();
      }

      if (!emailSignupQuery.empty) {
        memberSignupDoc = emailSignupQuery.docs[0];
      }
    }

    if (!memberSignupDoc) {
      batch.delete(adminDb.doc(`clubs/${clubId}/members/${memberId}`));
      await batch.commit();
      return NextResponse.json({
        success: true,
        message: `Removed ${memberEmail || "member"} from roster (no account found to downgrade)`,
      });
    }

    const signupData = memberSignupDoc.data();
    if (signupData.clubId === clubId) {
      batch.update(memberSignupDoc.ref, {
        clubId: null,
        clubRole: null,
        accountType: "free",
        updatedAt: new Date(),
      });
    }

    await batch.commit();

    return NextResponse.json({
      success: true,
      message: `Successfully removed ${memberEmail || "member"} from the club`,
    });

  } catch (error) {
    console.error("Error removing member:", error);
    return NextResponse.json({ error: "Failed to remove member" }, { status: 500 });
  }
}
