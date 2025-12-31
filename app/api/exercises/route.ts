import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/app/utils/firebaseAdmin";
import { parseExerciseFromFirestore, ValidatedExercise } from "@/app/lib/schemas";

export const dynamic = "force-dynamic";
export const revalidate = 60;
export const runtime = "nodejs";

function getExerciseNumber(title: string): number {
  const match = title.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : 9999;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const exerciseType = searchParams.get("type");

    const db = getAdminDb();
    let query = db.collection("exercises");
    
    if (exerciseType && (exerciseType === "eyeq" || exerciseType === "plastic")) {
      query = query.where("exerciseType", "==", exerciseType) as typeof query;
    }
    
    const snapshot = await query.get();

    const exercises: ValidatedExercise[] = snapshot.docs
      .map((doc) => parseExerciseFromFirestore(doc.id, doc.data() as Record<string, unknown>))
      .filter((ex): ex is ValidatedExercise => ex !== null);

    exercises.sort((a, b) => getExerciseNumber(a.title) - getExerciseNumber(b.title));

    return NextResponse.json({ 
      exercises
    }, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return NextResponse.json(
      { error: "Failed to fetch exercises" },
      { status: 500 }
    );
  }
}
