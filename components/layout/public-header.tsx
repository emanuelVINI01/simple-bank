"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import { useI18n } from "@/src/i18n/provider";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

export function PublicHeader() {
  const { t } = useI18n();

  return (
    <>
      <motion.header
        initial={{ y: -48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="sticky top-0 z-40 border-b border-[var(--border)]/50 bg-[var(--bg)]/90 px-4 py-3 backdrop-blur-xl sm:px-6"
      >
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-between gap-3">
          <Link href="/" className="group flex min-w-0 items-center gap-3">
            <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-xl border border-[var(--accent)]/35 shadow-lg shadow-black/20 transition-colors group-hover:border-[var(--info)]/45">
              <Image src="/brand-logo.png" alt="Simple Bank logo" fill sizes="32px" className="object-cover" />
            </span>
            <span className="hidden truncate text-sm font-bold text-[var(--fg)] sm:block">
              {t("app.name")}
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              href="/login"
              className="btn-primary-cta hidden h-9 items-center justify-center gap-2 px-4 text-xs font-bold sm:inline-flex"
            >
              {t("auth.login")}
              <LogIn className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </motion.header>

      {/* ─── Mobile Bottom Nav ─── */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border)]/80 bg-[var(--bg)]/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.55rem)] pt-2 shadow-[0_-16px_34px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:hidden">
        <div className="mx-auto grid h-14 max-w-md grid-cols-2 items-stretch gap-2">
          <Link
            href="/login"
            className="relative flex h-full min-w-0 flex-col items-center justify-center rounded-xl px-2 py-2 text-[10px] font-semibold text-[var(--fg-muted)] transition-colors hover:text-[var(--info)]"
          >
            {t("auth.login")}
          </Link>
          <Link
            href="/register"
            className="flex h-full items-center justify-center rounded-xl btn-primary-cta text-[11px] font-bold"
          >
            {t("auth.register.cta")}
          </Link>
        </div>
      </nav>
    </>
  );
}
