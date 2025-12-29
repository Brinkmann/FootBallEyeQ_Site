"use client";

import { useState } from "react";
import { useAnalytics } from "./AnalyticsProvider";

export default function CookiePreferences() {
  const { consent, grantConsent, denyConsent, ready } = useAnalytics();
  const [open, setOpen] = useState(false);

  const statusLabel = consent === "granted" ? "Allowed" : consent === "denied" ? "Declined" : "Pending";
  const statusClass =
    consent === "granted"
      ? "bg-green-100 text-green-700"
      : consent === "denied"
        ? "bg-orange-100 text-orange-700"
        : "bg-gray-100 text-gray-700";

  const handleAllow = () => {
    grantConsent();
    setOpen(false);
  };

  const handleDecline = () => {
    denyConsent();
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className="text-gray-400 hover:text-white text-sm underline decoration-dotted underline-offset-4"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        Cookie Preferences
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative bg-card border border-divider rounded-2xl w-full max-w-2xl p-6 shadow-2xl"
          >
            <div className="flex justify-between items-start gap-3">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Cookie Preferences</h2>
                <p className="text-sm text-foreground/80 mt-1">
                  Control how we use analytics cookies to improve Football EyeQ. Your choice applies across this device and can
                  be changed at any time.
                </p>
              </div>
              <button
                type="button"
                className="text-gray-500 hover:text-foreground"
                aria-label="Close cookie preferences"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-divider bg-muted/60 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">Strictly necessary</p>
                    <p className="text-sm text-foreground/80">
                      Required to operate the site (for example, saving your analytics consent and session details). These
                      cannot be disabled.
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-800 text-gray-200">Always on</span>
                </div>
              </div>

              <div className="rounded-xl border border-divider bg-muted/60 p-4 space-y-2">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">Performance &amp; analytics</p>
                    <p className="text-sm text-foreground/80">
                      Help us understand which features are reliable by recording events like signups, purchases, sharing, and
                      errors. We use privacy-safe analytics and never sell data.
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${statusClass}`}
                  >
                    {statusLabel}
                  </span>
                </div>
                {!ready && (
                  <p className="text-sm text-foreground/60">Loading your preference…</p>
                )}
                {ready && (
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      className="px-4 py-2 rounded-lg border border-divider text-foreground hover:bg-primary-light transition disabled:opacity-60"
                      onClick={handleDecline}
                      disabled={!ready}
                    >
                      Decline analytics
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 rounded-lg bg-primary text-button font-semibold hover:bg-primary-hover transition disabled:opacity-60"
                      onClick={handleAllow}
                      disabled={!ready}
                    >
                      Allow analytics
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 text-xs text-foreground/70">
              Changes take effect immediately. You can review our <a className="underline" href="/privacy">Privacy Policy</a>
              and <a className="underline" href="/terms">Terms of Service</a> for more details.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
