"use client";

import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";

type Props = {
  exercises: string[];
  idByName: Record<string, number>;
  weekLabel?: string;
  buttonText?: string;
  className?: string;
};

const pad2 = (n: number) => String(n).padStart(2, "0");

function makeCode(names: string[], idByName: Record<string, number>): string {
  console.log("🏗️ makeCode called with:");
  console.log("  names:", names);
  console.log("  idByName:", idByName);

  if (!Array.isArray(names) || names.length === 0) {
    throw new Error("Select at least 1 exercise");
  }

  const ids = names.map((name, index) => {
    console.log(`  Processing ${index + 1}. "${name}"`);
    const id = idByName[name];
    console.log(`    Found ID: ${id}`);
    
    if (!id || id < 1) {
      throw new Error(`Unknown exercise: "${name}"`);
    }
    return id;
  });

  console.log("  All IDs:", ids);

  // Check for duplicates
  if (new Set(ids).size !== ids.length) {
    throw new Error("Exercises must be distinct");
  }

  const result = ids.map(pad2).join("");
  console.log("  Final concatenated string:", result);
  
  return result;
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
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  const canGenerate = exercises.length >= 1;

  useEffect(() => {
    setErr(null);

    if (!canGenerate) {
      setCode(null);
      return;
    }

    try {
      console.log("🔍 DEBUG - Starting code generation:");
      console.log("Exercises:", exercises);
      console.log("ID mapping:", idByName);
      
      const built = makeCode(exercises, idByName);
      console.log("Generated code:", built);
      setCode(built);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Could not generate code";
      console.error("❌ Code generation failed:", e);
      setErr(msg);
      setCode(null);
    }
  }, [exercises, idByName, canGenerate]);

  // Generate QR code
  useEffect(() => {
    let active = true;

    (async () => {
      if (!code) {
        setQrDataUrl(null);
        return;
      }

      console.log("📱 Generating QR for code:", code);

      try {
        const url = await QRCode.toDataURL(code, { 
          width: 220, 
          margin: 1,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        if (active) {
          console.log("✅ QR code generated successfully");
          setQrDataUrl(url);
        }
      } catch (error) {
        console.error("❌ QR generation failed:", error);
        if (active) setQrDataUrl(null);
      }
    })();

    return () => {
      active = false;
    };
  }, [code]);

  const handleOpen = () => {
    setErr(null);
    if (!canGenerate) {
      setErr("Select at least 1 exercise for this week.");
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
        className={`px-3 py-1.5 rounded text-white text-sm ${
          canGenerate ? "bg-green-600 hover:bg-green-500" : "bg-gray-300 cursor-not-allowed"
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
                    <div className="text-gray-600 text-sm">
                      Session Code ({code.length}-digit):
                    </div>
                    <div className="font-mono text-2xl break-all bg-gray-100 p-3 rounded border">
                      {code}
                    </div>
                  </div>

                  {qrDataUrl && (
                    <div className="mt-4 flex justify-center">
                      <div className="bg-white p-4 rounded-lg border">
                        <img src={qrDataUrl} alt="Session code QR" className="h-48 w-48" />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={copy}
                      className="px-3 py-1.5 rounded bg-blue-600 text-white text-sm hover:bg-blue-500"
                    >
                      Copy Code
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