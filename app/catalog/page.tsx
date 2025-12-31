import CatalogPageClient from "./CatalogPageClient";
import { Exercise } from "../types/exercise";
import { getAdminDb } from "../utils/firebaseAdmin";
import { parseExerciseFromFirestore } from "../lib/schemas";
import { fallbackExercises } from "../lib/fallbackExercises";

async function fetchInitialExercises(): Promise<Exercise[]> {
  try {
    const db = getAdminDb();
    const snapshot = await db.collection("exercises").get();

    return snapshot.docs
      .map((doc) => parseExerciseFromFirestore(doc.id, doc.data() as Record<string, unknown>))
      .filter((exercise): exercise is Exercise => exercise !== null)
      .sort((a, b) => {
        const numA = a.title.match(/^(\d+)/);
        const numB = b.title.match(/^(\d+)/);
        return (numA ? parseInt(numA[1], 10) : 9999) - (numB ? parseInt(numB[1], 10) : 9999);
      });
  } catch (error) {
    console.error("Failed to prefetch exercises:", error);
    return fallbackExercises;
  }
}

export default async function CatalogPage() {
  const initialExercises = await fetchInitialExercises();
  return <CatalogPageClient initialExercises={initialExercises} />;
}
