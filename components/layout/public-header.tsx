"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Globe, LogIn } from "lucide-react";
import { useI18n } from "@/src/i18n/provider";
import type { Locale } from "@/src/i18n/dictionaries";

function LangToggle() {
  const { locale, setLocale, t } = useI18n();
  const next: Locale = locale === "pt-BR" ? "en" : "pt-BR";
  return (
    <button className="lang-toggle" onClick={() => setLocale(next)} aria-label="Toggle language">
      <Globe className="h-3 w-3" />
      <span className="hidden sm:inline">{t("lang.toggle")}</span>
    </button>
  );
}

export function PublicHeader() {
  const { t } = useI18n();

  return (
    <>
      <motion.header
        initial={{ y: -48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="sticky top-0 z-40 border-b border-[var(--dracula-border)]/50 bg-[var(--dracula-bg)]/90 px-4 py-3 backdrop-blur-xl sm:px-6"
      >
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-between gap-3">
          <Link href="/" className="group flex min-w-0 items-center gap-3">
            <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-xl border border-[var(--dracula-purple)]/35 shadow-lg shadow-black/20 transition-colors group-hover:border-[var(--dracula-cyan)]/45">
              <Image src="/brand-logo.png" alt="Simple Bank logo" fill sizes="32px" className="object-cover" />
            </span>
            <span className="hidden truncate text-sm font-bold text-[var(--dracula-fg)] sm:block">
              {t("app.name")}
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <LangToggle />
            <Link
              href="/login"
              className="btn-bet hidden h-9 items-center justify-center gap-2 px-4 text-xs font-bold sm:inline-flex"
            >
              {t("auth.login")}
              <LogIn className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </motion.header>

      {/* ─── Mobile Bottom Nav ─── */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--dracula-border)]/80 bg-[var(--dracula-bg)]/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.55rem)] pt-2 shadow-[0_-16px_34px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:hidden">
        <div className="mx-auto grid h-14 max-w-md grid-cols-2 items-stretch gap-2">
          <Link
            href="/login"
            className="relative flex h-full min-w-0 flex-col items-center justify-center rounded-xl px-2 py-2 text-[10px] font-semibold text-[var(--dracula-comment)] transition-colors hover:text-[var(--dracula-cyan)]"
          >
            {t("auth.login")}
          </Link>
          <Link
            href="/register"
            className="flex h-full items-center justify-center rounded-xl btn-bet text-[11px] font-bold"
          >
            {t("auth.register.cta")}
          </Link>
        </div>
      </nav>
    </>
  );
}
