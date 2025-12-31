import CatalogPageClient from "./CatalogPageClient";
import { Exercise } from "../types/exercise";
import { fetchExercisesFromSources } from "../lib/exerciseFetcher";

export default async function CatalogPage() {
  const initialExercises = await fetchExercisesFromSources(null).catch((error) => {
    console.error("Failed to prefetch exercises:", error);
    return [] as Exercise[];
  });
  return <CatalogPageClient initialExercises={initialExercises} />;
}
