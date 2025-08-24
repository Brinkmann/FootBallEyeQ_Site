"use client";

import { useEffect, useState } from "react";
import ExerciseCard from "../components/ExerciseCard";
import NavBar from "../components/Navbar";
import { db } from "../../Firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

interface Exercise {
  id: string;
  title: string;
  ageGroup: string;
  duration: string;
  difficulty: string;
  description: string;
  tags: string[];
}

export default function CatalogPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedPurpose, setSelectedPurpose] = useState("All");

  useEffect(() => {
    async function fetchFilteredExercises() {
      try {
        const exercisesCol = collection(db, "exercises");

        const activeTags = [];

        if (selectedAgeGroup !== "All") activeTags.push(selectedAgeGroup);
        if (selectedDifficulty !== "All") activeTags.push(selectedDifficulty);
        if (selectedPurpose !== "All") activeTags.push(selectedPurpose);

        let q;

        if (activeTags.length > 0) {
          q = query(
            exercisesCol,
            where("tags", "array-contains-any", activeTags)
          );
        } else {
          q = query(exercisesCol);
        }

        const snapshot = await getDocs(q);

        const exercisesList = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || "No title",
            ageGroup: data.ageGroup || "N/A",
            duration: data.duration || "Unknown",
            difficulty: data.difficulty || "Unknown",
            description: data.description || "",
            tags: data.tags || [],
          };
        });

        const strictlyFiltered = exercisesList.filter((exercise) => {
          return (
            (selectedAgeGroup === "All" || exercise.tags.includes(selectedAgeGroup)) &&
            (selectedDifficulty === "All" || exercise.tags.includes(selectedDifficulty)) &&
            (selectedPurpose === "All" || exercise.tags.includes(selectedPurpose))
          );
        });
        
        setExercises(strictlyFiltered);
      } catch (error) {
        console.error("Error fetching filtered exercises:", error);
      }
    }

    fetchFilteredExercises();
  }, [selectedAgeGroup, selectedDifficulty, selectedPurpose]);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="px-6 py-8">
        {/* Filters */}
        <div className="flex space-x-4 mb-8">
          <select 
            value={selectedAgeGroup}
            onChange={(e) => setSelectedAgeGroup(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
          >
            <option value="All">All Age Groups</option>
            <option value="U10">U10</option>
            <option value="U12">U12</option>
            <option value="U14">U14</option>
          </select>

          <select 
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
          >
            <option value="All">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <select 
            value={selectedPurpose}
            onChange={(e) => setSelectedPurpose(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
          >
            <option value="All">All Purposes</option>
            <option value="Passing">Passing</option>
            <option value="Dribbling">Dribbling</option>
            <option value="Shooting">Shooting</option>
          </select>
        </div>

        {/* Exercise Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.length === 0 ? (
            <p>No exercises found.</p>
          ) : (
            exercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
