"use client";

import { useEffect, useState, useMemo } from "react";
import ExerciseCard from "../components/ExerciseCard";
import NavBar from "../components/Navbar";
import { db } from "../../Firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Exercise } from "../types/exercise";
import { FilterChipGroup } from "../components/FilterChip";
import ActiveFilters from "../components/ActiveFilters";
import SearchBar from "../components/SearchBar";
import AdvancedFilters from "../components/AdvancedFilters";

export default function CatalogPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

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
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
    }

    fetchExercises();
  }, []);

  const normalizeDash = (str: string) => str.replace(/–/g, "-");

  const filteredExercises = useMemo(() => {
    let filtered = [...exercises];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((ex) => 
        ex.title.toLowerCase().includes(query) ||
        ex.overview.toLowerCase().includes(query) ||
        ex.description.toLowerCase().includes(query) ||
        ex.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    if (selectedAgeGroup !== defaultAgeGroup) {
      const normalizedFilter = normalizeDash(selectedAgeGroup);
      filtered = filtered.filter((ex) => normalizeDash(ex.ageGroup) === normalizedFilter);
    }
    if (selectedDecisionTheme !== defaultDecisionTheme) {
      const normalizedFilter = normalizeDash(selectedDecisionTheme);
      filtered = filtered.filter((ex) => normalizeDash(ex.decisionTheme) === normalizedFilter);
    }
    if (selectedPlayerInvolvement !== defaultPlayerInvolvement) {
      const normalizedFilter = normalizeDash(selectedPlayerInvolvement);
      filtered = filtered.filter((ex) => normalizeDash(ex.playerInvolvement) === normalizedFilter);
    }
    if (selectedGameMoment !== defaultGameMoment) {
      const normalizedFilter = normalizeDash(selectedGameMoment);
      filtered = filtered.filter((ex) => normalizeDash(ex.gameMoment) === normalizedFilter);
    }
    if (selectedDifficulty !== defaultDifficulty) {
      const normalizedFilter = normalizeDash(selectedDifficulty);
      filtered = filtered.filter((ex) => normalizeDash(ex.difficulty) === normalizedFilter);
    }
    if (selectedPracticeFormat !== defaultPracticeFormat) {
      const normalizedFilter = normalizeDash(selectedPracticeFormat);
      filtered = filtered.filter((ex) => 
        ex.tags?.some((tag) => normalizeDash(tag) === normalizedFilter)
      );
    }

    return filtered;
  }, [
    searchQuery,
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
    setSearchQuery("");
  };

  const activeFilters = useMemo(() => {
    const filters = [];
    if (selectedAgeGroup !== defaultAgeGroup) {
      filters.push({
        key: "ageGroup",
        label: "Age",
        value: selectedAgeGroup.replace(/\s*\(.*?\)/g, ""),
        onRemove: () => setSelectedAgeGroup(defaultAgeGroup)
      });
    }
    if (selectedDifficulty !== defaultDifficulty) {
      filters.push({
        key: "difficulty",
        label: "Level",
        value: selectedDifficulty,
        onRemove: () => setSelectedDifficulty(defaultDifficulty)
      });
    }
    if (selectedPracticeFormat !== defaultPracticeFormat) {
      filters.push({
        key: "practiceFormat",
        label: "Format",
        value: selectedPracticeFormat.replace(/\s*\/.*$/g, ""),
        onRemove: () => setSelectedPracticeFormat(defaultPracticeFormat)
      });
    }
    if (selectedDecisionTheme !== defaultDecisionTheme) {
      filters.push({
        key: "decisionTheme",
        label: "Decision",
        value: selectedDecisionTheme,
        onRemove: () => setSelectedDecisionTheme(defaultDecisionTheme)
      });
    }
    if (selectedPlayerInvolvement !== defaultPlayerInvolvement) {
      filters.push({
        key: "playerInvolvement",
        label: "Players",
        value: selectedPlayerInvolvement.replace(/\s*\(.*?\)/g, ""),
        onRemove: () => setSelectedPlayerInvolvement(defaultPlayerInvolvement)
      });
    }
    if (selectedGameMoment !== defaultGameMoment) {
      filters.push({
        key: "gameMoment",
        label: "Moment",
        value: selectedGameMoment,
        onRemove: () => setSelectedGameMoment(defaultGameMoment)
      });
    }
    return filters;
  }, [selectedAgeGroup, selectedDifficulty, selectedPracticeFormat, selectedDecisionTheme, selectedPlayerInvolvement, selectedGameMoment]);

  const advancedFilterCount = useMemo(() => {
    let count = 0;
    if (selectedDecisionTheme !== defaultDecisionTheme) count++;
    if (selectedPlayerInvolvement !== defaultPlayerInvolvement) count++;
    if (selectedGameMoment !== defaultGameMoment) count++;
    return count;
  }, [selectedDecisionTheme, selectedPlayerInvolvement, selectedGameMoment]);

  const advancedFiltersConfig = [
    {
      key: "decisionTheme",
      label: "Decision Theme",
      options: decisionThemes,
      value: selectedDecisionTheme,
      defaultValue: defaultDecisionTheme,
      onChange: setSelectedDecisionTheme
    },
    {
      key: "playerInvolvement",
      label: "Player Involvement",
      options: playerInvolvements,
      value: selectedPlayerInvolvement,
      defaultValue: defaultPlayerInvolvement,
      onChange: setSelectedPlayerInvolvement
    },
    {
      key: "gameMoment",
      label: "Game Moment",
      options: gameMoments,
      value: selectedGameMoment,
      defaultValue: defaultGameMoment,
      onChange: setSelectedGameMoment
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <div className="px-4 sm:px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Drill Catalogue</h1>
            <p className="text-foreground opacity-60">Find the perfect drill for your training session</p>
          </div>

          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search drills by name, tags, or description..."
            resultCount={filteredExercises.length}
            totalCount={exercises.length}
          />

          <div className="mb-6">
            <FilterChipGroup
              title="Age Group"
              options={ageGroups}
              selected={selectedAgeGroup}
              defaultValue={defaultAgeGroup}
              onChange={setSelectedAgeGroup}
            />

            <FilterChipGroup
              title="Difficulty"
              options={difficulties}
              selected={selectedDifficulty}
              defaultValue={defaultDifficulty}
              onChange={setSelectedDifficulty}
            />

            <div className="flex items-center gap-4 flex-wrap">
              <FilterChipGroup
                title="Practice Format"
                options={practiceFormats}
                selected={selectedPracticeFormat}
                defaultValue={defaultPracticeFormat}
                onChange={setSelectedPracticeFormat}
              />
              
              <div className="mt-6">
                <AdvancedFilters 
                  filters={advancedFiltersConfig}
                  activeCount={advancedFilterCount}
                />
              </div>
            </div>
          </div>

          <ActiveFilters 
            filters={activeFilters}
            onClearAll={resetFilters}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExercises.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No drills found</h3>
                <p className="text-foreground opacity-60 mb-4">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-primary text-button rounded-lg hover:bg-primary-hover transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              filteredExercises.map((exercise) => (
                <ExerciseCard key={exercise.id} exercise={exercise} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
