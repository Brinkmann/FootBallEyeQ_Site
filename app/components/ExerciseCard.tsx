"use client";
import { useEffect, useState } from "react";
import { usePlanStore } from "../store/usePlanStore";
import { Exercise } from "../types/exercise";
import { db } from "@/Firebase/firebaseConfig";
import { collection, onSnapshot, query, where } from "firebase/firestore";

// Import the new modal components
import ExercisePreviewModal from "./ExercisePreviewModal";
import ExerciseReviewModal from "./ExerciseReviewModal";

export default function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const [showWeeks, setShowWeeks] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const addToWeek = usePlanStore((s) => s.addToWeek);
  const overview = exercise.overview ?? "";

  // Update reviews 
  const [avgStars, setAvgStars] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  /**
   * Subscribe to reviews collection for this exercise to get real-time updates
   * (This logic stays here, as it's part of the Card's display)
   */
  useEffect(() => {
    const q = query(
      collection(db, "reviews"),
      where("exerciseN", "==", exercise.title)
    );
    // Wait for real-time updates
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        setAvgStars(0);
        setReviewCount(0);
        return;
      }
      // Calculate average stars
      const reviews = snapshot.docs.map((doc) => doc.data());
      const totalStars = reviews.reduce((sum, r) => sum + (r.numStar || 0), 0);
      const avg = totalStars / reviews.length;

      setAvgStars(Number(avg.toFixed(1)));
      setReviewCount(reviews.length);
    });

    return () => unsubscribe();
  }, [exercise.title]);

  // Handle adding exercise to a selected week
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
            {exercise.tags.map((tag, i) => (
              <span
                key={`${exercise.id}-tag-${i}`}
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
          ⭐ {avgStars.toFixed(1)} ({reviewCount} review
          {reviewCount !== 1 ? "s" : ""})
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

          {/* Review button */}
          <button
            className="text-sm px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
            onClick={() => setShowReviewForm(true)}
          >
            Review
          </button>
        </div>
      </div>

      {/* ====================================================================
        MODALS ARE NOW RENDERED HERE (Conditionally)
        All the complex JSX and logic has been moved to their own components.
        ====================================================================
      */}

      {/* Review form overlay */}
      {showReviewForm && (
        <ExerciseReviewModal 
          exercise={exercise} 
          onClose={() => setShowReviewForm(false)} 
        />
      )}

      {/* Week picker overlay (This one is small, so it can stay) */}
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
                  key={`week-${w}`}
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
        <ExercisePreviewModal 
          exercise={exercise} 
          onClose={() => setShowPreview(false)} 
        />
      )}
    </div>
  );
}