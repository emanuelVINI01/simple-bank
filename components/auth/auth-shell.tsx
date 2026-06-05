import Link from "next/link";
import Image from "next/image";
import { CheckCircle } from "lucide-react";
import type { DictionaryKey } from "@/src/i18n/dictionaries";
import { useI18n } from "@/src/i18n/provider";

export function AuthShell({
  children,
  eyebrowKey,
  titleKey,
  subtitleKey,
}: {
  children: React.ReactNode;
  eyebrowKey: Parameters<ReturnType<typeof useI18n>["t"]>[0];
  titleKey: Parameters<ReturnType<typeof useI18n>["t"]>[0];
  subtitleKey: Parameters<ReturnType<typeof useI18n>["t"]>[0];
}) {
  const { t } = useI18n();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-5 sm:py-12">
      <div className="grid-noise absolute inset-0 opacity-80" />
      <section className="relative z-10 grid w-full max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="hidden lg:block">
          <Link href="/" className="mb-10 inline-flex items-center gap-3">
            <span className="relative h-12 w-12 overflow-hidden rounded-2xl border border-white/10 shadow-lg shadow-purple-950/40">
              <Image src="/brand-logo.png" alt="Simple Bank logo" fill sizes="48px" className="object-cover" />
            </span>
            <span className="font-bold text-white text-xl">{t("app.name")}</span>
          </Link>
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#8be9fd]">{t(eyebrowKey)}</p>
          <h1 className="mt-4 max-w-xl text-5xl font-black leading-tight text-white">{t(titleKey)}</h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-[#8892a4]">{t(subtitleKey)}</p>
          <div className="mt-10 grid max-w-lg gap-4 sm:grid-cols-2">
            {[
              "auth.benefits.security",
              "auth.benefits.speed",
              "auth.benefits.audit",
              "auth.benefits.free",
            ].map((key) => (
              <div key={key} className="flex items-center gap-3 text-sm font-semibold text-[#f8f8f2]">
                <CheckCircle className="h-5 w-5 text-[#50fa7b]" />
                {t(key as DictionaryKey)}
              </div>
            ))}
          </div>
        </div>
        <Link href="/" className="mb-2 inline-flex min-w-0 items-center gap-3 lg:hidden">
          <span className="relative h-10 w-10 overflow-hidden rounded-lg border border-[var(--dracula-purple)]/40 shadow-lg shadow-black/20">
            <Image src="/brand-logo.png" alt="Simple Bank logo" fill sizes="40px" className="object-cover" />
          </span>
          <span className="min-w-0 truncate font-bold text-white text-lg">{t("app.name")}</span>
        </Link>
        <div className="glass-surface min-w-0 rounded-2xl p-6 sm:p-8">
          {children}
        </div>
      </section>
    </main>
  );
}
