import { headers } from "next/headers";
import CatalogPageClient from "./CatalogPageClient";
import { Exercise } from "../types/exercise";
import { validateExercises } from "../lib/schemas";

async function fetchInitialExercises(): Promise<Exercise[]> {
  try {
    const headersList = await headers();
    const host = headersList.get("x-forwarded-host") ?? headersList.get("host") ?? "localhost:3000";
    const protocol = headersList.get("x-forwarded-proto") ?? "https";
    const origin = process.env.NEXT_PUBLIC_SITE_URL ?? `${protocol}://${host}`;

    const response = await fetch(`${origin}/api/exercises`, {
      cache: "no-store",
      next: { revalidate: 60 },
      headers: {
        host,
      },
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const payload = await response.json();
    const exercises = validateExercises(Array.isArray(payload?.exercises) ? payload.exercises : [])
      .sort((a, b) => {
        const numA = a.title.match(/^(\d+)/);
        const numB = b.title.match(/^(\d+)/);
        return (numA ? parseInt(numA[1], 10) : 9999) - (numB ? parseInt(numB[1], 10) : 9999);
      });

    return exercises;
  } catch (error) {
    console.error("Failed to prefetch exercises:", error);
    return [];
  }
}

export default async function CatalogPage() {
  const initialExercises = await fetchInitialExercises();
  return <CatalogPageClient initialExercises={initialExercises} />;
}
