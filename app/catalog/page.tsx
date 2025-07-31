import ExerciseCard from "../components/ExerciseCard";
import { exercises } from "../data/exercises";

export default function CatalogPage() {
  return (
    <div className="px-6 py-8">
      {/* Title + Intro */}
      <h1 className="text-3xl font-bold mb-1 text-gray-900 dark:text-white">
        Welcome back, Test
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Plan your training sessions and manage your exercise library
      </p>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6">
        {["Exercise Library", "Season Planning", "Session Codes", "Admin"].map((tab) => (
          <button
            key={tab}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex space-x-4 mb-8">
        <select className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm">
          <option>U10</option>
          <option>U12</option>
          <option>U14</option>
        </select>
        <select className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm">
          <option>All Difficulties</option>
          <option>Beginner</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
        <select className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm">
          <option>All Purposes</option>
          <option>Passing</option>
          <option>Dribbling</option>
          <option>Shooting</option>
        </select>
      </div>

      {/* Exercise Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exercises.map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} />
        ))}
      </div>
    </div>
  );
}
