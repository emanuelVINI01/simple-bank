"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Home, KeyRound, LayoutDashboard, LogOut, ReceiptText } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/src/i18n/provider";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

function getInitials(name?: string | null) {
  if (!name) return "SB";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return (parts[0]![0] ?? "S").toUpperCase();
  return ((parts[0]![0] ?? "") + (parts[parts.length - 1]![0] ?? "")).toUpperCase();
}

export function AppHeader() {
  const { logout, user } = useAuth();
  const { t } = useI18n();
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: t("nav.home"), icon: Home },
    { href: "/dashboard", label: t("nav.dashboard"), icon: LayoutDashboard },
    { href: "/transactions", label: t("nav.ledger"), icon: ReceiptText },
    { href: "/payment-keys", label: t("nav.keys"), icon: KeyRound },
  ];

  const initials = getInitials(user?.name);

  return (
    <>
      <motion.header
        initial={{ y: -48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="sticky top-0 z-40 border-b border-[var(--border)]/50 bg-[var(--bg)]/90 px-4 py-3 backdrop-blur-xl sm:px-6"
      >
        <div className="mx-auto flex h-11 max-w-7xl items-center justify-between gap-3">
          <Link href="/" className="group flex min-w-0 items-center gap-3">
            <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl border border-[var(--accent)]/35 shadow-lg shadow-black/20 transition-colors group-hover:border-[var(--info)]/45">
              <Image src="/brand-logo.png" alt="Simple Bank logo" fill sizes="36px" className="object-cover" />
            </span>
            <span className="hidden truncate text-sm font-bold text-[var(--fg)] sm:block">
              {t("app.name")}
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map(({ href, icon: Icon, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`chip-btn relative inline-flex h-9 items-center gap-2 px-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "border-[var(--accent)]/40 bg-[var(--accent)]/8 text-[var(--fg)]"
                      : ""
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-[var(--accent)]" : "text-[var(--fg-muted)]"}`} />
                  {label}
                  {isActive && (
                    <motion.span
                      layoutId="header-nav-indicator"
                      className="absolute -bottom-[13px] left-2 right-2 h-0.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_rgba(80,250,123,0.7)]"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />

            {/* Avatar */}
            <div className="avatar-initials h-8 w-8 text-xs">{initials}</div>

            <button
              onClick={() => void logout()}
              className="chip-btn inline-flex h-9 items-center justify-center gap-2 px-3 text-sm"
              aria-label={t("nav.logout")}
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">{t("nav.logout")}</span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* ─── Mobile Bottom Nav ─── */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border)]/70 bg-[var(--bg)]/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.55rem)] pt-2 shadow-[0_-16px_34px_rgba(0,0,0,0.35)] backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid h-16 max-w-md grid-cols-4 items-stretch gap-0.5 sm:gap-1">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`relative flex h-full min-w-0 flex-col items-center justify-between rounded-xl px-0.5 py-1.5 text-[9px] font-semibold uppercase tracking-tight transition-colors sm:px-1 sm:text-[10px] ${
                  isActive ? "text-[var(--fg)]" : "text-[var(--fg-muted)] hover:text-[var(--accent)]"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="mobile-nav-pill"
                    className="absolute inset-0 rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/8 shadow-lg shadow-black/20"
                    transition={{ type: "spring", stiffness: 430, damping: 36 }}
                  />
                )}
                <span
                  className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-lg transition-colors sm:h-7 sm:w-7 ${
                    isActive ? "text-[var(--accent)]" : "text-[var(--fg-muted)]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="relative z-10 block h-3 max-w-full truncate leading-3">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
