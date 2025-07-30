type Exercise = {
  id: number;
  title: string;
  ageGroup: string;
  duration: string;
  difficulty: string;
  description: string;
  tags: string[];
};

export default function ExerciseCard({ exercise }: { exercise: Exercise }) {
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
      <h2 className="text-xl font-bold mb-2">{exercise.title}</h2>
      <div className="text-sm text-gray-600 mb-2">
        {exercise.ageGroup} • {exercise.duration} • {exercise.difficulty}
      </div>
      <p className="mb-3">{exercise.description}</p>
      <div className="flex flex-wrap gap-2">
        {exercise.tags.map((tag) => (
          <span
            key={tag}
            className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}