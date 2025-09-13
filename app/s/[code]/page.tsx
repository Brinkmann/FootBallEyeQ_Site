"use client";
import { useEffect, useMemo, useState } from "react";
import { exercises  } from "../../data/exercises";

type PageProps = {
  params: { code: string };                 // /s/0102030405
  searchParams?: { week?: string };         // ?week=4
};

const ID_BY_ID = exercises.reduce<Record<number, string>>((a, e) => {
  a[e.id] = e.title;       // use 'title', not 'name'
  return a;
}, {});

const pad2 = (n: number) => String(n).padStart(2, "0");

function decodeCode(raw: string): number[] | null {
  const digits = (raw || "").replace(/\D/g, "");
  if (digits.length !== 10) return null;
  const ids: number[] = [];
  for (let i = 0; i < 10; i += 2) {
    const id = parseInt(digits.slice(i, i + 2), 10);
    if (!(id >= 1 && id <= 20)) return null;
    ids.push(id);
  }
  if (new Set(ids).size !== 5) return null;
  return ids;
}

export default function SessionLanding({
  params,
  searchParams,
}: {
  params: { code: string };
  searchParams?: { week?: string };
}) {
  const [open, setOpen] = useState(true);
  const weekNum = searchParams?.week ? parseInt(searchParams.week, 10) : undefined;

  const ids = useMemo(() => decodeCode(params.code), [params.code]);
  const names = useMemo(() => (ids ? ids.map(id => ID_BY_ID[id] || `Drill ${pad2(id)}`) : []), [ids]);

  const controllerHref = useMemo(
    () => (ids ? `http://192.168.1.1/#S=${params.code}` : "http://192.168.1.1/"),
    [ids, params.code]
  );

  useEffect(() => { setOpen(true); }, [params.code]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple page background — modal opens automatically */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          {/* Dialog */}
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <h1 className="text-base font-semibold">
                {weekNum ? `This is your session code for Week ${weekNum}` : "This is your session code"}
              </h1>
              <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-700" aria-label="Close">✕</button>
            </div>

            <div className="p-5 space-y-4">
              {ids ? (
                <>
                  {/* Big code */}
                  <div className="text-gray-600 text-sm">Code</div>
                  <div className="font-mono text-4xl sm:text-5xl tracking-wider">{params.code}</div>

                  {/* List of exercises */}
                  <div>
                    <div className="text-gray-600 text-sm mb-1">Exercises (order)</div>
                    <ol className="list-decimal pl-5 text-sm text-gray-800 space-y-0.5">
                      {names.map((n, i) => (
                        <li key={i}>{pad2(ids[i])} — {n}</li>
                      ))}
                    </ol>
                  </div>

                  {/* Connect button */}
                  <a
                    href={controllerHref}
                    className="inline-block px-4 py-2 rounded bg-green-600 text-white text-sm hover:bg-green-500"
                  >
                    Connect to 192.168.1.1 and use this code
                  </a>

                  <div className="text-xs text-gray-500">
                    Tip: connect to the <span className="font-medium">FEQ-HUB</span> Wi-Fi first. The controller page
                    can auto-read the code from the URL hash.
                  </div>
                </>
              ) : (
                <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-3">
                  Invalid session code.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Non-modal fallback display (optional) */}
      <div className="p-6 max-w-xl mx-auto text-center text-gray-500">
        {ids
          ? "If the dialog is closed, refresh or re-scan the QR to show it again."
          : "Invalid code in URL. Re-scan a valid session QR."}
      </div>
    </div>
  );
}
