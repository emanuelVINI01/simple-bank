"use client";

import { Flag, type LocaleCode } from "@/components/ui/flag";
import type { Locale } from "@/src/i18n/dictionaries";
import { useI18n } from "@/src/i18n/provider";

export function localeToFlagCode(locale: Locale): LocaleCode {
  return locale === "pt-BR" ? "pt" : "en";
}

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale, t } = useI18n();
  const next: Locale = locale === "pt-BR" ? "en" : "pt-BR";

  return (
    <button
      type="button"
      onClick={() => setLocale(next)}
      className={`lang-toggle ${className}`}
      aria-label="Toggle language"
    >
      <Flag locale={localeToFlagCode(next)} className="h-3 w-4" />
      {t("lang.toggle")}
    </button>
  );
}
