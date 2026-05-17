"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Home, KeyRound, LayoutDashboard, LogOut, RadioTower, ReceiptText } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Ledger", icon: ReceiptText },
  { href: "/payment-keys", label: "Keys", icon: KeyRound },
];

export function AppHeader({ apiStatus = "online" }: { apiStatus?: "online" | "checking" }) {
  const { logout, user } = useAuth();
  const pathname = usePathname();

  return (
    <>
      <motion.header
        initial={{ y: -48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="sticky top-0 z-40 border-b border-[var(--dracula-border)]/70 bg-[var(--dracula-bg)]/88 px-4 py-3 backdrop-blur-xl sm:px-6"
      >
        <div className="mx-auto flex h-11 max-w-7xl items-center justify-between gap-3">
          <Link href="/" className="group flex min-w-0 items-center gap-3">
            <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-[var(--dracula-purple)]/40 shadow-lg shadow-black/20 transition-colors group-hover:border-[var(--dracula-cyan)]/50">
              <Image src="/brand-logo.png" alt="Simple Bank logo" fill sizes="40px" className="object-cover" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold text-[var(--dracula-fg)]">Simple Bank</span>
              <span className="hidden text-xs text-[var(--dracula-comment)] sm:block">Next.js transactional API</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-2 lg:flex">
            {navItems.map(({ href, icon: Icon, label }) => {
              const isActive = pathname === href;

              return (
                <Link
                  key={href}
                  href={href}
                  className={`chip-btn relative inline-flex h-10 items-center gap-2 px-3 text-sm ${
                    isActive ? "border-[var(--dracula-cyan)]/45 text-[var(--dracula-fg)]" : ""
                  }`}
                >
                  <Icon className="h-4 w-4 text-[var(--dracula-cyan)]" />
                  {label}
                  {isActive && (
                    <motion.span
                      layoutId="wallet-desktop-nav-active"
                      className="absolute -bottom-2 left-3 right-3 h-0.5 rounded-full bg-[var(--dracula-cyan)] shadow-[0_0_10px_rgba(139,233,253,0.75)]"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="chip-btn hidden items-center gap-2 px-3 py-2 text-xs sm:inline-flex">
              <RadioTower className="h-3.5 w-3.5 text-[var(--dracula-green)]" />
              API {apiStatus}
            </span>
            <span className="hidden max-w-[180px] truncate text-sm text-[var(--dracula-comment)] md:block">{user?.email}</span>
            <button
              onClick={() => void logout()}
              className="chip-btn inline-flex h-10 items-center justify-center gap-2 px-3 text-sm"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </motion.header>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--dracula-border)]/80 bg-[var(--dracula-bg)]/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.55rem)] pt-2 shadow-[0_-16px_34px_rgba(0,0,0,0.35)] backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid h-16 max-w-md grid-cols-4 items-stretch gap-0.5 sm:gap-1">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`relative flex h-full min-w-0 flex-col items-center justify-between rounded-xl px-0.5 py-1.5 text-[9px] font-semibold uppercase tracking-tight transition-colors sm:px-1 sm:text-[10px] ${
                  isActive ? "text-[var(--dracula-fg)]" : "text-[var(--dracula-comment)] hover:text-[var(--dracula-cyan)]"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="wallet-mobile-nav-pill"
                    className="absolute inset-0 rounded-xl border border-[var(--dracula-purple)]/35 bg-[var(--dracula-surface)] shadow-lg shadow-black/25"
                    transition={{ type: "spring", stiffness: 430, damping: 36 }}
                  />
                )}
                <span
                  className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-lg transition-colors sm:h-7 sm:w-7 ${
                    isActive ? "bg-[var(--dracula-purple)]/15 text-[var(--dracula-purple)]" : "text-[var(--dracula-comment)]"
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
