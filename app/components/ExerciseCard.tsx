"use client";
import { useState } from "react";
import { usePlanStore } from "../store/usePlanStore";
import { Exercise } from "../types/exercise";

export default function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const [showWeeks, setShowWeeks] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const addToWeek = usePlanStore((s) => s.addToWeek);
  const overview = exercise.overview ?? "";

  const handlePick = (week: number) => {
    const res = addToWeek(week, exercise.title);
    if (!res.ok) {
      const msg =
        res.reason === "duplicate"
          ? "This exercise is already in that week."
          : res.reason === "full"
          ? "That week already has 5 exercises."
          : "Could not add to that week.";
      alert(msg);
      return;
    }
    setShowWeeks(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md p-6 flex flex-col justify-between transition hover:shadow-lg">
      <div>
        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
          {exercise.title}
        </h2>

        {/* Meta */}
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {exercise.ageGroup} • {exercise.duration} • {exercise.difficulty}
        </div>

        {/* Overview - this is the "blurb" on the exercise cards */}
        {overview && (
          <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
            {overview}
          </p>
        )}

        {/* Tags */}
        {!!exercise.tags?.length && (
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
        )}
      </div>

      {/* Footer: rating + actions (kept) */}
      <div className="flex justify-between items-center mt-auto">
        <div className="text-xs text-gray-500 italic dark:text-gray-400">
          ⭐ 0.0 (0 reviews)
        </div>
        <div className="flex space-x-2">

          {/* Preview button */}
          <button 
            className="text-sm px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 dark:hover:bg-gray-700 transition"
            onClick={() => setShowPreview(true)}
          >
            Preview
          </button>

          {/* Add to Plan button */}
          <button
            className="text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={() => setShowWeeks(true)}
          >
            Add to Plan
          </button>
        </div>
      </div>

      {/* Week picker overlay */}
      {showWeeks && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowWeeks(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white dark:bg-gray-900 shadow-lg">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-800">
              <h3 className="text-base font-semibold">Add to which week?</h3>
              <button
                onClick={() => setShowWeeks(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="p-4 grid grid-cols-3 gap-2">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((w) => (
                <button
                  key={w}
                  onClick={() => handlePick(w)}
                  className="px-3 py-2 rounded border text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Week {w}
                </button>
              ))}
            </div>

            <div className="p-3 pt-0 text-xs text-gray-500 dark:text-gray-400">
              Tip: up to 5 exercises per week; duplicates are prevented.
            </div>
          </div>
        </div>
      )}

      {/* Preview overlay */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowPreview(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-5x1 max-w-[calc(100%-3rem)] rounded-2xl bg-white dark:bg-gray-900 shadow-lg p-6">

            {/* Scrollable content */}
            <div className="max-h-[90vh] overflow-y-auto">
              {/* Image on left, text on right */}
              <div className="flex flex-col md:flex-row gap-6">
                {/* Image */}
                {exercise.image && (
                  <div className="flex-shrink-0 md:w-1/3">
                    <img
                      src={exercise.image}
                      alt={exercise.title}
                      className="w-full h-auto object-cover rounded-lg border border-gray-300 dark:border-gray-700"
                    />
                  </div>
                )}

                {/* Details */}
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b pb-2 mb-4">
                    <h3 className="text-lg font-bold">{exercise.title}</h3>
                    <button
                      onClick={() => setShowPreview(false)}
                      className="text-gray-500 hover:text-gray-700"
                      aria-label="Close"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Details section */}
                  <div className="space-y-2 mb-6 text-sm text-gray-700 dark:text-gray-300">
                    <p><span className="font-semibold">Age group:</span> {exercise.ageGroup}</p>
                    <p><span className="font-semibold">Duration:</span> {exercise.duration}</p>
                    <p><span className="font-semibold">Difficulty level:</span> {exercise.difficulty}</p>
                    {exercise.tags?.length > 0 && (
                      <p>
                        <span className="font-semibold">Skill:</span> {exercise.tags[exercise.tags.length - 1]}
                      </p>
                    )}
                  </div>

                  <hr className="border-gray-300 dark:border-gray-700 mb-4" />

                  {/* Overview */}
                  {exercise.overview && (
                    <>
                      <h4 className="text-md font-semibold mb-2">Overview</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 whitespace-pre-line">
                        {exercise.overview}
                      </p>
                    </>
                  )}

                  <hr className="border-gray-300 dark:border-gray-700 mb-4" />

                  {/* Description */}
                  {exercise.description && (
                    <>
                      <h4 className="text-md font-semibold mb-2">Description</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                        {exercise.description}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
