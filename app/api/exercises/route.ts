import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/app/utils/firebaseAdmin";
import { parseExerciseFromFirestore, ValidatedExercise } from "@/app/lib/schemas";
import { fallbackExercises } from "@/app/lib/fallbackExercises";

export const dynamic = "force-dynamic";
export const revalidate = 60;
export const runtime = "nodejs";

function getExerciseNumber(title: string): number {
  const match = title.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : 9999;
}

async function fetchExercises(exerciseType: string | null): Promise<ValidatedExercise[]> {
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

  return exercises;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const exerciseType = searchParams.get("type");

  try {
    const exercises = await fetchExercises(exerciseType);

    return NextResponse.json({
      exercises,
    }, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Error fetching exercises, serving fallback:", error);
    const filteredFallback = exerciseType
      ? fallbackExercises.filter((ex) => ex.exerciseType === exerciseType)
      : fallbackExercises;

    return NextResponse.json({
      exercises: filteredFallback,
      fallback: true,
    }, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
      status: 200,
    });
  }
}
