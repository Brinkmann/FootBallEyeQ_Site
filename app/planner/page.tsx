export default function PlannerPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Session Planner</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((week) => (
          <div
            key={week}
            className="bg-gray-800 rounded-lg p-4 shadow border border-gray-700"
          >
            <h2 className="font-semibold text-lg mb-2">Week {week}</h2>
            <ul className="ml-4 list-disc">
              <li>Sample exercise for Week {week}</li>
              <li>Another exercise for Week {week}</li>
            </ul>
            <button className="mt-4 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
              + Add Exercise
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
