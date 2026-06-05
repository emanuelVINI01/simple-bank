"use client";

import { createContext, type PropsWithChildren, useCallback, useContext, useMemo, useState } from "react";
import { dictionaries, type DictionaryKey, type Locale } from "@/src/i18n/dictionaries";

type TranslateParams = Record<string, string | number>;

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: DictionaryKey, params?: TranslateParams) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function detectLocale(): Locale {
  if (typeof navigator === "undefined") return "pt-BR";
  const lang = navigator.language ?? "pt-BR";
  if (lang.startsWith("pt")) return "pt-BR";
  return "en";
}

export function I18nProvider({ children, initialLocale }: PropsWithChildren<{ initialLocale?: Locale }>) {
  const [locale, setLocale] = useState<Locale>(initialLocale ?? detectLocale());

  const t = useCallback(
    (key: DictionaryKey, params?: TranslateParams) => translate(locale, key, params),
    [locale],
  );

  const value = useMemo<I18nContextValue>(() => ({ locale, setLocale, t }), [locale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used inside I18nProvider.");
  return context;
}

export function translate(locale: Locale, key: DictionaryKey, params?: TranslateParams) {
  const template: string = (dictionaries[locale] as Record<string, string>)[key] ?? key;
  if (!params) return template;
  return Object.entries(params).reduce<string>(
    (text, [k, v]) => text.replace(new RegExp(`\\{${k}\\}`, "g"), String(v)),
    template,
  );
}
