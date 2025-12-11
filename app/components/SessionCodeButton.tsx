"use client";

import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react"; // React QR generator
import Image from "next/image";
import { encodeSessionCode } from "../utils/sessionCode";

type Props = {
  exercises: string[];
  idByName: Record<string, number>;
  weekLabel?: string;
  buttonText?: string;
  className?: string;
};

function makeCode(names: string[], idByName: Record<string, number>): string {
  if (!Array.isArray(names) || names.length === 0) {
    throw new Error("Select at least 1 exercise");
  }

  const ids = names.map((name) => {
    const id = idByName[name];
    if (!id || id < 1) throw new Error(`Unknown exercise: "${name}"`);
    return id;
  });

  if (new Set(ids).size !== ids.length) {
    throw new Error("Exercises must be distinct");
  }

  const sorted = [...ids].sort((a, b) => a - b);
  const patternString = sorted.map((id) => id.toString().padStart(2, "0")).join("");

  return encodeSessionCode(patternString);
}

export default function SessionCodeButton({
  exercises,
  idByName,
  weekLabel,
  buttonText = "Session Code",
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);

  const canGenerate = exercises.length >= 1;

  useEffect(() => {
    setErr(null);
    if (!canGenerate) {
      setCode(null);
      return;
    }
    try {
      const built = makeCode(exercises, idByName);
      setCode(built);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Could not generate code";
      setErr(msg);
      setCode(null);
    }
  }, [exercises, idByName, canGenerate]);

  const sortedExercises = [...exercises].sort((a, b) => {
    const idA = idByName[a];
    const idB = idByName[b];
    if (idA && idB && idA !== idB) return idA - idB;
    return a.localeCompare(b);
  });

  const handleOpen = () => {
    setErr(null);
    if (!canGenerate) {
      setErr("Select at least 1 exercise for this session.");
      return;
    }
    setOpen(true);
  };

  const copy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // ignore
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        disabled={!canGenerate}
        className={`px-3 py-1.5 rounded text-sm ${
          canGenerate
            ? "bg-primary text-button bg-primary-hover"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        } ${className}`}
        title={canGenerate ? "Show session code" : "Select at least 1 exercise"}
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
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-card shadow-lg border border-divider">
            <div className="flex items-center justify-between p-4 border-b border-divider">
              <h3 className="text-base font-semibold text-foreground">
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
                <div className="text-gray-500 text-sm">Exercises (sorted):</div>
                <div className="text-sm text-foreground">
                  {sortedExercises.length
                    ? sortedExercises.join("  ·  ")
                    : "No exercises selected"}
                </div>
              </div>

              {code && (
                <>
                  <div>
                    <div className="text-gray-500 text-sm">Session Code (6 characters):</div>
                    <div className="font-mono text-2xl break-all bg-background p-3 rounded border border-divider text-foreground">
                      {code}
                    </div>
                  </div>

                  {/* Use QRCodeCanvas instead of <img> */}
                  <div className="mt-4 flex justify-center">
                    <div className="bg-white p-4 rounded-lg border border-divider">
                      <QRCodeCanvas value={code} size={192} includeMargin />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={copy}
                      className="px-3 py-1.5 rounded bg-primary text-button text-sm bg-primary-hover"
                    >
                      Copy Code
                    </button>
                    <button
                      onClick={() => setOpen(false)}
                      className="px-3 py-1.5 rounded bg-background text-sm text-foreground hover:bg-primary-light"
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