"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import ExerciseCard from "../components/ExerciseCard";
import NavBar from "../components/Navbar";
import { db } from "../../Firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Exercise } from "../types/exercise";
import SmartSearch from "../components/SmartSearch";
import FacetedFilters from "../components/FacetedFilters";
import ActiveFilters from "../components/ActiveFilters";
import { useFavoritesContext } from "../components/FavoritesProvider";

export default function CatalogPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  
  const { favorites, isAuthenticated } = useFavoritesContext();

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
            difficulty: data.difficulty || "Unknown",
            practiceFormat: data.practiceFormat || "General / Mixed",
            overview: data.overview || "",
            description: data.description || "",
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
      const searchTerms = searchQuery.toLowerCase().split(/\s+/).filter(term => term.length > 0);
      
      filtered = filtered.filter((ex) => {
        const searchableText = [
          ex.title,
          ex.overview,
          ex.description,
          ex.ageGroup,
          ex.difficulty,
          ex.decisionTheme,
          ex.playerInvolvement,
          ex.gameMoment,
          ex.practiceFormat
        ].join(" ").toLowerCase();
        
        return searchTerms.every(term => searchableText.includes(term));
      });
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
      filtered = filtered.filter((ex) => normalizeDash(ex.practiceFormat) === normalizedFilter);
    }

    if (showFavoritesOnly) {
      filtered = filtered.filter((ex) => favorites.has(ex.id));
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
    showFavoritesOnly,
    favorites,
  ]);

  const resetFilters = () => {
    setSelectedAgeGroup(defaultAgeGroup);
    setSelectedDecisionTheme(defaultDecisionTheme);
    setSelectedPlayerInvolvement(defaultPlayerInvolvement);
    setSelectedGameMoment(defaultGameMoment);
    setSelectedDifficulty(defaultDifficulty);
    setSelectedPracticeFormat(defaultPracticeFormat);
    setSearchQuery("");
    setShowFavoritesOnly(false);
  };

  const handleFilterSelect = useCallback((type: string, value: string) => {
    switch (type) {
      case "ageGroup":
        setSelectedAgeGroup(value);
        break;
      case "difficulty":
        setSelectedDifficulty(value);
        break;
      case "practiceFormat":
        const matchingFormat = practiceFormats.find(f => f.includes(value) || value.includes(f.split("/")[0].trim()));
        if (matchingFormat) {
          setSelectedPracticeFormat(matchingFormat);
        }
        break;
      case "decisionTheme":
        setSelectedDecisionTheme(value);
        break;
      case "playerInvolvement":
        setSelectedPlayerInvolvement(value);
        break;
      case "gameMoment":
        setSelectedGameMoment(value);
        break;
    }
  }, [practiceFormats]);

  const handleFacetedFilterChange = useCallback((key: string, value: string) => {
    switch (key) {
      case "ageGroup":
        setSelectedAgeGroup(value);
        break;
      case "difficulty":
        setSelectedDifficulty(value);
        break;
      case "practiceFormat":
        setSelectedPracticeFormat(value);
        break;
      case "decisionTheme":
        setSelectedDecisionTheme(value);
        break;
      case "playerInvolvement":
        setSelectedPlayerInvolvement(value);
        break;
      case "gameMoment":
        setSelectedGameMoment(value);
        break;
    }
  }, []);

  const activeFilters = useMemo(() => {
    const filters = [];
    if (showFavoritesOnly) {
      filters.push({
        key: "favorites",
        label: "",
        value: "Favorites",
        onRemove: () => setShowFavoritesOnly(false)
      });
    }
    if (selectedAgeGroup !== defaultAgeGroup) {
      filters.push({
        key: "ageGroup",
        label: "Age",
        value: selectedAgeGroup.replace(/\s*Phase\s*/gi, " ").trim(),
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
        value: selectedPracticeFormat.split("/")[0].trim(),
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
  }, [showFavoritesOnly, selectedAgeGroup, selectedDifficulty, selectedPracticeFormat, selectedDecisionTheme, selectedPlayerInvolvement, selectedGameMoment]);

  const activeFilterCount = activeFilters.length;

  const facetedFiltersConfig = useMemo(() => [
    {
      key: "ageGroup",
      label: "Age Group",
      options: ageGroups,
      defaultValue: defaultAgeGroup,
      getValue: (ex: Exercise) => ex.ageGroup,
    },
    {
      key: "difficulty",
      label: "Difficulty",
      options: difficulties,
      defaultValue: defaultDifficulty,
      getValue: (ex: Exercise) => ex.difficulty,
    },
    {
      key: "practiceFormat",
      label: "Practice Format",
      options: practiceFormats,
      defaultValue: defaultPracticeFormat,
      getValue: (ex: Exercise) => ex.practiceFormat,
    },
    {
      key: "decisionTheme",
      label: "Decision Theme",
      options: decisionThemes,
      defaultValue: defaultDecisionTheme,
      getValue: (ex: Exercise) => ex.decisionTheme,
    },
    {
      key: "playerInvolvement",
      label: "Player Involvement",
      options: playerInvolvements,
      defaultValue: defaultPlayerInvolvement,
      getValue: (ex: Exercise) => ex.playerInvolvement,
    },
    {
      key: "gameMoment",
      label: "Game Moment",
      options: gameMoments,
      defaultValue: defaultGameMoment,
      getValue: (ex: Exercise) => ex.gameMoment,
    },
  ], []);

  const selectedFilters = useMemo(() => ({
    ageGroup: selectedAgeGroup,
    difficulty: selectedDifficulty,
    practiceFormat: selectedPracticeFormat,
    decisionTheme: selectedDecisionTheme,
    playerInvolvement: selectedPlayerInvolvement,
    gameMoment: selectedGameMoment,
  }), [selectedAgeGroup, selectedDifficulty, selectedPracticeFormat, selectedDecisionTheme, selectedPlayerInvolvement, selectedGameMoment]);

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <div className="px-4 sm:px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">Drill Catalogue</h1>
            <p className="text-foreground opacity-60 text-sm">Find the perfect drill for your training session</p>
          </div>

          <div className="flex gap-3 items-start mb-4">
            <div className="flex-1">
              <SmartSearch
                value={searchQuery}
                onChange={setSearchQuery}
                exercises={exercises}
                onFilterSelect={handleFilterSelect}
                placeholder="Search or type to filter..."
                resultCount={filteredExercises.length}
                totalCount={exercises.length}
              />
            </div>
            <div className="flex-shrink-0 flex gap-2 pt-0">
              {isAuthenticated && (
                <button
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all duration-200 text-sm font-medium
                    ${showFavoritesOnly 
                      ? "border-red-400 bg-red-50 text-red-600" 
                      : "border-divider bg-card text-foreground hover:border-red-300 hover:bg-red-50"
                    }`}
                  aria-label={showFavoritesOnly ? "Show all drills" : "Show favorites only"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={showFavoritesOnly ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth={showFavoritesOnly ? 0 : 1.5}
                    className="w-5 h-5"
                  >
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                  </svg>
                  <span className="hidden sm:inline">{favorites.size}</span>
                </button>
              )}
              <FacetedFilters
                exercises={exercises}
                filters={facetedFiltersConfig}
                selectedFilters={selectedFilters}
                onFilterChange={handleFacetedFilterChange}
                onClearAll={resetFilters}
                activeCount={activeFilterCount}
              />
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
