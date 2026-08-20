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
        <div className="glass-surface min-w-0 rounded-2xl p-5 sm:p-6">
          {children}
        </div>
      </section>
    </main>
  );
}
