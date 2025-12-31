import eyeqFallback from "./eyeqFallback.json";
import { validateExercises, type ValidatedExercise } from "./schemas";

const plasticFallbackExercises = eyeqFallback.map((exercise) => ({
  ...exercise,
  id: `plastic-${exercise.id}`,
  title: `${exercise.title} (Plastic Cones)`,
  overview:
    exercise.overview && exercise.overview.length > 0
      ? `${exercise.overview} (plastic cones variant).`
      : "Plastic cones variant of the original drill.",
  exerciseType: "plastic" as const,
}));

const rawFallbackExercises = [...eyeqFallback, ...plasticFallbackExercises];

export const fallbackExercises: ValidatedExercise[] = validateExercises(rawFallbackExercises as unknown[]);
