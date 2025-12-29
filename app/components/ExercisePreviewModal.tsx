"use client";
import { useRef } from "react";
import { Exercise } from "../types/exercise";
import jsPDF from "jspdf";
import LazyMedia from "./LazyMedia";

// Define the props our new component will accept
interface Props {
  exercise: Exercise;
  onClose: () => void;
}

export default function ExercisePreviewModal({ exercise, onClose }: Props) {
  const previewRef = useRef<HTMLDivElement>(null);

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
    pdf.text(`Difficulty: ${exercise.difficulty}`, 10, y);
    y += 7;
    pdf.text(`Decision Theme: ${exercise.decisionTheme}`, 10, y);
    y += 7;
    pdf.text(`Player Involvement: ${exercise.playerInvolvement}`, 10, y);
    y += 7;
    pdf.text(`Game Moment: ${exercise.gameMoment}`, 10, y);
    y += 7;
    pdf.text(`Practice Format: ${exercise.practiceFormat}`, 10, y);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose} // Use the onClose prop
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-5x1 max-w-[calc(100%-3rem)] rounded-2xl bg-card shadow-lg p-6 border border-divider">

        {/* Scrollable content */}
        <div ref={previewRef} className="max-h-[90vh] overflow-y-auto">
          {/* Image on left, text on right */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Image */}
            {exercise.image && (
              <div className="flex-shrink-0 md:w-1/3">
                <LazyMedia
                  src={exercise.image}
                  alt={exercise.title}
                  className="object-cover rounded-lg border border-divider"
                  wrapperClassName="w-full"
                />
              </div>
            )}

            {/* Details */}
            <div className="flex-1">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-divider pb-2 mb-4">
                <h3 className="text-lg font-bold text-foreground">{exercise.title}</h3>
                <button
                  onClick={onClose} // Use the onClose prop
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {/* Details section */}
              <div className="space-y-2 mb-6 text-sm text-foreground">
                <p><span className="font-semibold">Age group:</span> {exercise.ageGroup}</p>
                <p><span className="font-semibold">Decision theme:</span> {exercise.decisionTheme}</p>
                <p><span className="font-semibold">Player involvement:</span> {exercise.playerInvolvement}</p>
                <p><span className="font-semibold">Game moment simulated:</span> {exercise.gameMoment}</p>
                <p><span className="font-semibold">Difficulty level:</span> {exercise.difficulty}</p>
                <p><span className="font-semibold">Practice format:</span> {exercise.practiceFormat}</p>
              </div>

              <hr className="border-divider mb-4" />

              {/* Overview */}
              {exercise.overview && (
                <>
                  <h4 className="text-md font-semibold mb-2 text-foreground">Overview</h4>
                  <p className="text-sm text-gray-500 mb-4 whitespace-pre-line">
                    {exercise.overview}
                  </p>
                </>
              )}

              <hr className="border-divider mb-4" />

              {/* Description */}
              {exercise.description && (
                <>
                  <h4 className="text-md font-semibold mb-2 text-foreground">Description</h4>
                  <p className="text-sm text-gray-500 whitespace-pre-line">
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
  );
}