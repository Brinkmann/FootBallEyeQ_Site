"use client";

import { getAnalyticsInstance } from "@/Firebase/firebaseConfig";
import { Analytics, logEvent } from "firebase/analytics";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/Firebase/firebaseConfig";

type ConsentState = "unknown" | "granted" | "denied";
export type CriticalEventName = "signup" | "login" | "purchase" | "share" | "error";

export interface AuditEventContext {
  label?: string;
  userId?: string;
  plan?: string;
  pathway?: string;
  details?: string;
  errorMessage?: string;
  entryPoint?: string;
  exerciseCount?: number;
}

export interface AuditEventPayload {
  eventName: CriticalEventName;
  context?: AuditEventContext;
  consent: ConsentState;
  page?: string;
}

async function persistAuditEvent(payload: AuditEventPayload) {
  try {
    await addDoc(collection(db, "auditEvents"), {
      ...payload,
      createdAt: serverTimestamp(),
      page: payload.page || (typeof window !== "undefined" ? window.location.pathname : undefined),
    });
  } catch (error) {
    console.error("Failed to persist audit event", error);
  }
}

export async function logAuditEvent(
  eventName: CriticalEventName,
  options: {
    context?: AuditEventContext;
    consent: ConsentState;
    analytics?: Analytics | null;
  }
) {
  const { consent, analytics, context } = options;
  const consentGranted = consent === "granted";

  if (consentGranted && analytics) {
    logEvent(analytics, eventName as string, {
      event_category: "audit",
      event_label: context?.label,
      plan: context?.plan,
      pathway: context?.pathway,
      entry_point: context?.entryPoint,
      exercise_count: context?.exerciseCount,
      error_message: context?.errorMessage,
    });
  }

  if (consentGranted) {
    await persistAuditEvent({
      eventName,
      context,
      consent,
      page: typeof window !== "undefined" ? window.location.pathname : undefined,
    });
  }
}

export function hydrateAnalyticsWithConsent(consent: ConsentState): Analytics | null {
  if (consent !== "granted") return null;
  return getAnalyticsInstance();
}

export type { ConsentState };
