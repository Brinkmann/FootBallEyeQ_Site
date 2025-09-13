"use client";
import { useMemo, useState, useEffect } from "react";
import QRCode from "qrcode";

type Props = {
  exercises: string[];
  idByName: Record<string, number>;
  weekLabel?: string;
  buttonText?: string;
  className?: string;
  weekNumber?: number;
};

// ------------------- TEMP TEST MODE -------------------
const ALLOW_SHORT_SESSIONS = true;           // ← set to false to restore EXACTLY 5
const REQUIRED_COUNT = ALLOW_SHORT_SESSIONS ? 1 : 5;
// -----------------------------------------------------

const pad2 = (n: number) => String(n).padStart(2, "0");

function makeCode(names: string[], idByName: Record<string, number>): string {
  if (!Array.isArray(names) || names.length < REQUIRED_COUNT) {
    throw new Error(
      REQUIRED_COUNT === 5
        ? "Select exactly 5 exercises"
        : `Select at least ${REQUIRED_COUNT} exercise${REQUIRED_COUNT > 1 ? "s" : ""}`
    );
  }

  const ids = names.map((n) => {
    const id = idByName[n];
    if (!Number.isInteger(id) || id < 1 || id > 20) {
      throw new Error(`Unknown exercise: "${n}" (no ID mapping)`);
    }
    return id;
  });

  // Distinctness: in test mode require all selected to be distinct; in normal mode still enforces 5 distinct
  if (new Set(ids).size !== ids.length) {
    throw new Error("Exercises must be distinct");
  }

  // For testing this works with any length (2 digits per exercise)
  return ids.map(pad2).join("");
}

export default function SessionCodeButton({
  exercises,
  idByName,
  weekLabel,
  buttonText = "Session Code",
  className = "",
  weekNumber,
}: Props) {
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  // In test mode allow >= 1; normal mode requires exactly 5
  const canGenerate = ALLOW_SHORT_SESSIONS
    ? exercises.length >= REQUIRED_COUNT
    : exercises.length === REQUIRED_COUNT;

    
  const code = useMemo(() => {
  if (!canGenerate) return null;
  try {
    return makeCode(exercises, idByName);
  } catch (e: unknown) {
    if (typeof e === "object" && e !== null && "message" in e) {
      setErr((e as { message: string }).message);
      if (typeof window !== "undefined") {
        console.error("makeCode failed", { exercises, error: (e as { message: string }).message });
      }
    } else {
      setErr("Could not generate code");
      if (typeof window !== "undefined") {
        console.error("makeCode failed", { exercises, error: e });
      }
    }
    return null;
  }
}, [exercises, idByName, canGenerate]);


  useEffect(() => {
    let active = true;
    (async () => {
      if (!code) {
        setQrDataUrl(null);
        return;
      }

      const origin =
        typeof window !== "undefined" ? window.location.origin : "http://192.168.1.1";

      const wk =
        typeof weekNumber === "number"
          ? weekNumber
          : (weekLabel && Number.parseInt(weekLabel.replace(/\D/g, ""), 10)) || undefined;

      const urlForScan = `${origin}/s/${code}` + (wk ? `?week=${wk}` : "");

      try {
        const url = await QRCode.toDataURL(urlForScan, { width: 220, margin: 1 });
        if (active) setQrDataUrl(url);
      } catch {
        if (active) setQrDataUrl(null);
      }
    })();
    return () => {
      active = false;
    };
  }, [code, weekNumber, weekLabel]);

  const handleOpen = () => {
    setErr(null);
    if (!canGenerate) {
      setErr(
        REQUIRED_COUNT === 5
          ? "Select exactly 5 exercises for this week."
          : `Select at least ${REQUIRED_COUNT} exercise${REQUIRED_COUNT > 1 ? "s" : ""} for this week.`
      );
      return;
    }
    setOpen(true);
  };

  const copy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
    } catch {}
  };

  const helperTitle =
    REQUIRED_COUNT === 5
      ? "Select exactly 5 exercises"
      : `Select at least ${REQUIRED_COUNT} exercise${REQUIRED_COUNT > 1 ? "s" : ""}`;

  return (
    <>
      <button
        onClick={handleOpen}
        disabled={!canGenerate}
        className={`px-3 py-1.5 rounded text-white text-sm ${
          canGenerate ? "bg-green-600 hover:bg-green-500" : "bg-gray-300 cursor-not-allowed"
        } ${className}`}
        title={canGenerate ? "Show session code" : helperTitle}
      >
        {buttonText}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-base font-semibold">
                {weekLabel ? `${weekLabel} — ` : ""}Session Code
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-4">
              {err && (
                <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-2">
                  {err}
                </div>
              )}

              <div>
                <div className="text-gray-600 text-sm">Exercises (order):</div>
                <div className="text-sm">
                  {exercises.length ? exercises.join("  ·  ") : "No exercises selected"}
                </div>
              </div>

              {code && (
                <>
                  <div>
                    <div className="text-gray-600 text-sm">Session Code ({code.length}-digit):</div>
                    <div className="font-mono text-2xl break-all">{code}</div>
                  </div>

                  {qrDataUrl && (
                    <div className="mt-2 flex justify-center">
                      <img src={qrDataUrl} alt="Session code QR" className="h-40 w-40" />
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={copy}
                      className="px-3 py-1.5 rounded bg-blue-600 text-white text-sm hover:bg-blue-500"
                    >
                      Copy
                    </button>
                    <button
                      onClick={() => setOpen(false)}
                      className="px-3 py-1.5 rounded bg-gray-100 text-sm hover:bg-gray-200"
                    >
                      Close
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
