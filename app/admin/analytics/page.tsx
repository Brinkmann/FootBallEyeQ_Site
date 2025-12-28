"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
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

export default function AuditAnalyticsPage() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email === SUPER_ADMIN_EMAIL) {
        setAuthorized(true);
      } else {
        setAuthorized(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!authorized) return;
    const loadEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const auditQuery = query(
          collection(db, "auditEvents"),
          orderBy("createdAt", "desc"),
          limit(50)
        );
        const snapshot = await getDocs(auditQuery);
        const data: AuditEvent[] = snapshot.docs.map((doc) => {
          const { id: _ignoredId, ...rest } = doc.data() as AuditEvent;
          void _ignoredId;
          return {
            id: doc.id,
            ...rest,
          };
        });
        setEvents(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load analytics events";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [authorized]);

  const totals = useMemo(() => {
    return events.reduce(
      (acc, event) => {
        if (event.eventName in acc) {
          acc[event.eventName as keyof typeof acc] += 1;
        }
        return acc;
      },
      { signup: 0, purchase: 0, share: 0, error: 0 }
    );
  }, [events]);

  const lastUpdated = events[0]?.createdAt?.seconds
    ? new Date(events[0].createdAt.seconds * 1000).toLocaleString()
    : "Not yet recorded";

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
            <p className="text-sm uppercase tracking-wide text-gray-500">Audit Analytics</p>
            <h1 className="text-3xl font-bold text-foreground">Critical Event Dashboard</h1>
            <p className="text-foreground opacity-80 mt-1">
              Cross-check Firebase Analytics events against the audit log to confirm signup, purchase, share, and error tracking is working end-to-end.
            </p>
            <p className="text-xs text-gray-500 mt-1">Last updated: {lastUpdated}</p>
          </div>
          <Link
            href="/admin"
            className="px-4 py-2 rounded-lg border border-divider text-foreground hover:bg-card"
          >
            ← Back to Admin
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {(
            [
              { label: "Signups", key: "signup" },
              { label: "Purchases", key: "purchase" },
              { label: "Shares", key: "share" },
              { label: "Errors", key: "error" },
            ] as const
          ).map((metric) => (
            <div key={metric.key} className="bg-card border border-divider rounded-2xl p-4 shadow-sm">
              <p className="text-sm text-gray-500">{metric.label}</p>
              <p className="text-3xl font-semibold text-foreground">{totals[metric.key]}</p>
            </div>
          ))}
        </div>

        <div className="bg-card border border-divider rounded-2xl shadow-sm">
          <div className="px-4 py-3 border-b border-divider flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Most recent events</h2>
            {loading && <span className="text-sm text-gray-500">Refreshing…</span>}
            {error && <span className="text-sm text-red-600">{error}</span>}
          </div>
          <div className="divide-y divide-divider">
            {events.map((event) => {
              const timestamp = event.createdAt?.seconds
                ? new Date(event.createdAt.seconds * 1000).toLocaleString()
                : "Unknown";
              return (
                <div key={event.id} className="px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <p className="text-foreground font-semibold capitalize">{event.eventName}</p>
                    <p className="text-sm text-gray-500">Consent: {event.consent || "n/a"}</p>
                    {event.page && <p className="text-xs text-gray-400">Path: {event.page}</p>}
                  </div>
                  <div className="flex-1 text-sm text-gray-600">
                    {event.context ? JSON.stringify(event.context) : "No metadata"}
                  </div>
                  <div className="text-sm text-gray-500 whitespace-nowrap">{timestamp}</div>
                </div>
              );
            })}
            {!events.length && !loading && (
              <div className="px-4 py-6 text-center text-gray-500">No audit events captured yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
