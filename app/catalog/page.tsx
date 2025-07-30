import ExerciseCard from "../components/ExerciseCard";
import { exercises } from "../data/exercises";

export default function CatalogPage() {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {exercises.map((exercise) => (
        <ExerciseCard key={exercise.id} exercise={exercise} />
      ))}
    </div>
  );
}
