"use client";

import { useEffect, useState } from "react";

export type ContactFormPayload = {
  name: string;
  email: string;
  organization: string;
  role: string;
  message: string;
};

type QueuedContact = {
  id: string;
  payload: ContactFormPayload;
  attempts: number;
  lastError?: string;
};

type RetryOptions = {
  retries?: number;
  baseDelay?: number;
  jitter?: number;
  simulateSlow?: boolean;
};

type QueueResult = {
  sent: number;
  failed: number;
  remaining: number;
};

const CONTACT_QUEUE_KEY = "contactQueue";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const readQueue = (): QueuedContact[] => {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(CONTACT_QUEUE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed as QueuedContact[];
    }
  } catch (error) {
    console.error("Failed to parse contact queue", error);
  }
  return [];
};

const writeQueue = (queue: QueuedContact[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(CONTACT_QUEUE_KEY, JSON.stringify(queue));
};

export const useNetworkSimulation = () => {
  const [simulateSlow, setSimulateSlow] = useState(false);
  const [simulateOffline, setSimulateOffline] = useState(false);
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return {
    simulateSlow,
    setSimulateSlow,
    simulateOffline,
    setSimulateOffline,
    isOnline,
    effectiveOffline: simulateOffline || !isOnline,
  };
};

export const retryWithBackoff = async <T>(
  operation: () => Promise<T>,
  options?: RetryOptions
): Promise<T> => {
  const retries = options?.retries ?? 3;
  const baseDelay = options?.baseDelay ?? 600;
  const jitter = options?.jitter ?? 150;
  const shouldSimulateSlow = options?.simulateSlow ?? false;

  let attempt = 0;
  while (true) {
    try {
      if (shouldSimulateSlow) {
        await sleep(700 + Math.random() * 600);
      }
      return await operation();
    } catch (error) {
      attempt += 1;
      if (attempt > retries) {
        throw error;
      }
      const delay = baseDelay * 2 ** (attempt - 1) + Math.random() * jitter;
      await sleep(delay);
    }
  }
};

export const sendContactWithRetry = async (
  payload: ContactFormPayload,
  options?: RetryOptions
) =>
  retryWithBackoff(
    async () => {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      return data;
    },
    options
  );

export const enqueueContact = (payload: ContactFormPayload) => {
  const queue = readQueue();
  const entry: QueuedContact = {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    payload,
    attempts: 0,
  };
  queue.push(entry);
  writeQueue(queue);
  return entry;
};

export const getQueuedContacts = (): QueuedContact[] => readQueue();

export const processQueuedContacts = async (
  options?: RetryOptions & { maxAttempts?: number }
): Promise<QueueResult> => {
  if (typeof window === "undefined") {
    return { sent: 0, failed: 0, remaining: 0 };
  }

  const queue = readQueue();
  if (!queue.length) {
    return { sent: 0, failed: 0, remaining: 0 };
  }

  const maxAttempts = options?.maxAttempts ?? 4;
  const remaining: QueuedContact[] = [];
  let sent = 0;
  let failed = 0;

  for (const entry of queue) {
    try {
      await sendContactWithRetry(entry.payload, options);
      sent += 1;
    } catch (error) {
      const attempts = entry.attempts + 1;
      if (attempts >= maxAttempts) {
        failed += 1;
        console.error("Dropping queued contact after repeated failures", error);
      } else {
        remaining.push({ ...entry, attempts, lastError: (error as Error)?.message });
      }
    }
  }

  writeQueue(remaining);
  return { sent, failed, remaining: remaining.length };
};
