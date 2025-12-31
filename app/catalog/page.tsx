"use client";

import { useEffect, useState } from "react";
import { Exercise } from "../types/exercise";

export default function CatalogPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("CatalogPage mounted - starting fetch");

    async function loadDrills() {
      try {
        console.log("Fetching from /api/exercises");
        const response = await fetch("/api/exercises");
        console.log("Response status:", response.status);

        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }

        const data = await response.json();
        console.log("Received data:", data);

        if (data?.exercises && Array.isArray(data.exercises)) {
          console.log("Setting exercises:", data.exercises.length);
          setExercises(data.exercises);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err instanceof Error ? err.message : "Failed to load drills");
      } finally {
        setIsLoading(false);
      }
    }

    loadDrills();
  }, []);

  console.log("Render - isLoading:", isLoading, "exercises:", exercises.length, "error:", error);

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-3xl font-bold mb-8">Drill Catalogue (Minimal)</h1>

      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading drills...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {!isLoading && !error && exercises.length === 0 && (
        <p className="text-center text-gray-600">No drills found</p>
      )}

      {!isLoading && exercises.length > 0 && (
        <div>
          <p className="mb-4 text-lg">Found {exercises.length} drills</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exercises.map((exercise) => (
              <div key={exercise.id} className="border rounded-lg p-4 bg-white shadow">
                <h3 className="font-bold text-lg mb-2">{exercise.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{exercise.overview}</p>
                <div className="text-xs text-gray-500">
                  <p>Type: {exercise.exerciseType}</p>
                  <p>Difficulty: {exercise.difficulty}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
