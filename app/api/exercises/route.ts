import { NextResponse } from "next/server";
import { getAdminDb } from "@/app/utils/firebaseAdmin";
import { parseExerciseFromFirestore, ValidatedExercise } from "@/app/lib/schemas";

export const dynamic = "force-dynamic";
export const revalidate = 60;

function getExerciseNumber(title: string): number {
  const match = title.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : 9999;
}

export async function GET() {
  try {
    const db = getAdminDb();
    const snapshot = await db.collection("exercises").get();

    const exercises: ValidatedExercise[] = snapshot.docs
      .map((doc) => parseExerciseFromFirestore(doc.id, doc.data() as Record<string, unknown>))
      .filter((ex): ex is ValidatedExercise => ex !== null);

    exercises.sort((a, b) => getExerciseNumber(a.title) - getExerciseNumber(b.title));

    return NextResponse.json({ exercises }, {
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
