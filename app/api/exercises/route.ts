import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/app/utils/firebaseAdmin";

export const dynamic = "force-dynamic";

function getExerciseNumber(title: string): number {
  const match = title?.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : 9999;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const exerciseType = searchParams.get("type");

    const db = getAdminDb();
    let query = db.collection("exercises");
    
    if (exerciseType === "eyeq" || exerciseType === "plastic") {
      query = query.where("exerciseType", "==", exerciseType) as typeof query;
    }
    
    const snapshot = await query.get();

    const exercises = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || "No title",
        ageGroup: data.ageGroup || "N/A",
        decisionTheme: data.decisionTheme || "N/A",
        playerInvolvement: data.playerInvolvement || "N/A",
        gameMoment: data.gameMoment || "N/A",
        difficulty: data.difficulty || "Unknown",
        practiceFormat: data.practiceFormat || "General / Mixed",
        overview: data.overview || "",
        description: data.description || "",
        exerciseBreakdownDesc: data.exerciseBreakdownDesc || "",
        image: data.image || "",
        exerciseType: data.exerciseType || "eyeq",
      };
    });

    exercises.sort((a, b) => getExerciseNumber(a.title) - getExerciseNumber(b.title));

    return NextResponse.json({ exercises }, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return NextResponse.json(
      { error: "Failed to fetch exercises", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
