"use client";

import { useTranslations } from "./LocalizationProvider";
import { supportedLocales } from "../localization/translations";

export default function LanguageSwitcher() {
  const { locale, setLocale, t, localeNames } = useTranslations();

  return (
    <label className="flex items-center gap-2 text-sm text-gray-700" aria-label={t("common.languageLabel")}> 
      <span className="hidden sm:inline font-medium">{t("common.languageLabel")}</span>
      <select
        className="rounded-md border border-gray-300 px-2 py-1 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary"
        value={locale}
        onChange={(event) => setLocale(event.target.value)}
      >
        {supportedLocales.map((option) => (
          <option key={option} value={option}>
            {localeNames[option]}
          </option>
        ))}
      </select>
    </label>
  );
}
