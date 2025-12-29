"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Analytics } from "firebase/analytics";
import {
  ConsentState,
  CriticalEventName,
  AuditEventContext,
  hydrateAnalyticsWithConsent,
  logAuditEvent,
} from "@/app/utils/analytics";

const CONSENT_STORAGE_KEY = "feq_analytics_consent";

interface AnalyticsContextShape {
  consent: ConsentState;
  analytics: Analytics | null;
  ready: boolean;
  grantConsent: () => void;
  denyConsent: () => void;
  trackEvent: (eventName: CriticalEventName, context?: AuditEventContext) => Promise<void>;
}

const AnalyticsContext = createContext<AnalyticsContextShape | undefined>(undefined);

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<ConsentState>("unknown");
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(CONSENT_STORAGE_KEY) : null;
    if (stored === "granted" || stored === "denied") {
      setConsent(stored);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (consent === "granted") {
      setAnalytics(hydrateAnalyticsWithConsent(consent));
    } else {
      setAnalytics(null);
    }

    if (typeof window !== "undefined" && consent !== "unknown") {
      localStorage.setItem(CONSENT_STORAGE_KEY, consent);
    }
  }, [consent]);

  const grantConsent = useCallback(() => setConsent("granted"), []);
  const denyConsent = useCallback(() => setConsent("denied"), []);

  const trackEvent = useCallback(
    async (eventName: CriticalEventName, context?: AuditEventContext) => {
      await logAuditEvent(eventName, {
        context,
        consent,
        analytics,
      });
    },
    [analytics, consent]
  );

  const value = useMemo(
    () => ({
      consent,
      analytics,
      ready,
      grantConsent,
      denyConsent,
      trackEvent,
    }),
    [analytics, consent, denyConsent, grantConsent, ready, trackEvent]
  );

  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;
}

export function useAnalytics() {
  const ctx = useContext(AnalyticsContext);
  if (!ctx) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider");
  }
  return ctx;
}
