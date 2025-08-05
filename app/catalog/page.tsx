import ExerciseCard from "../components/ExerciseCard";
import NavBar from "../components/Navbar";
import { exercises } from "../data/exercises";

export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="px-6 py-8">
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
    </div>
  );
}
