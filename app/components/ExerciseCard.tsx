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
    <div className="bg-card border border-divider rounded-2xl shadow-md p-6 flex flex-col justify-between transition hover:shadow-lg">
      <div>
        {/* Title */}
        <h2 className="text-xl font-bold text-foreground mb-1">
          {exercise.title}
        </h2>

        {/* Meta */}
        <div className="text-sm text-gray-600 mb-2">
          {exercise.ageGroup} • {exercise.duration} • {exercise.difficulty}
        </div>

        {/* Overview - this is the "blurb" on the exercise cards */}
        {overview && (
          <p className="text-foreground opacity-80 text-sm mb-4">
            {overview}
          </p>
        )}

        {/* Tags */}
        {!!exercise.tags?.length && (
          <div className="flex flex-wrap gap-2 mb-4">
            {exercise.tags.map((tag, i) => (
              <span
                key={`${exercise.id}-tag-${i}`}
                className="bg-primary-light text-primary-dark px-2 py-1 rounded text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer: rating + actions (kept) */}
      <div className="flex justify-between items-center mt-auto">
        <div className="text-xs text-gray-500 italic">
          ⭐ {avgStars.toFixed(1)} ({reviewCount} review
          {reviewCount !== 1 ? "s" : ""})
        </div>
        <div className="flex space-x-2">

          {/* Preview button */}
          <button
            className="text-sm px-4 py-2 border border-primary text-primary rounded hover:bg-primary-light transition"
            onClick={() => setShowPreview(true)}
          >
            Preview
          </button>

          {/* Add to Plan button */}
          <button
            className="text-sm px-4 py-2 bg-primary text-button rounded bg-primary-hover transition"
            onClick={() => setShowWeeks(true)}
          >
            Add to Plan
          </button>

          {/* Review button */}
          <button
            className="text-sm px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
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

      {/* Week picker overlay */}
      {showWeeks && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowWeeks(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-sm rounded-2xl bg-card shadow-lg border border-divider">
            <div className="flex items-center justify-between p-4 border-b border-divider">
              <h3 className="text-base font-semibold text-foreground">Add to which week?</h3>
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
                  className="px-3 py-2 rounded border border-divider text-sm text-foreground hover:bg-background"
                >
                  Week {w}
                </button>
              ))}
            </div>

            <div className="p-3 pt-0 text-xs text-gray-500">
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