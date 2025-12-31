import { NextRequest, NextResponse } from "next/server";
import { fetchExercisesFromSources } from "@/app/lib/exerciseFetcher";

export const dynamic = "force-dynamic";
export const revalidate = 60;
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const exerciseType = searchParams.get("type");

  try {
    const exercises = await fetchExercisesFromSources(exerciseType);

    return NextResponse.json({
      exercises,
    }, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return NextResponse.json({ error: "Failed to fetch exercises" }, { status: 500 });
  }
}
