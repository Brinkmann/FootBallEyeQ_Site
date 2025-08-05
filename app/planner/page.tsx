"use client";
import { useState } from "react";
import NavBar from "../components/Navbar";

export default function SeasonPlanningPage() {
  const weeks = 12;

  const [plan, setPlan] = useState(
    Array.from({ length: weeks }, (_, weekIndex) => ({
      week: weekIndex + 1,
      exercises: weekIndex === 0 ? ["Precision Passing"] : []
    }))
  );

  const maxExercisesPerWeek = 5;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="p-6">
        {/* Action Bar */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">12-Week Season Plan</h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">
            + New Season Plan
          </button>
        </div>

        {/* Weeks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {plan.map((week, index) => (
            <div key={index} className="bg-white rounded shadow p-4">
              <h4 className="font-bold mb-2">Week {week.week}</h4>
              <p className="text-sm text-gray-500 mb-3">
                {week.exercises.length}/{maxExercisesPerWeek} exercises
              </p>

              <div className="space-y-2 mb-4">
                {Array.from({ length: maxExercisesPerWeek }).map((_, i) => (
                  <div
                    key={i}
                    className={`border p-2 text-sm rounded ${
                      week.exercises[i]
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-400 cursor-pointer hover:bg-gray-100"
                    }`}
                  >
                    {week.exercises[i] || "Add Exercise"}
                  </div>
                ))}
              </div>

              <button className="text-blue-600 text-sm hover:underline">✏️ Edit</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
