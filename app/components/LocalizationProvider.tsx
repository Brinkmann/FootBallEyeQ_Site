"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Locale,
  defaultLocale,
  localeNames,
  messages,
  supportedLocales,
} from "../localization/translations";

interface TranslationContextValue {
  locale: Locale;
  setLocale: (locale: string) => void;
  t: (key: string, fallback?: string, variables?: Record<string, string | number>) => string;
  formatDate: (value: Date, options?: Intl.DateTimeFormatOptions) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatCurrency: (
    value: number,
    currency?: string,
    options?: Intl.NumberFormatOptions,
  ) => string;
  localeNames: Record<Locale, string>;
}

const LocalizationContext = createContext<TranslationContextValue | undefined>(undefined);

function normalizeLocale(candidate: string | null): Locale {
  if (candidate) {
    const shortCode = candidate.split("-")[0] as Locale;
    if (supportedLocales.includes(shortCode)) {
      return shortCode;
    }
  }
  return defaultLocale;
}

function interpolate(template: string, variables?: Record<string, string | number>): string {
  if (!variables) return template;
  return Object.keys(variables).reduce((result, key) => {
    return result.replaceAll(`{${key}}`, String(variables[key]));
  }, template);
}

function getMessage(locale: Locale, key: string, fallback?: string): string {
  const localeMessages = messages[locale] ?? messages[defaultLocale];
  const value = localeMessages[key] ?? messages[defaultLocale][key] ?? fallback;
  return value ?? key;
}

const LOCALE_STORAGE_KEY = "football-eyeq-locale";

export function LocalizationProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    const savedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    const storedLocale = savedLocale ? normalizeLocale(savedLocale) : null;
    const browserLocale = normalizeLocale(navigator.language);
    const nextLocale = storedLocale ?? browserLocale ?? defaultLocale;
    setLocaleState(nextLocale);
  }, []);

  const setLocale = useCallback((candidate: string) => {
    const normalized = normalizeLocale(candidate);
    setLocaleState(normalized);
    window.localStorage.setItem(LOCALE_STORAGE_KEY, normalized);
  }, []);

  const t = useCallback(
    (key: string, fallback?: string, variables?: Record<string, string | number>) => {
      const value = getMessage(locale, key, fallback);
      return interpolate(value, variables);
    },
    [locale]
  );

  const formatDate = useCallback(
    (value: Date, options?: Intl.DateTimeFormatOptions) => {
      return new Intl.DateTimeFormat(locale, options).format(value);
    },
    [locale]
  );

  const formatNumber = useCallback(
    (value: number, options?: Intl.NumberFormatOptions) => {
      return new Intl.NumberFormat(locale, options).format(value);
    },
    [locale]
  );

  const formatCurrency = useCallback(
    (value: number, currency = "USD", options?: Intl.NumberFormatOptions) => {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        ...options,
      }).format(value);
    },
    [locale]
  );

  const value = useMemo(
    () => ({ locale, setLocale, t, formatDate, formatNumber, formatCurrency, localeNames }),
    [formatCurrency, formatDate, formatNumber, locale, setLocale, t]
  );

  return <LocalizationContext.Provider value={value}>{children}</LocalizationContext.Provider>;
}

export function useTranslations() {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error("useTranslations must be used within a LocalizationProvider");
  }
  return context;
}
