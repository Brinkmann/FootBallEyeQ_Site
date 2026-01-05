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
    const { inviteId } = body;

    if (!inviteId) {
      return NextResponse.json({ error: "Missing invite ID" }, { status: 400 });
    }

    const inviteDoc = await adminDb.collection("clubInvites").doc(inviteId).get();

    if (!inviteDoc.exists) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }

    const inviteData = inviteDoc.data();
    const clubId = inviteData?.clubId;

    const callerSignupQuery = await adminDb
      .collection("signups")
      .where("uid", "==", callerUid)
      .get();

    if (callerSignupQuery.empty) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const callerData = callerSignupQuery.docs[0].data();
    if (callerData.clubId !== clubId || callerData.clubRole !== "admin") {
      return NextResponse.json({ error: "Not authorized to manage this invite" }, { status: 403 });
    }

    await adminDb.collection("clubInvites").doc(inviteId).delete();

    return NextResponse.json({
      success: true,
      message: "Invite cancelled successfully",
    });

  } catch (error) {
    console.error("Error deleting invite:", error);
    return NextResponse.json({ error: "Failed to cancel invite" }, { status: 500 });
  }
}
