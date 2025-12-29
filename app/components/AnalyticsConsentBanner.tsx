"use client";

import { useEffect, useState } from "react";
import { useAnalytics } from "./AnalyticsProvider";
import { useTranslations } from "./LocalizationProvider";

export default function AnalyticsConsentBanner() {
  const { consent, grantConsent, denyConsent, ready } = useAnalytics();
  const { t } = useTranslations();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (ready && consent === "unknown") {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [consent, ready]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 flex justify-center z-50 px-4">
      <div className="max-w-3xl w-full bg-card border border-divider shadow-lg rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1 text-sm text-foreground">
          <p className="font-semibold text-base mb-1">{t("analytics.title")}</p>
          <p className="opacity-80">
            {t("analytics.body")}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:min-w-[260px]">
          <button
            className="px-4 py-2 rounded-lg border border-divider text-foreground hover:bg-primary-light transition"
            onClick={() => {
              denyConsent();
              setVisible(false);
            }}
          >
            {t("analytics.decline")}
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-primary text-button font-semibold hover:bg-primary-hover transition"
            onClick={() => {
              grantConsent();
              setVisible(false);
            }}
          >
            {t("analytics.allow")}
          </button>
        </div>
      </div>
    </div>
  );
}
