import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/app/utils/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

const SUPER_ADMIN_EMAIL = "obrinkmann@gmail.com";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const auth = getAdminAuth();
    const decodedToken = await auth.verifyIdToken(token);

    if (decodedToken.email !== SUPER_ADMIN_EMAIL) {
      return NextResponse.json({ error: "Forbidden - Super admin only" }, { status: 403 });
    }

    const body = await request.json();
    const { type, targetId, action } = body;

    if (!type || !targetId || !action) {
      return NextResponse.json(
        { error: "Missing required fields: type, targetId, action" },
        { status: 400 }
      );
    }

    const db = getAdminDb();

    if (type === "user") {
      const signupRef = db.collection("signups").doc(targetId);
      const signupDoc = await signupRef.get();

      if (!signupDoc.exists) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const userData = signupDoc.data();

      if (action === "upgrade") {
        if (userData?.clubId) {
          return NextResponse.json(
            { error: "Cannot upgrade club member to individual premium. Remove from club first." },
            { status: 400 }
          );
        }

        await signupRef.update({
          accountType: "individualPremium",
          upgradedAt: FieldValue.serverTimestamp(),
          upgradedBy: "admin",
        });

        return NextResponse.json({
          success: true,
          message: `User upgraded to premium`,
        });
      } else if (action === "downgrade") {
        await signupRef.update({
          accountType: "free",
          upgradedAt: null,
          upgradedBy: null,
        });

        return NextResponse.json({
          success: true,
          message: `User downgraded to free`,
        });
      }
    } else if (type === "club") {
      const clubRef = db.collection("clubs").doc(targetId);
      const clubDoc = await clubRef.get();

      if (!clubDoc.exists) {
        return NextResponse.json({ error: "Club not found" }, { status: 404 });
      }

      if (action === "upgrade") {
        await clubRef.update({
          subscriptionStatus: "active",
          upgradedAt: FieldValue.serverTimestamp(),
          upgradedBy: "admin",
        });

        return NextResponse.json({
          success: true,
          message: `Club subscription activated`,
        });
      } else if (action === "downgrade") {
        await clubRef.update({
          subscriptionStatus: "inactive",
          upgradedAt: null,
          upgradedBy: null,
        });

        return NextResponse.json({
          success: true,
          message: `Club subscription deactivated`,
        });
      } else if (action === "trial") {
        await clubRef.update({
          subscriptionStatus: "trial",
          trialStartedAt: FieldValue.serverTimestamp(),
        });

        return NextResponse.json({
          success: true,
          message: `Club set to trial status`,
        });
      }
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Admin upgrade error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
