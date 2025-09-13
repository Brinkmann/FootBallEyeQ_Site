import { Exercise } from "../types/exercise";

export default function ExerciseCard({ exercise }: { exercise: Exercise }) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md p-6 flex flex-col justify-between transition hover:shadow-lg">
      <div>
        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
          {exercise.title}
        </h2>

        {/* Meta info */}
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {exercise.ageGroup} • {exercise.duration} • {exercise.difficulty}
        </div>

        {/* Overview */}
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
          {exercise.overview}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {exercise.tags.map((tag) => (
            <span
              key={tag}
              className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Rating + Buttons */}
      <div className="flex justify-between items-center mt-auto">
        {/* Placeholder rating */}
        <div className="text-xs text-gray-500 italic dark:text-gray-400">
          ⭐ 0.0 (0 reviews)
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <button className="text-sm px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 dark:hover:bg-gray-700 transition">
            Preview
          </button>
          <button className="text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Add to Plan
          </button>
        </div>
      </div>
    </div>
  );
}
