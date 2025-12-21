"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import NavBar from "@/app/components/Navbar";
import { usePlanStore } from "@/app/store/usePlanStore";
import { auth, db } from "@/Firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

type ExerciseMeta = {
  tags: string[];
  practiceFormat?: string;
};

type AuthStatus = "loading" | "guest" | "authed";

export default function PlannerStatsPage() {
  const weeks = usePlanStore((s) => s.weeks);

  const [authStatus, setAuthStatus] = useState<AuthStatus>("loading");
  const [exerciseMeta, setExerciseMeta] = useState<Record<string, ExerciseMeta>>({});
  const [isMetaLoading, setIsMetaLoading] = useState(true);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setAuthStatus(user ? "authed" : "guest");
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadExerciseMeta = async () => {
      try {
        const snap = await getDocs(collection(db, "exercises"));
        if (!isMounted) return;

        const meta: Record<string, ExerciseMeta> = {};
        snap.docs.forEach((doc) => {
          const data = doc.data();
          const title = typeof data.title === "string" && data.title.length > 0 ? data.title : doc.id;
          meta[title] = {
            tags: Array.isArray(data.tags)
              ? data.tags.filter((tag: unknown): tag is string => typeof tag === "string" && tag.trim().length > 0)
              : [],
            practiceFormat: typeof data.practiceFormat === "string" ? data.practiceFormat : undefined,
          };
        });

        setExerciseMeta(meta);
      } catch (error) {
        console.error("Failed to load exercise metadata for stats:", error);
      } finally {
        if (isMounted) {
          setIsMetaLoading(false);
        }
      }
    };

    loadExerciseMeta();

    return () => {
      isMounted = false;
    };
  }, []);

  const selections = useMemo(
    () =>
      weeks.flatMap((week) =>
        week.exercises
          .filter((name) => !!name)
          .map((name) => ({
            name,
            session: week.week,
          }))
      ),
    [weeks]
  );

  const exerciseStats = useMemo(() => {
    const map = new Map<
      string,
      { count: number; sessions: Set<number>; tags: string[]; practiceFormat?: string }
    >();

    for (const selection of selections) {
      const existing = map.get(selection.name) ?? {
        count: 0,
        sessions: new Set<number>(),
        tags: exerciseMeta[selection.name]?.tags ?? [],
        practiceFormat: exerciseMeta[selection.name]?.practiceFormat,
      };

      existing.count += 1;
      existing.sessions.add(selection.session);
      existing.tags = exerciseMeta[selection.name]?.tags ?? existing.tags;
      existing.practiceFormat = exerciseMeta[selection.name]?.practiceFormat ?? existing.practiceFormat;

      map.set(selection.name, existing);
    }

    return Array.from(map.entries())
      .map(([name, data]) => ({
        name,
        count: data.count,
        sessions: Array.from(data.sessions).sort((a, b) => a - b),
        tags: data.tags,
        practiceFormat: data.practiceFormat,
      }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [exerciseMeta, selections]);

  const tagBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};

    for (const selection of selections) {
      const tags = exerciseMeta[selection.name]?.tags ?? [];
      tags.forEach((tag) => {
        counts[tag] = (counts[tag] ?? 0) + 1;
      });
    }

    return Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [exerciseMeta, selections]);

  const totalSelections = selections.length;
  const uniqueExercises = exerciseStats.length;
  const sessionsWithSelections = new Set(selections.map((sel) => sel.session)).size;

  const isEmpty = totalSelections === 0;

  if (authStatus === "loading") {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="flex items-center justify-center py-16 text-foreground">Checking your account...</div>
      </div>
    );
  }

  if (authStatus === "guest") {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center text-foreground">
          <h1 className="text-2xl font-bold">Session stats are only available when you are signed in.</h1>
          <p className="text-gray-600 max-w-lg">
            Log in to view how often you&apos;ve slotted each exercise into your sessions and see your tag coverage.
          </p>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="px-4 py-2 bg-primary text-button rounded-lg hover:bg-primary-hover transition"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 border border-divider text-foreground rounded-lg hover:bg-background transition"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <div className="px-6 py-8 space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-foreground">Session Selection Stats</h1>
          <p className="text-gray-600 max-w-3xl">
            A private view of the exercises you&apos;ve placed into your sessions. Track duplicates, see which
            sessions use each drill, and review tag coverage to keep your plan balanced as the catalog grows.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total selections" value={totalSelections} />
          <StatCard title="Unique exercises" value={uniqueExercises} />
          <StatCard title="Sessions with picks" value={sessionsWithSelections} helper="/ 12 available" />
          <StatCard
            title="Distinct tags used"
            value={tagBreakdown.length}
            helper={isMetaLoading ? "Loading tags..." : undefined}
          />
        </div>

        {isEmpty ? (
          <div className="bg-card border border-divider rounded-xl p-6 text-center text-gray-600">
            <p className="font-semibold text-foreground mb-2">No exercises selected yet</p>
            <p className="mb-4">
              Add drills to your sessions from the{" "}
              <Link href="/catalog" className="text-primary hover:underline">
                catalog
              </Link>{" "}
              to see per-exercise stats here.
            </p>
            <div className="flex justify-center gap-3">
              <Link
                href="/catalog"
                className="px-4 py-2 bg-primary text-button rounded-lg hover:bg-primary-hover transition"
              >
                Browse catalog
              </Link>
              <Link
                href="/planner"
                className="px-4 py-2 border border-divider rounded-lg text-foreground hover:bg-background transition"
              >
                Go to planner
              </Link>
            </div>
          </div>
        ) : (
          <>
            <section className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-xl font-semibold text-foreground">Exercise breakdown</h2>
                <p className="text-sm text-gray-500">
                  Sorted by how often you&apos;ve scheduled each exercise across sessions.
                </p>
              </div>

              <div className="bg-card border border-divider rounded-xl overflow-hidden">
                <div className="grid grid-cols-12 bg-muted text-xs uppercase tracking-wide text-gray-600 px-4 py-3">
                  <div className="col-span-5">Exercise</div>
                  <div className="col-span-2 text-center">Selections</div>
                  <div className="col-span-3">Sessions</div>
                  <div className="col-span-2">Tags</div>
                </div>

                <div className="divide-y divide-divider">
                  {exerciseStats.map((item) => (
                    <div key={item.name} className="grid grid-cols-12 px-4 py-4 gap-3 items-start">
                      <div className="col-span-12 sm:col-span-5">
                        <p className="font-semibold text-foreground">{item.name}</p>
                        {item.practiceFormat && (
                          <p className="text-xs text-gray-500 mt-1">Format: {item.practiceFormat}</p>
                        )}
                      </div>
                      <div className="col-span-4 sm:col-span-2 flex items-center sm:justify-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-light text-primary-dark font-semibold">
                          {item.count}×
                        </span>
                      </div>
                      <div className="col-span-8 sm:col-span-3">
                        <SessionPills sessions={item.sessions} />
                      </div>
                      <div className="col-span-12 sm:col-span-2">
                        <TagPills tags={item.tags} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-xl font-semibold text-foreground">Tag coverage</h2>
                <p className="text-sm text-gray-500">
                  Quickly see whether you&apos;re mixing shooting, possession, rondos, and other emphases.
                </p>
              </div>

              {tagBreakdown.length === 0 ? (
                <p className="text-gray-600">No tags found for your selected exercises yet.</p>
              ) : (
                <div className="bg-card border border-divider rounded-xl p-4 flex flex-wrap gap-3">
                  {tagBreakdown.map(([tag, count]) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-divider text-sm text-foreground bg-background"
                    >
                      <span className="font-medium">{tag}</span>
                      <span className="text-xs text-gray-500">{count}×</span>
                    </span>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, helper }: { title: string; value: number; helper?: string }) {
  return (
    <div className="bg-card border border-divider rounded-xl p-4 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-foreground">{value}</span>
        {helper && <span className="text-xs text-gray-500">{helper}</span>}
      </div>
    </div>
  );
}

function SessionPills({ sessions }: { sessions: number[] }) {
  if (!sessions.length) return <p className="text-sm text-gray-500">Not scheduled yet</p>;

  return (
    <div className="flex flex-wrap gap-2">
      {sessions.map((session) => (
        <span
          key={session}
          className="px-3 py-1 text-xs rounded-full bg-primary-light text-primary-dark font-semibold"
        >
          Session {session}
        </span>
      ))}
    </div>
  );
}

function TagPills({ tags }: { tags: string[] }) {
  if (!tags?.length) {
    return <p className="text-xs text-gray-500">No tags</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span key={tag} className="px-2 py-1 rounded bg-muted text-xs text-foreground border border-divider">
          {tag}
        </span>
      ))}
    </div>
  );
}
