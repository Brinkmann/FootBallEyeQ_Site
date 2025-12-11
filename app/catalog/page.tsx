"use client";

import { useEffect, useState } from "react";
import ExerciseCard from "../components/ExerciseCard";
import NavBar from "../components/Navbar";
import { db } from "../../Firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Exercise } from "../types/exercise";

export default function CatalogPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);

  // Filters
  const defaultAgeGroup = "All Age Groups";
  const defaultDecisionTheme = "All Decision Themes";
  const defaultPlayerInvolvement = "All Player Involvements";
  const defaultGameMoment = "All Game Moments";
  const defaultDifficulty = "All Difficulty Levels";
  const defaultPracticeFormat = "All Practice Formats";

  const [selectedAgeGroup, setSelectedAgeGroup] = useState(defaultAgeGroup);
  const [selectedDecisionTheme, setSelectedDecisionTheme] = useState(defaultDecisionTheme);
  const [selectedPlayerInvolvement, setSelectedPlayerInvolvement] = useState(defaultPlayerInvolvement);
  const [selectedGameMoment, setSelectedGameMoment] = useState(defaultGameMoment);
  const [selectedDifficulty, setSelectedDifficulty] = useState(defaultDifficulty);
  const [selectedPracticeFormat, setSelectedPracticeFormat] = useState(defaultPracticeFormat);

  const ageGroups = [
    "All Age Groups",
    "General / Unspecified",
    "Foundation Phase (U7-U10)",
    "Youth Development Phase (U11-U14)",
    "Game Training Phase (U15-U18)",
    "Performance Phase (U19-Senior)"
  ];

  const decisionThemes = [
    "All Decision Themes",
    "General / Unspecified",
    "Pass or Dribble",
    "Attack or Hold",
    "Shoot or Pass"
  ];

  const playerInvolvements = [
    "All Player Involvements",
    "General / Unspecified",
    "Individual",
    "1v1 / 2v2",
    "Small Group (3-4 players)",
    "Team Unit (5+ players)"
  ];

  const gameMoments = [
    "All Game Moments",
    "General / Unspecified",
    "Build-Up",
    "Final Third Decision",
    "Defensive Shape",
    "Counter Attack",
    "Transition (Attack to Defend)",
    "Switch of Play"
  ];

  const difficulties = [
    "All Difficulty Levels",
    "General / Unspecified",
    "Basic",
    "Moderate",
    "Advanced",
    "Elite"
  ];

  const practiceFormats = [
    "All Practice Formats",
    "Warm-Up / Ball Mastery",
    "Fun Game / Physical",
    "Finishing / Shooting Pattern",
    "Positional Possession Game",
    "Rondo / Tight Possession",
    "Directional Small-Sided Game",
    "General / Mixed",
  ];

  useEffect(() => {
    async function fetchExercises() {
      try {
        const exercisesCol = collection(db, "exercises");
        const snapshot = await getDocs(exercisesCol);

        const exercisesList: Exercise[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || "No title",
            ageGroup: data.ageGroup || "N/A",
            decisionTheme: data.decisionTheme || "N/A",
            playerInvolvement: data.playerInvolvement || "N/A",
            gameMoment: data.gameMoment || "N/A",
            duration: data.duration || "Unknown",
            difficulty: data.difficulty || "Unknown",
            overview: data.overview || "",
            description: data.description || "",
            tags: data.tags || [],
            image: data.image || null,
          };
        });

        setExercises(exercisesList);
        setFilteredExercises(exercisesList);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
    }

    fetchExercises();
  }, []);

  const normalizeDash = (str: string) => str.replace(/–/g, "-");

  useEffect(() => {
    let filtered = [...exercises];

    if (selectedAgeGroup !== "All Age Groups") {
      const normalizedFilter = normalizeDash(selectedAgeGroup);
      filtered = filtered.filter((ex) => normalizeDash(ex.ageGroup) === normalizedFilter);
    }
    if (selectedDecisionTheme !== "All Decision Themes") {
      const normalizedFilter = normalizeDash(selectedDecisionTheme);
      filtered = filtered.filter((ex) => normalizeDash(ex.decisionTheme) === normalizedFilter);
    }
    if (selectedPlayerInvolvement !== "All Player Involvements") {
      const normalizedFilter = normalizeDash(selectedPlayerInvolvement);
      filtered = filtered.filter((ex) => normalizeDash(ex.playerInvolvement) === normalizedFilter);
    }
    if (selectedGameMoment !== "All Game Moments") {
      const normalizedFilter = normalizeDash(selectedGameMoment);
      filtered = filtered.filter((ex) => normalizeDash(ex.gameMoment) === normalizedFilter);
    }
    if (selectedDifficulty !== "All Difficulty Levels") {
      const normalizedFilter = normalizeDash(selectedDifficulty);
      filtered = filtered.filter((ex) => normalizeDash(ex.difficulty) === normalizedFilter);
    }
    if (selectedPracticeFormat !== "All Practice Formats") {
      const normalizedFilter = normalizeDash(selectedPracticeFormat);
      filtered = filtered.filter((ex) => 
        ex.tags?.some((tag) => normalizeDash(tag) === normalizedFilter)
      );
    }

    setFilteredExercises(filtered);
  }, [
    selectedAgeGroup,
    selectedDecisionTheme,
    selectedPlayerInvolvement,
    selectedGameMoment,
    selectedDifficulty,
    selectedPracticeFormat,
    exercises,
  ]);

  const resetFilters = () => {
    setSelectedAgeGroup(defaultAgeGroup);
    setSelectedDecisionTheme(defaultDecisionTheme);
    setSelectedPlayerInvolvement(defaultPlayerInvolvement);
    setSelectedGameMoment(defaultGameMoment);
    setSelectedDifficulty(defaultDifficulty);
    setSelectedPracticeFormat(defaultPracticeFormat);
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <div className="px-6 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <select 
            value={selectedAgeGroup}
            onChange={(e) => setSelectedAgeGroup(e.target.value)}
            className="px-3 py-2 rounded-lg border border-divider bg-card text-sm text-foreground"
          >
            {ageGroups.map((g) => (
              <option key={`age-${g}`} value={g}>{g}</option>
            ))}
          </select>

          <select 
            value={selectedDecisionTheme}
            onChange={(e) => setSelectedDecisionTheme(e.target.value)}
            className="px-3 py-2 rounded-lg border border-divider bg-card text-sm text-foreground"
          >
            {decisionThemes.map((d) => (
              <option key={`decision-${d}`} value={d}>{d}</option>
            ))}
          </select>

          <select 
            value={selectedPlayerInvolvement}
            onChange={(e) => setSelectedPlayerInvolvement(e.target.value)}
            className="px-3 py-2 rounded-lg border border-divider bg-card text-sm text-foreground"
          >
            {playerInvolvements.map((p) => (
              <option key={`player-${p}`} value={p}>{p}</option>
            ))}
          </select>

          <select 
            value={selectedGameMoment}
            onChange={(e) => setSelectedGameMoment(e.target.value)}
            className="px-3 py-2 rounded-lg border border-divider bg-card text-sm text-foreground"
          >
            {gameMoments.map((gm) => (
              <option key={`moment-${gm}`} value={gm}>{gm}</option>
            ))}
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 rounded-lg border border-divider bg-card text-sm text-foreground"
          >
            {difficulties.map((d) => (
              <option key={`difficulty-${d}`} value={d}>{d}</option>
            ))}
          </select>

          <select
            value={selectedPracticeFormat}
            onChange={(e) => setSelectedPracticeFormat(e.target.value)}
            className="px-3 py-2 rounded-lg border border-divider bg-card text-sm text-foreground"
          >
            {practiceFormats.map((pf) => (
              <option key={`practice-${pf}`} value={pf}>{pf}</option>
            ))}
          </select>

          <button
            type="button"
            onClick={resetFilters}
            className="px-3 py-2 rounded-lg border border-divider bg-card text-sm text-foreground hover:bg-muted transition-colors"
          >
            Clear all filters
          </button>
        </div>

        {/* Exercise Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.length === 0 ? (
            <p>No exercises found.</p>
          ) : (
            filteredExercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}