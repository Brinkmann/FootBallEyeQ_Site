"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import ExerciseCard from "../components/ExerciseCard";
import NavBar from "../components/Navbar";
import { Exercise } from "../types/exercise";
import SmartSearch from "../components/SmartSearch";
import FacetedFilters from "../components/FacetedFilters";
import ActiveFilters from "../components/ActiveFilters";
import { useFavoritesContext } from "../components/FavoritesProvider";
import { useExerciseType } from "../components/ExerciseTypeProvider";
import Link from "next/link";

// Module-level flag: true if catalog has been visited this session (persists across SPA navigations)
let catalogVisitedThisSession = false;

export default function CatalogPage() {
  const [mounted, setMounted] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [initialFavorites, setInitialFavorites] = useState<Set<string> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  const { favorites, isAuthenticated, loading: favoritesLoading, hasHydrated: favoritesHydrated, favoritesCountForType } = useFavoritesContext();
  const { selectedExerciseType } = useExerciseType();
  
  // Ensure client-side mounting completes before fetching
  useEffect(() => {
    setMounted(true);
  }, []);
  const [plasticBannerDismissed, setPlasticBannerDismissed] = useState(false);
  const [showEyeQTooltip, setShowEyeQTooltip] = useState(false);
  
  const [displayedCount, setDisplayedCount] = useState(6);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [statusAnnouncement, setStatusAnnouncement] = useState("");
  const batchSize = 6;
  const listContainerRef = useRef<HTMLDivElement>(null);
  const isRestoringState = useRef(false);
  const STORAGE_KEY = "catalog_state";

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

  const fetchExercises = useCallback(async (retryCount = 0): Promise<void> => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const controller = new AbortController();
      const res = await fetch(`/api/exercises?ts=${Date.now()}`, {
        cache: "no-store",
        credentials: "same-origin",
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error(`API returned ${res.status}`);
      }

      const data = await res.json().catch(() => {
        throw new Error("Invalid JSON response");
      });

      if (data?.exercises && Array.isArray(data.exercises)) {
        setExercises(data.exercises);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching exercises:", error instanceof Error ? error.message : String(error));
      if (retryCount < 2) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return fetchExercises(retryCount + 1);
      }
      setLoadError("We couldn't load drills right now. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchExercises();
    }
  }, [mounted, fetchExercises]);

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

  const totalFilteredCount = filteredExercises.length;
  
  const displayedExercises = useMemo(() => {
    return filteredExercises.slice(0, displayedCount);
  }, [filteredExercises, displayedCount]);

  const hasMoreToLoad = displayedCount < totalFilteredCount;

  useEffect(() => {
    // Skip reset if we're restoring state from sessionStorage
    if (isRestoringState.current) return;
    
    setDisplayedCount(batchSize);
    if (listContainerRef.current) {
      listContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [
    searchQuery,
    selectedAgeGroup,
    selectedDecisionTheme,
    selectedPlayerInvolvement,
    selectedGameMoment,
    selectedDifficulty,
    selectedPracticeFormat,
    showFavoritesOnly,
    selectedExerciseType,
  ]);

  const handleLoadMore = useCallback(() => {
    if (!hasMoreToLoad) return;
    const newCount = Math.min(displayedCount + batchSize, totalFilteredCount);
    setDisplayedCount(newCount);
    setStatusAnnouncement(`Now showing ${newCount} of ${totalFilteredCount} drills`);
  }, [hasMoreToLoad, totalFilteredCount, displayedCount]);

  // Restore state from sessionStorage on mount (SPA navigations and reload, but not fresh visits)
  useEffect(() => {
    if (!mounted) return;
    try {
      // Check navigation type for reload/back_forward (with legacy fallback for Safari)
      const navEntries = performance.getEntriesByType?.('navigation') as PerformanceNavigationTiming[] | undefined;
      const modernNavType = navEntries?.[0]?.type;
      // Legacy API: 0 = navigate, 1 = reload, 2 = back_forward
      const legacyNavType = (performance as { navigation?: { type?: number } }).navigation?.type;
      
      const isReloadOrBackForward = modernNavType === 'reload' || modernNavType === 'back_forward' ||
        legacyNavType === 1 || legacyNavType === 2;
      
      // Restore if: SPA navigation (visited before this session) OR reload/back_forward
      const shouldRestore = catalogVisitedThisSession || isReloadOrBackForward;
      
      // Mark as visited for future SPA navigations
      catalogVisitedThisSession = true;
      
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        if (shouldRestore) {
          const state = JSON.parse(saved);
          if (state.displayedCount && state.displayedCount > batchSize) {
            isRestoringState.current = true;
            setDisplayedCount(state.displayedCount);
            // Restore scroll position after render
            requestAnimationFrame(() => {
              if (state.scrollY) {
                window.scrollTo(0, state.scrollY);
              }
              isRestoringState.current = false;
            });
          }
        }
        // Always clear after checking (prevents stale state on next fresh visit)
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      // Ignore storage errors
    }
  }, [mounted]);

  // Save state to sessionStorage on unmount (SPA navigations) and beforeunload (hard refresh)
  const displayedCountRef = useRef(displayedCount);
  useEffect(() => {
    displayedCountRef.current = displayedCount;
  }, [displayedCount]);

  useEffect(() => {
    const saveState = () => {
      if (displayedCountRef.current > batchSize) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
          displayedCount: displayedCountRef.current,
          scrollY: window.scrollY
        }));
      }
    };

    window.addEventListener('beforeunload', saveState);
    
    // Cleanup function runs on unmount (SPA navigations)
    return () => {
      window.removeEventListener('beforeunload', saveState);
      saveState(); // Save state when navigating away
    };
  }, []);

  // Show/hide "Back to top" button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    listContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

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

  // Show consistent loading state until client is mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="px-4 sm:px-6 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Drill Catalogue</h1>
              <p className="text-foreground opacity-60 text-sm">Find the perfect drill for your training session</p>
            </div>
            <div className="text-center py-12">
              <div className="flex justify-center mb-3">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              </div>
              <p className="text-foreground">Loading drills...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                exercises={exercisesForCurrentType}
                onFilterSelect={handleFilterSelect}
                placeholder="Search or type to filter..."
                resultCount={filteredExercises.length}
                totalCount={exerciseTypeBaseCount}
                activeFilters={{
                  ageGroup: selectedAgeGroup,
                  difficulty: selectedDifficulty,
                  practiceFormat: selectedPracticeFormat,
                  gameMoment: selectedGameMoment,
                  decisionTheme: selectedDecisionTheme,
                  playerInvolvement: selectedPlayerInvolvement,
                }}
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

          {/* Status line: Showing X of Y */}
          {!isLoading && !loadError && totalFilteredCount > 0 && (
            <div ref={listContainerRef} className="mb-4 text-sm text-foreground opacity-70">
              Showing <span className="font-semibold text-primary">{displayedExercises.length}</span> of {totalFilteredCount} drills
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(isLoading && exercises.length === 0) ? (
              <>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-card rounded-xl border border-divider p-4 animate-pulse">
                    <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                ))}
              </>
            ) : loadError ? (
              <div className="col-span-full bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <div className="text-6xl mb-4">🚧</div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">We hit a snag loading drills</h3>
                <p className="text-red-700 opacity-80 mb-4">
                  {loadError}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => fetchExercises()}
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
              displayedExercises.map((exercise) => (
                <ExerciseCard key={exercise.id} exercise={exercise} />
              ))
            )}
          </div>

          {/* Load more button */}
          {hasMoreToLoad && !isLoading && !loadError && (
            <div className="flex flex-col items-center gap-3 mt-8 pb-4">
              <button
                onClick={handleLoadMore}
                className="px-6 py-3 rounded-xl bg-primary text-button font-medium
                           hover:bg-primary-hover transition-colors flex items-center gap-2"
              >
                Load more drills
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Back to top floating button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          aria-label="Back to top of drill list"
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-primary text-white shadow-lg
                     hover:bg-primary-hover transition-all duration-300 
                     focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}

      {/* Accessibility: Live region for status announcements */}
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
        className="sr-only"
      >
        {statusAnnouncement}
      </div>
    </div>
  );
}
