"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { auth, db } from "@/Firebase/firebaseConfig";

const SUPER_ADMIN_EMAIL = "obrinkmann@gmail.com";

interface UserData {
  uid: string;
  email: string;
  fname: string;
  lname: string;
  accountType: string;
  createdAt?: { seconds: number };
}

interface UserStats {
  uid: string;
  email: string;
  name: string;
  accountType: string;
  favoritesEyeq: number;
  favoritesPlastic: number;
  reviewsEyeq: number;
  reviewsPlastic: number;
  sessionsWithDrills: number;
  totalWeeks: number;
  totalDrills: number;
  avgDrillsPerSession: number;
  loginsLast4Weeks: number;
  signupDate: string;
}

type SortField = "email" | "favorites" | "reviews" | "sessions" | "logins";
type SortDir = "asc" | "desc";

export default function AuditAnalyticsPage() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const [sortField, setSortField] = useState<SortField>("logins");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const router = useRouter();

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
        const fourWeeksAgo = Timestamp.fromDate(new Date(Date.now() - 28 * 24 * 60 * 60 * 1000));

        const [signupsSnap, favoritesSnap, reviewsSnap, plannersSnap, loginsSnap] = await Promise.all([
          getDocs(collection(db, "signups")),
          getDocs(collection(db, "favorites")),
          getDocs(collection(db, "reviews")),
          getDocs(collection(db, "planners")),
          getDocs(query(
            collection(db, "auditEvents"),
            where("eventName", "==", "login"),
            where("createdAt", ">=", fourWeeksAgo)
          )),
        ]);

        const users: Map<string, UserData> = new Map();
        signupsSnap.docs.forEach((doc) => {
          const data = doc.data();
          if (data.uid) {
            users.set(data.uid, {
              uid: data.uid,
              email: data.email || "Unknown",
              fname: data.fname || "",
              lname: data.lname || "",
              accountType: data.accountType || "free",
              createdAt: data.createdAt,
            });
          }
        });

        const favoritesByUser: Map<string, { eyeq: number; plastic: number }> = new Map();
        favoritesSnap.docs.forEach((doc) => {
          const data = doc.data();
          const userId = data.userId;
          if (!userId) return;
          const type = data.exerciseType || "eyeq";
          const current = favoritesByUser.get(userId) || { eyeq: 0, plastic: 0 };
          if (type === "eyeq") current.eyeq++;
          else if (type === "plastic") current.plastic++;
          favoritesByUser.set(userId, current);
        });

        const reviewsByUser: Map<string, { eyeq: number; plastic: number }> = new Map();
        reviewsSnap.docs.forEach((doc) => {
          const data = doc.data();
          const userId = data.userId;
          if (!userId) return;
          const type = data.exerciseType || "eyeq";
          const current = reviewsByUser.get(userId) || { eyeq: 0, plastic: 0 };
          if (type === "eyeq") current.eyeq++;
          else if (type === "plastic") current.plastic++;
          reviewsByUser.set(userId, current);
        });

        const plannersByUser: Map<string, { sessionsWithDrills: number; totalWeeks: number; totalDrills: number }> = new Map();
        plannersSnap.docs.forEach((doc) => {
          const userId = doc.id;
          const data = doc.data();
          if (data.weeks && Array.isArray(data.weeks)) {
            let sessionsWithDrills = 0;
            let totalDrills = 0;
            const totalWeeks = data.weeks.length;
            data.weeks.forEach((week: { exercises?: Array<{ name: string }> }) => {
              const drillCount = week.exercises?.length || 0;
              if (drillCount > 0) {
                sessionsWithDrills++;
                totalDrills += drillCount;
              }
            });
            plannersByUser.set(userId, { sessionsWithDrills, totalWeeks, totalDrills });
          }
        });

        const loginsByUser: Map<string, number> = new Map();
        loginsSnap.docs.forEach((doc) => {
          const data = doc.data();
          const userId = data.context?.userId as string | undefined;
          if (!userId) return;
          loginsByUser.set(userId, (loginsByUser.get(userId) || 0) + 1);
        });

        const stats: UserStats[] = [];
        users.forEach((user) => {
          const favs = favoritesByUser.get(user.uid) || { eyeq: 0, plastic: 0 };
          const revs = reviewsByUser.get(user.uid) || { eyeq: 0, plastic: 0 };
          const plan = plannersByUser.get(user.uid) || { sessionsWithDrills: 0, totalWeeks: 12, totalDrills: 0 };
          const logins = loginsByUser.get(user.uid) || 0;

          stats.push({
            uid: user.uid,
            email: user.email,
            name: [user.fname, user.lname].filter(Boolean).join(" ") || user.email.split("@")[0],
            accountType: user.accountType,
            favoritesEyeq: favs.eyeq,
            favoritesPlastic: favs.plastic,
            reviewsEyeq: revs.eyeq,
            reviewsPlastic: revs.plastic,
            sessionsWithDrills: plan.sessionsWithDrills,
            totalWeeks: plan.totalWeeks,
            totalDrills: plan.totalDrills,
            avgDrillsPerSession: plan.sessionsWithDrills > 0
              ? Math.round((plan.totalDrills / plan.sessionsWithDrills) * 10) / 10
              : 0,
            loginsLast4Weeks: logins,
            signupDate: user.createdAt?.seconds
              ? new Date(user.createdAt.seconds * 1000).toLocaleDateString()
              : "Unknown",
          });
        });

        setUserStats(stats);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load analytics data";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [authorized]);

  const sortedUsers = useMemo(() => {
    const sorted = [...userStats];
    sorted.sort((a, b) => {
      let aVal: number | string = 0;
      let bVal: number | string = 0;

      switch (sortField) {
        case "email":
          aVal = a.email.toLowerCase();
          bVal = b.email.toLowerCase();
          break;
        case "favorites":
          aVal = a.favoritesEyeq + a.favoritesPlastic;
          bVal = b.favoritesEyeq + b.favoritesPlastic;
          break;
        case "reviews":
          aVal = a.reviewsEyeq + a.reviewsPlastic;
          bVal = b.reviewsEyeq + b.reviewsPlastic;
          break;
        case "sessions":
          aVal = a.sessionsWithDrills;
          bVal = b.sessionsWithDrills;
          break;
        case "logins":
          aVal = a.loginsLast4Weeks;
          bVal = b.loginsLast4Weeks;
          break;
      }

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
    return sorted;
  }, [userStats, sortField, sortDir]);

  const totals = useMemo(() => {
    return userStats.reduce(
      (acc, user) => ({
        users: acc.users + 1,
        favorites: acc.favorites + user.favoritesEyeq + user.favoritesPlastic,
        reviews: acc.reviews + user.reviewsEyeq + user.reviewsPlastic,
        logins: acc.logins + user.loginsLast4Weeks,
        usersWithPlans: acc.usersWithPlans + (user.sessionsWithDrills > 0 ? 1 : 0),
      }),
      { users: 0, favorites: 0, reviews: 0, logins: 0, usersWithPlans: 0 }
    );
  }, [userStats]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <span className="text-gray-300 ml-1">↕</span>;
    return <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>;
  };

  if (authorized === false) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="bg-card border border-divider rounded-2xl shadow-sm p-8 max-w-md text-center space-y-3">
          <h1 className="text-xl font-semibold text-foreground">Admin access required</h1>
          <p className="text-foreground opacity-80">Only the super admin can view analytics.</p>
          <Link href="/login" className="text-primary font-medium hover:underline">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-gray-500">User Analytics</p>
            <h1 className="text-3xl font-bold text-foreground">Coach Engagement</h1>
            <p className="text-foreground opacity-80 mt-1">
              Per-user metrics for favorites, reviews, session planning, and logins
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
            { label: "Total Coaches", value: totals.users },
            { label: "Total Favorites", value: totals.favorites },
            { label: "Total Reviews", value: totals.reviews },
            { label: "Users with Plans", value: totals.usersWithPlans },
            { label: "Logins (4 wks)", value: totals.logins },
          ].map((metric) => (
            <div key={metric.label} className="bg-card border border-divider rounded-2xl p-4 shadow-sm">
              <p className="text-sm text-gray-500">{metric.label}</p>
              <p className="text-3xl font-semibold text-foreground">{metric.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-card border border-divider rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-divider flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">User Engagement</h2>
            {loading && <span className="text-sm text-gray-500">Loading...</span>}
            {error && <span className="text-sm text-red-600">{error}</span>}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-divider">
                <tr>
                  <th
                    className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("email")}
                  >
                    Coach <SortIcon field="email" />
                  </th>
                  <th
                    className="text-center px-4 py-3 font-medium text-gray-600 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("favorites")}
                  >
                    Favorites <SortIcon field="favorites" />
                  </th>
                  <th
                    className="text-center px-4 py-3 font-medium text-gray-600 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("reviews")}
                  >
                    Reviews <SortIcon field="reviews" />
                  </th>
                  <th
                    className="text-center px-4 py-3 font-medium text-gray-600 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("sessions")}
                  >
                    Sessions <SortIcon field="sessions" />
                  </th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">
                    Avg Drills
                  </th>
                  <th
                    className="text-center px-4 py-3 font-medium text-gray-600 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("logins")}
                  >
                    Logins (4wk) <SortIcon field="logins" />
                  </th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-divider">
                {sortedUsers.map((user) => (
                  <tr key={user.uid} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
                          {user.favoritesEyeq} EyeQ
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-orange-100 text-orange-700">
                          {user.favoritesPlastic} Plastic
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
                          {user.reviewsEyeq} EyeQ
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-orange-100 text-orange-700">
                          {user.reviewsPlastic} Plastic
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-medium text-foreground">{user.sessionsWithDrills}</span>
                      <span className="text-gray-400">/{user.totalWeeks}</span>
                    </td>
                    <td className="px-4 py-3 text-center text-foreground">
                      {user.avgDrillsPerSession || "—"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-medium ${user.loginsLast4Weeks > 0 ? "text-foreground" : "text-gray-400"}`}>
                        {user.loginsLast4Weeks}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-500 text-xs">
                      {user.signupDate}
                    </td>
                  </tr>
                ))}
                {!sortedUsers.length && !loading && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
