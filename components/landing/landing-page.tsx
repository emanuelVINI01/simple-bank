"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Database,
  Fingerprint,
  GitBranch,
  Home,
  Layers3,
  LockKeyhole,
  LogIn,
  ReceiptText,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  UserPlus,
  WalletCards,
} from "lucide-react";
import { AppFooter } from "@/components/layout/app-footer";

const stack = ["Next.js API routes", "Auth.js v5", "JWT sessions", "PostgreSQL", "Prisma", "TypeScript"];
const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL ?? "https://github.com/emanuelVINI01";

const hardProblems = [
  { icon: Fingerprint, title: "Idempotent transactions", text: "Client-generated request identity prevents duplicate visual commits and models production retry safety." },
  { icon: WalletCards, title: "Wallet ledger", text: "Debit and credit movements are stored as auditable ledger events instead of mutable balances only." },
  { icon: LockKeyhole, title: "Transactional consistency", text: "Next.js route handlers coordinate Prisma transactions around balance checks, debit, credit and transaction creation." },
  { icon: ReceiptText, title: "Auditability", text: "Each movement carries reference IDs, descriptions and timestamps for reconciliation-style inspection." },
  { icon: RefreshCcw, title: "Reconciliation mindset", text: "The UI exposes sent, received, last activity and ledger health signals for operational review." },
  { icon: ShieldCheck, title: "Auth.js JWT", text: "Protected flows use Auth.js v5 credentials, encrypted JWT sessions and the server-side AUTH_SECRET." },
];

export function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="grid-noise pointer-events-none absolute inset-0 opacity-70" />
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-5 sm:px-5 sm:py-6">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="relative h-12 w-12 overflow-hidden rounded-2xl border border-white/10 shadow-lg shadow-purple-950/40">
            <Image src="/brand-logo.png" alt="Simple Bank logo" fill sizes="48px" className="object-cover" priority />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-bold text-white">Simple Bank</span>
            <span className="hidden text-xs text-[#a7b0c8] sm:block">Production-style API demo</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/login" className="chip-btn px-4 py-2 text-sm">Login</Link>
          <Link href="/dashboard" className="btn-bet hidden px-5 py-2.5 text-sm font-bold sm:inline-flex">Open dashboard</Link>
        </div>
      </nav>

      <section className="relative z-10 mx-auto grid max-w-7xl gap-10 px-4 pb-20 pt-8 sm:px-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pt-14">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="chip-btn mb-6 inline-flex max-w-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#8be9fd] sm:tracking-[0.22em]">
            Technical demo for full-stack reliability
          </div>
          <h1 className="max-w-4xl text-4xl font-black leading-[1.02] text-white sm:text-6xl sm:leading-[0.95] lg:text-7xl">
            A fintech-grade ledger app built inside one Next.js project.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[#a7b0c8] sm:text-lg sm:leading-8">
            This technical demo combines Auth.js v5, Prisma, local API route handlers, wallet balances, payment-like transfers and audit-friendly transactions in one deployable Next.js app.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/register" className="btn-bet inline-flex h-13 items-center justify-center gap-2 px-6 text-sm font-bold">
              Try the live bank demo
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a href={githubUrl} target="_blank" rel="noreferrer" className="chip-btn inline-flex h-13 items-center justify-center gap-2 px-6 text-sm font-semibold">
              View technical architecture
              <GitBranch className="h-4 w-4" />
            </a>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {stack.map((item) => (
              <span key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-[#f8f8f2]">
                {item}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }} className="gradient-ring rounded-2xl">
          <div className="game-panel rounded-2xl p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[#8be9fd]">Live ledger mock</p>
                <h2 className="mt-1 text-2xl font-bold text-white">Wallet control plane</h2>
              </div>
              <span className="rounded-full bg-[#50fa7b]/10 px-3 py-1 text-xs font-bold text-[#50fa7b]">healthy</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["Balance", "$12,840", "neon-text-green"],
                ["Sent", "$4,210", "neon-text-pink"],
                ["Received", "$8,630", "neon-text-cyan"],
              ].map(([label, value, className]) => (
                <div key={label} className="glass-surface rounded-xl p-4">
                  <p className="text-xs text-[#a7b0c8]">{label}</p>
                  <p className={`mt-2 text-2xl font-bold ${className}`}>{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-3">
              {["DEBIT reference_82a", "CREDIT reference_82a", "DEBIT retry-safe"].map((item, index) => (
                <div key={item} className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-black/20 px-4 py-3">
                  <span className="flex items-center gap-3 text-sm text-[#f8f8f2]">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#8be9fd] shadow-[0_0_18px_rgba(0,229,255,0.9)]" />
                    {item}
                  </span>
                  <span className="text-xs text-[#a7b0c8]">T+{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-14">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#ff79c6]">Built for API reliability</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-bold text-white sm:text-4xl">Hard problems surfaced as product UX.</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-[#a7b0c8]">The interface turns reliability concerns into visible states: authenticated sessions, retry-safe payments, ledger movement tables and audit-ready signals.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {hardProblems.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.04 }}
              className="glass-surface-2 rounded-xl p-5"
            >
              <item.icon className="mb-5 h-6 w-6 text-[#8be9fd]" />
              <h3 className="text-lg font-bold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#a7b0c8]">{item.text}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-8">
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            [Layers3, "Ledger-first architecture", "Moves are modeled as transaction rows with shared references for debit and credit sides."],
            [Database, "What this demo proves", "The UI exposes auth, protected pages, payment-key resolution and transfer confirmation."],
            [Sparkles, "Premium product finish", "The local API is presented with mobile-first forms, motion, protected states and operational empty screens."],
          ].map(([Icon, title, text]) => (
            <article key={String(title)} className="game-panel rounded-xl p-6">
              <Icon className="h-7 w-7 text-[#f1fa8c]" />
              <h3 className="mt-5 text-xl font-bold text-white">{String(title)}</h3>
              <p className="mt-3 text-sm leading-6 text-[#a7b0c8]">{String(text)}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:flex-row">
          <span className="flex items-center gap-3 text-sm text-[#f8f8f2]">
            <Activity className="h-5 w-5 text-[#50fa7b]" />
            Duplicate requests do not create duplicate visual transactions in the client flow.
          </span>
          <Link href="/register" className="btn-cashout inline-flex h-12 items-center justify-center px-5 text-sm font-black">
            Start demo
          </Link>
        </div>
      </section>
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--dracula-border)]/80 bg-[var(--dracula-bg)]/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.55rem)] pt-2 shadow-[0_-16px_34px_rgba(0,0,0,0.35)] backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid h-16 max-w-md grid-cols-3 items-stretch gap-1">
          {[
            { href: "/", label: "Home", icon: Home },
            { href: "/login", label: "Login", icon: LogIn },
            { href: "/register", label: "Register", icon: UserPlus },
          ].map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="relative flex h-full min-w-0 flex-col items-center justify-between rounded-xl px-1 py-1.5 text-[10px] font-semibold uppercase tracking-tight text-[var(--dracula-comment)] transition-colors hover:text-[var(--dracula-cyan)]"
            >
              <span className="relative z-10 flex h-7 w-7 items-center justify-center rounded-lg text-[var(--dracula-comment)]">
                <Icon className="h-4 w-4" />
              </span>
              <span className="relative z-10 block h-3 max-w-full truncate leading-3">{label}</span>
            </Link>
          ))}
        </div>
      </nav>
      <AppFooter />
    </main>
  );
}
