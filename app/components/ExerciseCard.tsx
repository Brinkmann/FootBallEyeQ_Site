"use client";
import { useEffect, useRef, useState } from "react";
import { usePlanStore } from "../store/usePlanStore";
import { Exercise } from "../types/exercise";
import jsPDF from "jspdf";
import { db } from "@/Firebase/firebaseConfig"; // 👈 import your firebase config
import { collection, addDoc,  onSnapshot, query, where } from "firebase/firestore";

export default function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const [showWeeks, setShowWeeks] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const addToWeek = usePlanStore((s) => s.addToWeek);
  const overview = exercise.overview ?? "";
  const previewRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState("");
  const [feedback, setFeedback] = useState("");
  const [numStar, setNumStar] = useState(0);
  
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
  
  /**
   * Handle review submission
   */
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    //  if any field is empty, alert and return
    if ( !feedback || numStar <= 0) {
      alert("Please fill all fields and select a star rating.");
      return;
    }
    // Add review to Firestore
    try {
      await addDoc(collection(db, "reviews"), {
        exerciseN: exercise.title,
        numStar,
        feedback,
      });
      alert("Thank you for your review!");
      setFeedback("");
      setNumStar(0);
      setShowReviewForm(false);
    } catch (err) {
      console.error("Error adding review:", err);
      alert("Failed to add review. Try again.");
    }
  };
  // Function to generate and download PDF
  const handleDownloadPDF = async () => {
  const pdf = new jsPDF("p", "mm", "a4");
  let y = 10;
  // Title
  pdf.setFontSize(18);
  pdf.text(exercise.title, 10, y);
  y += 10;
  // Meta information
  pdf.setFontSize(12);
  pdf.text(`Age group: ${exercise.ageGroup}`, 10, y);
  y += 7;
  pdf.text(`Duration: ${exercise.duration}`, 10, y);
  y += 7;
  pdf.text(`Difficulty: ${exercise.difficulty}`, 10, y);
  y += 10;
  
  // Overview
  if (exercise.overview) {
    pdf.setFontSize(14);
    pdf.text("Overview:", 10, y);
    y += 7;
    pdf.setFontSize(12);
    pdf.text(pdf.splitTextToSize(exercise.overview, 180), 10, y);
    y += 15;
  }
  // Description
  if (exercise.description) {
    pdf.setFontSize(14);
    pdf.text("Description:", 10, y);
    y += 7;
    pdf.setFontSize(12);
    pdf.text(pdf.splitTextToSize(exercise.description, 180), 10, y);
    y += 15;
  }

  // Add Image if exists
  if (exercise.image) {
    // Load image
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = exercise.image;
      // Wait for image to load
      await new Promise((resolve, reject) => {
        img.onload = () => resolve(true);
        img.onerror = reject;
      });

      // Add a new page for the image
      pdf.addPage();

      // Scale image to fit PDF width
      const pdfWidth = 180;
      const aspect = img.height / img.width;
      const imgHeight = pdfWidth * aspect;

      pdf.addImage(img, "JPEG", 10, 10, pdfWidth, imgHeight);
    } catch (err) {
      console.error("Image load failed:", err);
    }
  }
  pdf.save(`${exercise.title}.pdf`);
};
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

      {/* Review form overlay - user can enter feedback and star rating for any exercise they want */}
      {showReviewForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setShowReviewForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            
            <h3 className="text-lg font-semibold mb-4 text-center">
              Review: {exercise.title}
            </h3>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
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
                <label className="block text-sm font-medium mb-1">
                  Feedback
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-800"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}

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
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowPreview(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-5x1 max-w-[calc(100%-3rem)] rounded-2xl bg-white dark:bg-gray-900 shadow-lg p-6">

            {/* Scrollable content */}
            <div ref={previewRef} className="max-h-[90vh] overflow-y-auto">
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
                    <p><span className="font-semibold">Decision theme:</span> {exercise.decisionTheme}</p>
                    <p><span className="font-semibold">Player involvement:</span> {exercise.playerInvolvement}</p>
                    <p><span className="font-semibold">Game moment simulated:</span> {exercise.gameMoment}</p>
                    <p><span className="font-semibold">Difficulty level:</span> {exercise.difficulty}</p>
                    <p><span className="font-semibold">Duration:</span> {exercise.duration}</p>
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
              </div><div className="mt-4 flex justify-end">
              <button
                onClick={handleDownloadPDF}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Download PDF
              </button>
            </div>
            </div>
          </div>
          
        </div>
        
      )}
    </div>
  );
}
