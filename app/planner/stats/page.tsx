"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NavBar from "../../components/Navbar";
import Breadcrumbs from "../../components/Breadcrumbs";
import { usePlanStore } from "../../store/usePlanStore";
import { useFavoritesContext } from "../../components/FavoritesProvider";
import { useEntitlements } from "../../components/EntitlementProvider";
import { useExerciseType } from "../../components/ExerciseTypeProvider";
import { auth, db } from "../../../Firebase/firebaseConfig";
import { collection, getDocs, onSnapshot, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Exercise } from "../../types/exercise";
import { parseExerciseFromFirestore } from "../../lib/schemas";

interface ExerciseWithStats extends Exercise {
  sessions: number[];
  avgRating: number;
  reviewCount: number;
}

export default function StatsPage() {
  const router = useRouter();
  const weeks = usePlanStore((s) => s.weeks);
  const maxPerWeek = usePlanStore((s) => s.maxPerWeek);
  const removeExerciseFromAll = usePlanStore((s) => s.removeExerciseFromAll);
  const { isFavorite, toggleFavorite, isAuthenticated, isAtLimitForType, maxFavorites } = useFavoritesContext();
  const [showLimitMessage, setShowLimitMessage] = useState<string | null>(null);

  const handleFavoriteClick = (exerciseId: string, exerciseType: "eyeq" | "plastic") => {
    if (!isFavorite(exerciseId) && isAtLimitForType(exerciseType)) {
      setShowLimitMessage(exerciseId);
      setTimeout(() => setShowLimitMessage(null), 3000);
      return;
    }
    toggleFavorite(exerciseId, exerciseType);
  };
  const { entitlements, isLoading: entitlementsLoading } = useEntitlements();
  const { selectedExerciseType } = useExerciseType();

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [ratings, setRatings] = useState<Record<string, { avg: number; count: number }>>({});
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchExercises() {
      try {
        const snap = await getDocs(collection(db, "exercises"));
        const list = snap.docs
          .map((doc) => parseExerciseFromFirestore(doc.id, doc.data() as Record<string, unknown>))
          .filter((ex): ex is Exercise => ex !== null);
        setExercises(list);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
    }
    fetchExercises();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "reviews"), 
      (snapshot) => {
        const ratingMap: Record<string, { total: number; count: number }> = {};
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          const title = data.exerciseN;
          const stars = data.numStar || 0;
          if (!ratingMap[title]) {
            ratingMap[title] = { total: 0, count: 0 };
          }
          ratingMap[title].total += stars;
          ratingMap[title].count += 1;
        });

        const result: Record<string, { avg: number; count: number }> = {};
        for (const title in ratingMap) {
          result[title] = {
            avg: ratingMap[title].total / ratingMap[title].count,
            count: ratingMap[title].count,
          };
        }
        setRatings(result);
      },
      (error) => {
        console.error("Reviews listener error:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const usedExercises = useMemo(() => {
    const exerciseMap: Record<string, number[]> = {};
    
    weeks.forEach((week) => {
      week.exercises.forEach((ex) => {
        // Only include exercises matching the selected type
        if (ex.type === selectedExerciseType) {
          if (!exerciseMap[ex.name]) {
            exerciseMap[ex.name] = [];
          }
          exerciseMap[ex.name].push(week.week);
        }
      });
    });

    return exerciseMap;
  }, [weeks, selectedExerciseType]);

  const exercisesWithStats: ExerciseWithStats[] = useMemo(() => {
    return Object.keys(usedExercises)
      .map((name) => {
        const exercise = exercises.find((e) => e.title === name);
        const rating = ratings[name] || { avg: 0, count: 0 };
        return {
          ...(exercise || {
            id: name,
            title: name,
            ageGroup: "Unknown",
            decisionTheme: "Unknown",
            playerInvolvement: "Unknown",
            gameMoment: "Unknown",
            difficulty: "Unknown",
            practiceFormat: "General / Mixed",
            overview: "",
            description: "",
            exerciseBreakdownDesc: "",
            image: "",
            exerciseType: selectedExerciseType,
          }),
          sessions: usedExercises[name],
          avgRating: rating.avg,
          reviewCount: rating.count,
        };
      })
      .filter((ex) => ex.exerciseType === selectedExerciseType)
      .sort((a, b) => b.sessions.length - a.sessions.length);
  }, [usedExercises, exercises, ratings, selectedExerciseType]);

  const planAnalysis = useMemo(() => {
    const difficulties: Record<string, number> = {};
    const decisionThemes: Record<string, number> = {};
    const gameMoments: Record<string, number> = {};
    const formats: Record<string, number> = {};

    const isValid = (val: string | undefined) => val && val.trim() !== "" && val !== "Unknown" && val !== "N/A" && val !== "General / Unspecified";

    exercisesWithStats.forEach((ex) => {
      if (isValid(ex.difficulty)) {
        difficulties[ex.difficulty] = (difficulties[ex.difficulty] || 0) + 1;
      }
      if (isValid(ex.decisionTheme)) {
        decisionThemes[ex.decisionTheme] = (decisionThemes[ex.decisionTheme] || 0) + 1;
      }
      if (isValid(ex.gameMoment)) {
        gameMoments[ex.gameMoment] = (gameMoments[ex.gameMoment] || 0) + 1;
      }
      if (ex.practiceFormat && ex.practiceFormat.trim() !== "" && ex.practiceFormat !== "General / Mixed") {
        formats[ex.practiceFormat] = (formats[ex.practiceFormat] || 0) + 1;
      }
    });

    return { difficulties, decisionThemes, gameMoments, formats };
  }, [exercisesWithStats]);

  // Calculate stats from filtered exercises
  const totalSelections = exercisesWithStats.reduce((sum, ex) => sum + ex.sessions.length, 0);
  const uniqueExercises = exercisesWithStats.length;
  const sessionsWithDrills = useMemo(() => {
    const sessionsSet = new Set<number>();
    exercisesWithStats.forEach(ex => {
      ex.sessions.forEach(s => sessionsSet.add(s));
    });
    return sessionsSet.size;
  }, [exercisesWithStats]);

  const handleRemoveFromAll = async (name: string) => {
    const user = auth.currentUser;
    if (!user) {
      removeExerciseFromAll(name);
      setConfirmRemove(null);
      return;
    }

    setIsSaving(true);
    const updatedWeeks = weeks.map((w) => ({
      ...w,
      exercises: w.exercises.filter((e) => e.name !== name),
    }));

    try {
      const ref = doc(db, "planners", user.uid);
      await setDoc(ref, { weeks: updatedWeeks, maxPerWeek, updatedAt: serverTimestamp() }, { merge: true });
      removeExerciseFromAll(name);
    } catch (error) {
      console.error("Failed to save removal:", error);
    } finally {
      setIsSaving(false);
      setConfirmRemove(null);
    }
  };

  const navigateToSession = (sessionNum: number) => {
    router.push(`/planner?session=${sessionNum}`);
  };

  const truncateOverview = (text: string, maxLength: number = 80) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + "...";
  };

  const isLocked = !entitlementsLoading && !entitlements.canAccessStats;

  return (
    <div className="min-h-screen bg-background relative">
      <NavBar />
      <Breadcrumbs />

      {/* Stats content - hidden when locked */}
      <div className={`px-4 sm:px-6 py-6 ${isLocked ? 'pointer-events-none select-none' : ''}`}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">Session Selection Stats</h1>
            <p className="text-foreground opacity-60 text-sm">
              Review your exercise selections and balance your training plan
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-card border border-divider rounded-xl p-4">
              <p className="text-sm text-foreground opacity-60 mb-1">Total Selections</p>
              <p className="text-3xl font-bold text-foreground">{totalSelections}</p>
            </div>
            <div className="bg-card border border-divider rounded-xl p-4">
              <p className="text-sm text-foreground opacity-60 mb-1">Unique Exercises</p>
              <p className="text-3xl font-bold text-foreground">{uniqueExercises}</p>
            </div>
            <div className="bg-card border border-divider rounded-xl p-4">
              <p className="text-sm text-foreground opacity-60 mb-1">Sessions with Picks</p>
              <p className="text-3xl font-bold text-foreground">{sessionsWithDrills} <span className="text-lg font-normal opacity-60">/ 12</span></p>
            </div>
          </div>

          {Object.keys(planAnalysis.difficulties).length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">Plan Balance</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-card border border-divider rounded-xl p-4">
                  <h3 className="text-sm font-medium text-foreground opacity-60 mb-3">Difficulty Spread</h3>
                  <div className="space-y-2">
                    {Object.entries(planAnalysis.difficulties).map(([key, count]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-foreground">{key}</span>
                        <span className="text-foreground opacity-60">{count}x</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-card border border-divider rounded-xl p-4">
                  <h3 className="text-sm font-medium text-foreground opacity-60 mb-3">Decision Themes</h3>
                  <div className="space-y-2">
                    {Object.entries(planAnalysis.decisionThemes).length > 0 ? (
                      Object.entries(planAnalysis.decisionThemes).map(([key, count]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-foreground">{key}</span>
                          <span className="text-foreground opacity-60">{count}x</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-foreground opacity-40">No themes set</p>
                    )}
                  </div>
                </div>

                <div className="bg-card border border-divider rounded-xl p-4">
                  <h3 className="text-sm font-medium text-foreground opacity-60 mb-3">Game Moments</h3>
                  <div className="space-y-2">
                    {Object.entries(planAnalysis.gameMoments).length > 0 ? (
                      Object.entries(planAnalysis.gameMoments).map(([key, count]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-foreground">{key}</span>
                          <span className="text-foreground opacity-60">{count}x</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-foreground opacity-40">No moments set</p>
                    )}
                  </div>
                </div>

                <div className="bg-card border border-divider rounded-xl p-4">
                  <h3 className="text-sm font-medium text-foreground opacity-60 mb-3">Practice Formats</h3>
                  <div className="space-y-2">
                    {Object.entries(planAnalysis.formats).slice(0, 5).map(([key, count]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-foreground truncate max-w-[140px]">{key}</span>
                        <span className="text-foreground opacity-60">{count}x</span>
                      </div>
                    ))}
                    {Object.keys(planAnalysis.formats).length === 0 && (
                      <p className="text-sm text-foreground opacity-40">No formats set</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground">Exercise Breakdown</h2>
            <p className="text-sm text-foreground opacity-60">Sorted by session usage</p>
          </div>

          {exercisesWithStats.length === 0 ? (
            <div className="bg-card border border-divider rounded-xl p-8 text-center">
              <p className="text-foreground opacity-60">No exercises selected yet. Visit the Drill Catalogue to add exercises to your sessions.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {exercisesWithStats.map((ex) => (
                <div key={ex.id} className="bg-card border border-divider rounded-xl p-4">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 mb-2">
                        <h3 className="font-semibold text-foreground flex-1">{ex.title}</h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-sm text-foreground opacity-60">
                            {ex.avgRating > 0 ? `${ex.avgRating.toFixed(1)}` : "—"} ({ex.reviewCount})
                          </span>
                          {isAuthenticated && (
                            <div className="relative">
                              <button
                                onClick={() => handleFavoriteClick(ex.id, ex.exerciseType)}
                                className="p-1 rounded-full hover:bg-primary-light transition-colors"
                              >
                                {isFavorite(ex.id) ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-500">
                                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                                  </svg>
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 hover:text-red-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                  </svg>
                                )}
                              </button>
                              {showLimitMessage === ex.id && (
                                <div className="absolute right-0 top-full mt-1 z-50 w-56 p-3 bg-gray-900 text-white text-xs rounded shadow-lg leading-relaxed">
                                  You&apos;ve reached your 10 favorites limit! 💔 Upgrade to save unlimited drills and never lose track of your best exercises.
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {(ex.exerciseBreakdownDesc || ex.overview) && (
                        <p className="text-sm text-foreground opacity-70 mb-3">
                          {ex.exerciseBreakdownDesc || truncateOverview(ex.overview)}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 mb-3">
                        {ex.sessions.map((sessionNum) => (
                          <button
                            key={sessionNum}
                            onClick={() => !isSaving && navigateToSession(sessionNum)}
                            disabled={isSaving}
                            className="px-3 py-1 text-xs font-medium rounded-full bg-primary-light text-primary-dark hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Session {sessionNum}
                          </button>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { label: ex.ageGroup, skip: ["Unknown", "N/A", "General / Unspecified", ""] },
                          { label: ex.decisionTheme, skip: ["Unknown", "N/A", "General / Unspecified", ""] },
                          { label: ex.playerInvolvement, skip: ["Unknown", "N/A", "General / Unspecified", ""] },
                          { label: ex.gameMoment, skip: ["Unknown", "N/A", "General / Unspecified", ""] },
                          { label: ex.difficulty, skip: ["Unknown", "N/A", "General / Unspecified", ""] },
                          { label: ex.practiceFormat, skip: ["Unknown", "N/A", "General / Mixed", ""] },
                        ]
                          .filter(tag => tag.label && !tag.skip.includes(tag.label))
                          .map((tag, idx) => (
                            <span key={idx} className="text-xs px-2 py-0.5 rounded bg-background text-foreground opacity-70 border border-divider">
                              {tag.label}
                            </span>
                          ))
                        }
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      {confirmRemove === ex.title ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-foreground opacity-60">
                            {isSaving ? "Saving..." : "Remove?"}
                          </span>
                          <button
                            onClick={() => handleRemoveFromAll(ex.title)}
                            disabled={isSaving}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSaving ? "..." : "Yes"}
                          </button>
                          <button
                            onClick={() => setConfirmRemove(null)}
                            disabled={isSaving}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-divider text-foreground hover:bg-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmRemove(ex.title)}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-divider text-foreground opacity-60 hover:text-red-500 hover:border-red-300 transition-colors"
                        >
                          Remove from all
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FOMO Lock Overlay */}
      {isLocked && (
        <div className="fixed inset-0 bg-background z-50 flex items-center justify-center px-4">
          <div className="max-w-2xl w-full text-center">
            {/* Pulsing Lock Icon */}
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse" style={{ backgroundColor: '#F0EFEA' }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-12 h-12" style={{ color: '#A10115' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>

            {/* FOMO Heading */}
            <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#A10115' }}>
              This Could Be Yours
            </h1>

            {/* Emotional hook */}
            <p className="text-lg text-gray-700 mb-6 font-medium">
              Other coaches are using these analytics right now to build better training plans.
            </p>

            {/* What they see behind the blur */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 mb-6 border-2" style={{ borderColor: '#F0EFEA' }}>
              <p className="text-sm font-semibold mb-4" style={{ color: '#A10115' }}>
                Behind this screen, you&apos;re missing:
              </p>
              <ul className="text-sm text-gray-700 space-y-3 text-left max-w-lg mx-auto">
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 mt-0.5 flex-shrink-0" style={{ color: '#D72C16' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <div>
                    <strong className="block">Visual analytics dashboard</strong>
                    <span className="text-xs opacity-80">See difficulty balance, age distribution, and theme coverage at a glance</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 mt-0.5 flex-shrink-0" style={{ color: '#D72C16' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <strong className="block">Session-by-session tracking</strong>
                    <span className="text-xs opacity-80">Know exactly which drills you&apos;ve used and when, so you never repeat yourself</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 mt-0.5 flex-shrink-0" style={{ color: '#D72C16' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <div>
                    <strong className="block">Quick-remove from all sessions</strong>
                    <span className="text-xs opacity-80">Made a mistake? Remove an exercise from your entire season in one click</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Social proof */}
            <p className="text-sm text-gray-600 mb-6 italic">
              &quot;I wish I&apos;d had this when I was planning my season manually&quot; - Every coach who upgrades
            </p>

            {/* Two paths with urgency */}
            <p className="text-sm font-semibold mb-4" style={{ color: '#6B7280' }}>
              Get instant access by upgrading or joining through your club
            </p>

            {/* Two-button CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto mb-6">
              <Link
                href="/upgrade"
                className="px-8 py-4 text-base font-bold text-white rounded-xl transition-all hover:shadow-2xl hover:scale-105 text-center transform"
                style={{ backgroundColor: '#D72C16' }}
              >
                Unlock Now - $29/mo
              </Link>
              <Link
                href="/join-club"
                className="px-8 py-4 text-base font-semibold rounded-xl transition-all hover:shadow-xl hover:scale-105 border-2 text-center transform"
                style={{ borderColor: '#D72C16', color: '#6B7280' }}
              >
                Have a Club Code?
              </Link>
            </div>

            {/* Back link */}
            <Link
              href="/planner"
              className="text-sm hover:underline inline-flex items-center gap-1"
              style={{ color: '#6B7280' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Planner
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
