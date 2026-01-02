"use client";
import { useState } from "react";
import { Exercise } from "../types/exercise";
import { db } from "@/Firebase/firebaseConfig"; //  import your firebase config
import { collection, addDoc } from "firebase/firestore";

// Define the props our new component will accept
interface Props {
  exercise: Exercise;
  onClose: () => void;
}

export default function ExerciseReviewModal({ exercise, onClose }: Props) {
  const [feedback, setFeedback] = useState("");
  const [numStar, setNumStar] = useState(0);

  /**
   * Handle review submission
   */
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    //  if any field is empty, alert and return
    if (!feedback || numStar <= 0) {
      alert("Please fill all fields and select a star rating.");
      return;
    }
    // Add review to Firestore
    try {
      await addDoc(collection(db, "reviews"), {
        exerciseN: exercise.title,
        exerciseType: exercise.exerciseType || "eyeq",
        numStar,
        feedback,
      });
      alert("Thank you for your review!");
      setFeedback("");
      setNumStar(0);
      onClose(); // Use the onClose prop
    } catch (err) {
      console.error("Error adding review:", err);
      alert("Failed to add review. Try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-card rounded-2xl p-6 shadow-lg w-full max-w-md relative border border-divider">
        <button
          onClick={onClose} // Use the onClose prop
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h3 className="text-lg font-semibold mb-4 text-center text-foreground">
          Review: {exercise.title}
        </h3>

        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">
              Star Rating
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNumStar(star)}
                  className={`text-2xl ${
                    star <= numStar
                      ? "text-yellow-400"
                      : "text-gray-400 hover:text-yellow-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">
              Feedback
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
              className="w-full border border-divider rounded-lg px-3 py-2 bg-background text-foreground"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-button rounded-lg py-2 bg-primary-hover transition"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
}