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
import { useExerciseType } from "../components/ExerciseTypeProvider";
import Link from "next/link";

export default function CatalogPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [initialFavorites, setInitialFavorites] = useState<Set<string> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  const { favorites, isAuthenticated, loading: favoritesLoading, hasHydrated: favoritesHydrated, favoritesCountForType } = useFavoritesContext();
  const { selectedExerciseType } = useExerciseType();
  const [plasticBannerDismissed, setPlasticBannerDismissed] = useState(false);
  const [showEyeQTooltip, setShowEyeQTooltip] = useState(false);

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

  const fetchExercises = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const res = await fetch("/api/exercises");
      if (res.ok) {
        const data = await res.json();
        if (data.exercises && data.exercises.length > 0) {
          setExercises(data.exercises);
          return;
        }
      }
      
      const exercisesCol = collection(db, "exercises");
      const snapshot = await getDocs(exercisesCol);

      const getExerciseNumber = (title: string): number => {
        const match = title.match(/^(\d+)/);
        return match ? parseInt(match[1], 10) : 9999;
      };

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
          exerciseBreakdownDesc: data.exerciseBreakdownDesc || "",
          image: data.image || null,
          exerciseType: data.exerciseType || "eyeq",
        };
      });

      exercisesList.sort((a, b) => getExerciseNumber(a.title) - getExerciseNumber(b.title));
      setExercises(exercisesList);
    } catch (error) {
      console.error("Error fetching exercises:", error);
      setLoadError("We couldn't load drills right now. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  // Capture initial favorites snapshot once when page loads (after both exercises AND favorites are loaded)
  // This prevents reordering when user favorites/unfavorites during the session
  useEffect(() => {
    if (initialFavorites === null && exercises.length > 0 && !favoritesLoading) {
      setInitialFavorites(new Set(favorites));
    }
  }, [exercises.length, favorites, initialFavorites, favoritesLoading]);

  const normalizeDash = (str: string) => str.replace(/–/g, "-");

  // Exercises filtered by exerciseType only (before other filters/search)
  const exercisesForCurrentType = useMemo(() => {
    return exercises.filter(ex => ex.exerciseType === selectedExerciseType);
  }, [exercises, selectedExerciseType]);

  const exerciseTypeBaseCount = exercisesForCurrentType.length;

  const filteredExercises = useMemo(() => {
    let filtered = exercises.filter(ex => ex.exerciseType === selectedExerciseType);

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

    // Use initialFavorites (snapshot from page load) for ordering
    // This prevents exercises from jumping around when user favorites/unfavorites
    const orderingFavorites = initialFavorites ?? favorites;
    const hasFavorites = orderingFavorites.size > 0 && !showFavoritesOnly;
    if (hasFavorites) {
      const favs = filtered.filter(ex => orderingFavorites.has(ex.id));
      const nonFavs = filtered.filter(ex => !orderingFavorites.has(ex.id));
      return [...favs, ...nonFavs];
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
    selectedExerciseType,
    initialFavorites,
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
          {/* Plastic cone banner for logged-out users viewing EyeQ drills */}
          {!isAuthenticated && selectedExerciseType === "eyeq" && !plasticBannerDismissed && (
            <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex items-center justify-between gap-3">
              <p className="text-sm text-blue-800">
                For plastic cone drills,{" "}
                <Link href="/login" className="font-medium underline hover:text-blue-900">
                  sign in
                </Link>{" "}
                to access our full library.
              </p>
              <button
                onClick={() => setPlasticBannerDismissed(true)}
                className="text-blue-600 hover:text-blue-800 p-1 flex-shrink-0"
                aria-label="Dismiss"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Drill Catalogue</h1>
              {selectedExerciseType === "eyeq" && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowEyeQTooltip(!showEyeQTooltip)}
                    onMouseEnter={() => setShowEyeQTooltip(true)}
                    onMouseLeave={() => setShowEyeQTooltip(false)}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 cursor-help"
                    aria-describedby="eyeq-tooltip"
                  >
                    EyeQ Drills
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 opacity-60">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                    </svg>
                  </button>
                  {showEyeQTooltip && (
                    <div 
                      id="eyeq-tooltip"
                      role="tooltip"
                      className="absolute left-0 top-full mt-2 w-56 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-50"
                    >
                      These drills require EyeQ LED smart cones for the visual cues and decision triggers.
                      <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  )}
                </div>
              )}
              {selectedExerciseType === "plastic" && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700 border border-orange-200">
                  Plastic Cones
                </span>
              )}
            </div>
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
                totalCount={exerciseTypeBaseCount}
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
                  <span className="hidden sm:inline">{favoritesCountForType}</span>
                </button>
              )}
              <FacetedFilters
                exercises={exercisesForCurrentType}
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
            {(isLoading || !favoritesHydrated) ? (
              <div className="col-span-full text-center py-12">
                <div className="flex justify-center mb-3">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                </div>
                <p className="text-foreground">Loading drills...</p>
                <p className="text-sm text-foreground opacity-60">Hang tight while we fetch the latest catalog.</p>
              </div>
            ) : loadError ? (
              <div className="col-span-full bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <div className="text-6xl mb-4">🚧</div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">We hit a snag loading drills</h3>
                <p className="text-red-700 opacity-80 mb-4">
                  {loadError}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={fetchExercises}
                    className="px-4 py-2 bg-primary text-button rounded-lg hover:bg-primary-hover transition-colors"
                  >
                    Retry loading drills
                  </button>
                  <a
                    href="/contact"
                    className="px-4 py-2 border border-red-200 text-red-800 rounded-lg hover:bg-white/70"
                  >
                    Contact support
                  </a>
                </div>
              </div>
            ) : filteredExercises.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No drills match your search</h3>
                <p className="text-foreground opacity-60 mb-4">
                  Adjust your filters or try broader keywords. You can also start over with the full catalog.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-primary text-button rounded-lg hover:bg-primary-hover transition-colors"
                  >
                    Clear all filters
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="px-4 py-2 border border-gray-200 text-foreground rounded-lg hover:bg-card"
                  >
                    View all drills
                  </button>
                </div>
                <ul className="mt-6 text-sm text-left max-w-xl mx-auto text-foreground opacity-80 space-y-2">
                  <li>• Remove multiple filters to widen results.</li>
                  <li>• Search for a skill (e.g., &quot;dribble&quot;, &quot;finishing&quot;).</li>
                  <li>• Switch to another practice format to explore alternatives.</li>
                </ul>
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
