"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-16">
      <div className="max-w-xl text-center space-y-4">
        <div className="text-6xl">💥</div>
        <h1 className="text-3xl font-bold text-foreground">Something went wrong</h1>
        <p className="text-foreground opacity-70">
          An unexpected error occurred. If this keeps happening, save your progress and let us
          know so we can investigate.
        </p>
        <div className="flex flex-col sm:flex-row sm:justify-center gap-3">
          <button
            onClick={reset}
            className="px-4 py-2 bg-primary text-button rounded-lg hover:bg-primary-hover transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-4 py-2 border border-divider text-foreground rounded-lg hover:bg-card"
          >
            Go to homepage
          </Link>
          <Link
            href="/contact"
            className="px-4 py-2 border border-divider text-foreground rounded-lg hover:bg-card"
          >
            Report this issue
          </Link>
        </div>
      </div>
    </div>
  );
}
