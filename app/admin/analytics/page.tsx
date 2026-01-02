"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, limit, orderBy, query, where, Timestamp } from "firebase/firestore";
import { auth, db } from "@/Firebase/firebaseConfig";

const SUPER_ADMIN_EMAIL = "obrinkmann@gmail.com";

interface AuditEvent {
  id: string;
  eventName: string;
  consent: string;
  createdAt?: { seconds: number; nanoseconds: number };
  context?: Record<string, unknown>;
  page?: string;
}

interface UserLookup {
  [userId: string]: { email: string; fname: string; lname: string };
}

interface PlannerDoc {
  weeks: Array<{ exercises: Array<{ name: string; type: string }> }>;
}

function formatRelativeTime(seconds: number): string {
  const now = Date.now();
  const diff = now - seconds * 1000;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(seconds * 1000).toLocaleDateString();
}

function formatEntryPoint(entryPoint: string | undefined): { label: string; color: string } {
  switch (entryPoint) {
    case "club_code":
      return { label: "Club Invite", color: "bg-blue-100 text-blue-700" };
    case "direct":
    default:
      return { label: "Direct Signup", color: "bg-gray-100 text-gray-700" };
  }
}

function formatEventName(eventName: string): { label: string; icon: string } {
  switch (eventName) {
    case "signup":
      return { label: "signed up", icon: "👤" };
    case "login":
      return { label: "logged in", icon: "🔑" };
    case "purchase":
      return { label: "made a purchase", icon: "💳" };
    case "share":
      return { label: "shared content", icon: "📤" };
    case "error":
      return { label: "encountered an error", icon: "⚠️" };
    default:
      return { label: eventName, icon: "📝" };
  }
}

export default function AuditAnalyticsPage() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [userLookup, setUserLookup] = useState<UserLookup>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [favoritesByType, setFavoritesByType] = useState({ eyeq: 0, plastic: 0 });
  const [reviewsByType, setReviewsByType] = useState({ eyeq: 0, plastic: 0, unknown: 0 });
  const [sessionsPlanned, setSessionsPlanned] = useState(0);
  const [avgDrillsPerSession, setAvgDrillsPerSession] = useState(0);
  const [loginsLast4Weeks, setLoginsLast4Weeks] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email === SUPER_ADMIN_EMAIL) {
        setAuthorized(true);
      } else {
        setAuthorized(false);
        router.replace("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!authorized) return;

    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [auditSnap, signupsSnap, favoritesSnap, reviewsSnap, plannersSnap] = await Promise.all([
          getDocs(query(collection(db, "auditEvents"), orderBy("createdAt", "desc"), limit(50))),
          getDocs(collection(db, "signups")),
          getDocs(collection(db, "favorites")),
          getDocs(collection(db, "reviews")),
          getDocs(collection(db, "planners")),
        ]);

        const eventData: AuditEvent[] = auditSnap.docs.map((doc) => {
          const { id: _ignoredId, ...rest } = doc.data() as AuditEvent;
          void _ignoredId;
          return { id: doc.id, ...rest };
        });
        setEvents(eventData);

        const lookup: UserLookup = {};
        signupsSnap.docs.forEach((doc) => {
          const data = doc.data();
          if (data.uid) {
            lookup[data.uid] = {
              email: data.email || "Unknown",
              fname: data.fname || "",
              lname: data.lname || "",
            };
          }
        });
        setUserLookup(lookup);

        const favCounts = { eyeq: 0, plastic: 0 };
        favoritesSnap.docs.forEach((doc) => {
          const type = doc.data().exerciseType || "eyeq";
          if (type === "eyeq") favCounts.eyeq++;
          else if (type === "plastic") favCounts.plastic++;
        });
        setFavoritesByType(favCounts);

        const revCounts = { eyeq: 0, plastic: 0, unknown: 0 };
        reviewsSnap.docs.forEach((doc) => {
          const type = doc.data().exerciseType;
          if (type === "eyeq") revCounts.eyeq++;
          else if (type === "plastic") revCounts.plastic++;
          else revCounts.unknown++;
        });
        setReviewsByType(revCounts);

        let totalDrills = 0;
        let usersWithPlans = 0;
        plannersSnap.docs.forEach((doc) => {
          const data = doc.data() as PlannerDoc;
          if (data.weeks && Array.isArray(data.weeks)) {
            const drillCount = data.weeks.reduce((sum, week) => {
              return sum + (week.exercises?.length || 0);
            }, 0);
            if (drillCount > 0) {
              usersWithPlans++;
              totalDrills += drillCount;
            }
          }
        });
        setSessionsPlanned(usersWithPlans);
        setAvgDrillsPerSession(usersWithPlans > 0 ? Math.round((totalDrills / usersWithPlans) * 10) / 10 : 0);

        const fourWeeksAgo = Timestamp.fromDate(new Date(Date.now() - 28 * 24 * 60 * 60 * 1000));
        const loginQuery = query(
          collection(db, "auditEvents"),
          where("eventName", "==", "login"),
          where("createdAt", ">=", fourWeeksAgo)
        );
        const loginSnap = await getDocs(loginQuery);
        setLoginsLast4Weeks(loginSnap.size);

      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load analytics data";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [authorized]);

  const totals = useMemo(() => {
    return events.reduce(
      (acc, event) => {
        if (event.eventName in acc) {
          acc[event.eventName as keyof typeof acc] += 1;
        }
        return acc;
      },
      { signup: 0, login: 0, purchase: 0, share: 0, error: 0 }
    );
  }, [events]);

  if (authorized === false) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="bg-card border border-divider rounded-2xl shadow-sm p-8 max-w-md text-center space-y-3">
          <h1 className="text-xl font-semibold text-foreground">Admin access required</h1>
          <p className="text-foreground opacity-80">Only the super admin can review audit analytics.</p>
          <Link href="/login" className="text-primary font-medium hover:underline">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-gray-500">Platform Analytics</p>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-foreground opacity-80 mt-1">
              Platform usage metrics and activity feed
            </p>
          </div>
          <Link
            href="/admin"
            className="px-4 py-2 rounded-lg border border-divider text-foreground hover:bg-card"
          >
            ← Back to Admin
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: "Signups", value: totals.signup },
            { label: "Logins (4 weeks)", value: loginsLast4Weeks },
            { label: "Purchases", value: totals.purchase },
            { label: "Shares", value: totals.share },
            { label: "Errors", value: totals.error },
          ].map((metric) => (
            <div key={metric.label} className="bg-card border border-divider rounded-2xl p-4 shadow-sm">
              <p className="text-sm text-gray-500">{metric.label}</p>
              <p className="text-3xl font-semibold text-foreground">{metric.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-divider rounded-2xl p-4 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Favorites by Type</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-foreground">EyeQ Drills</span>
                <span className="font-semibold text-foreground">{favoritesByType.eyeq}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground">Plastic Drills</span>
                <span className="font-semibold text-foreground">{favoritesByType.plastic}</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-divider rounded-2xl p-4 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Reviews by Type</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-foreground">EyeQ Drills</span>
                <span className="font-semibold text-foreground">{reviewsByType.eyeq}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground">Plastic Drills</span>
                <span className="font-semibold text-foreground">{reviewsByType.plastic}</span>
              </div>
              {reviewsByType.unknown > 0 && (
                <div className="flex justify-between items-center text-gray-400">
                  <span>Legacy (no type)</span>
                  <span>{reviewsByType.unknown}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-card border border-divider rounded-2xl p-4 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Session Planning</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-foreground">Users with Plans</span>
                <span className="font-semibold text-foreground">{sessionsPlanned}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground">Avg Drills/User</span>
                <span className="font-semibold text-foreground">{avgDrillsPerSession}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-divider rounded-2xl shadow-sm">
          <div className="px-4 py-3 border-b border-divider flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
            {loading && <span className="text-sm text-gray-500">Loading…</span>}
            {error && <span className="text-sm text-red-600">{error}</span>}
          </div>
          <div className="divide-y divide-divider">
            {events.map((event) => {
              const userId = event.context?.userId as string | undefined;
              const user = userId ? userLookup[userId] : null;
              const displayName = user
                ? user.email
                : userId
                ? `User ${userId.slice(0, 8)}…`
                : "Anonymous";

              const entryPoint = event.context?.entryPoint as string | undefined;
              const { label: entryLabel, color: entryColor } = formatEntryPoint(entryPoint);
              const { label: actionLabel, icon } = formatEventName(event.eventName);

              const timestamp = event.createdAt?.seconds;
              const relativeTime = timestamp ? formatRelativeTime(timestamp) : "Unknown";
              const fullDate = timestamp
                ? new Date(timestamp * 1000).toLocaleString()
                : "";

              const errorMessage = event.context?.errorMessage as string | undefined;

              return (
                <div key={event.id} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground">
                        <span className="mr-2">{icon}</span>
                        <span className="font-medium">{displayName}</span>
                        <span className="text-gray-600"> {actionLabel}</span>
                        {event.eventName === "signup" && entryPoint && (
                          <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${entryColor}`}>
                            {entryLabel}
                          </span>
                        )}
                      </p>
                      {errorMessage && (
                        <p className="text-sm text-red-600 mt-1 truncate">{errorMessage}</p>
                      )}
                    </div>
                    <span
                      className="text-sm text-gray-500 whitespace-nowrap cursor-help"
                      title={fullDate}
                    >
                      {relativeTime}
                    </span>
                  </div>
                </div>
              );
            })}
            {!events.length && !loading && (
              <div className="px-4 py-6 text-center text-gray-500">No activity recorded yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
