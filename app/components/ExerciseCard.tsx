"use client";
import { useEffect, useState } from "react";
import { usePlanStore } from "../store/usePlanStore";
import { Exercise } from "../types/exercise";
import { db } from "@/Firebase/firebaseConfig";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useFavoritesContext } from "./FavoritesProvider";

import ExercisePreviewModal from "./ExercisePreviewModal";
import ExerciseReviewModal from "./ExerciseReviewModal";

const abbreviateLabel = (label: string): string => {
  const abbreviations: Record<string, string> = {
    "Foundation Phase (U7-U10)": "U7-U10",
    "Youth Development Phase (U11-U14)": "U11-U14",
    "Performance Phase (U15-U18)": "U15-U18",
    "Senior / Adult": "Adult",
    "Team Unit (5+ players)": "5+ Players",
    "Small Group (2-4 players)": "2-4 Players",
    "Individual (1 player)": "Individual",
    "Warm-Up / Ball Mastery": "Warm-Up",
    "General / Unspecified": "",
  };
  return abbreviations[label] || label;
};

export default function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const [showWeeks, setShowWeeks] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  const { isFavorite, toggleFavorite, isAuthenticated, isAtLimit, maxFavorites } = useFavoritesContext();
  const favorited = isFavorite(exercise.id);
  const [showLimitMessage, setShowLimitMessage] = useState(false);

  const handleFavoriteClick = () => {
    if (!favorited && isAtLimit) {
      setShowLimitMessage(true);
      setTimeout(() => setShowLimitMessage(false), 3000);
      return;
    }
    toggleFavorite(exercise.id, exercise.exerciseType);
  };

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
    const res = addToWeek(week, exercise.title, exercise.exerciseType);
    if (!res.ok) {
      const msg =
        res.reason === "duplicate"
          ? "This exercise is already in that session."
          : res.reason === "full"
          ? "That session already has 5 exercises."
          : "Could not add to that session.";
      alert(msg);
      return;
    }
    setShowWeeks(false);
  };

  return (
    <div className="bg-card border border-divider rounded-2xl shadow-md p-6 flex flex-col justify-between transition hover:shadow-lg">
      <div>
        <div className="flex items-start justify-between gap-2 mb-1">
          <h2 className="text-xl font-bold text-foreground">
            {exercise.title}
          </h2>
          {isAuthenticated && (
            <div className="relative">
              <button
                onClick={handleFavoriteClick}
                className="flex-shrink-0 p-1 -mt-1 rounded-full hover:bg-primary-light transition-colors"
                aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
              >
              {favorited ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 text-red-500"
                >
                  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-gray-400 hover:text-red-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
              )}
              </button>
              {showLimitMessage && (
                <div className="absolute right-0 top-full mt-1 z-50 w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-lg">
                  Favorites limit reached ({maxFavorites}). Upgrade for unlimited favorites.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Overview - full description, no truncation */}
        {overview && (
          <p className="text-foreground opacity-80 text-sm mb-4">
            {overview}
          </p>
        )}

        {/* Attribute chips - using individual fields with abbreviated labels */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {exercise.ageGroup && exercise.ageGroup !== "General / Unspecified" && (
            <span className="bg-primary-light text-primary-dark px-2 py-1 rounded text-xs font-medium">
              {abbreviateLabel(exercise.ageGroup)}
            </span>
          )}
          {exercise.decisionTheme && exercise.decisionTheme !== "General / Unspecified" && (
            <span className="bg-primary-light text-primary-dark px-2 py-1 rounded text-xs font-medium">
              {abbreviateLabel(exercise.decisionTheme)}
            </span>
          )}
          {exercise.gameMoment && exercise.gameMoment !== "General / Unspecified" && (
            <span className="bg-primary-light text-primary-dark px-2 py-1 rounded text-xs font-medium">
              {abbreviateLabel(exercise.gameMoment)}
            </span>
          )}
          {exercise.playerInvolvement && exercise.playerInvolvement !== "General / Unspecified" && (
            <span className="bg-primary-light text-primary-dark px-2 py-1 rounded text-xs font-medium">
              {abbreviateLabel(exercise.playerInvolvement)}
            </span>
          )}
          {exercise.difficulty && exercise.difficulty !== "General / Unspecified" && (
            <span className="bg-primary-light text-primary-dark px-2 py-1 rounded text-xs font-medium">
              {abbreviateLabel(exercise.difficulty)}
            </span>
          )}
        </div>
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
              <h3 className="text-base font-semibold text-foreground">Add to which session?</h3>
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
                  Session {w}
                </button>
              ))}
            </div>

            <div className="p-3 pt-0 text-xs text-gray-500">
              Tip: up to 5 exercises per session; duplicates are prevented.
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