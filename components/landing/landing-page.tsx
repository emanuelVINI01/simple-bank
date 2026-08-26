"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Fingerprint,
  Gauge,
  KeyRound,
  ListChecks,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";
import { useI18n } from "@/src/i18n/provider";

const featureIcons = [ShieldCheck, Zap, ReceiptText, Fingerprint, KeyRound, Sparkles];
const featureColors = [
  "text-[var(--accent)]",
  "text-[var(--info)]",
  "text-[var(--warning)]",
  "text-[var(--accent)]",
  "text-[var(--info)]",
  "text-[var(--warning)]",
];
const featureBg = [
  "bg-[var(--accent)]/10 border-[var(--accent)]/20",
  "bg-[var(--info)]/10 border-[var(--info)]/20",
  "bg-[var(--warning)]/10 border-[var(--warning)]/20",
  "bg-[var(--accent)]/10 border-[var(--accent)]/20",
  "bg-[var(--info)]/10 border-[var(--info)]/20",
  "bg-[var(--warning)]/10 border-[var(--warning)]/20",
];

const featureKeys = [1, 2, 3, 4, 5, 6] as const;

const differentiators = [
  { icon: Gauge, key: "item1" as const },
  { icon: Sparkles, key: "item2" as const },
  { icon: ListChecks, key: "item3" as const },
];

const mockTransactions = [
  { label: "CREDIT · TXN #0092b", color: "bg-[var(--accent)]", ago: "2m" },
  { label: "DEBIT · TXN #0091a", color: "bg-[var(--fg-subtle)]", ago: "15m" },
  { label: "CREDIT · TXN #0088c", color: "bg-[var(--accent)]", ago: "1h" },
];

export function LandingPage() {
  const { t } = useI18n();

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="grid-noise pointer-events-none absolute inset-0 opacity-80" />

      {/* ─── Hero ─── */}
      <section className="relative z-10 mx-auto grid max-w-7xl gap-12 px-4 pb-20 pt-8 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pt-12 xl:pt-16">
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
          <div className="hero-badge mb-6">
            <CheckCircle className="h-3.5 w-3.5" />
            {t("landing.hero.badge")}
          </div>
          <h1 className="max-w-2xl text-5xl font-bold leading-[1.02] tracking-tight text-[var(--fg)] sm:text-6xl lg:text-[68px] lg:leading-[0.96]">
            {t("landing.hero.title")}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-[var(--fg-subtle)] sm:text-lg sm:leading-8">
            {t("landing.hero.subtitle")}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="btn-primary-cta inline-flex h-13 items-center justify-center gap-2 px-7 text-sm font-bold"
            >
              {t("landing.hero.cta.primary")}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="chip-btn inline-flex h-13 items-center justify-center gap-2 px-7 text-sm font-semibold"
            >
              {t("landing.hero.cta.secondary")}
            </Link>
          </div>
          <p className="mt-5 text-xs text-[var(--fg-subtle)]">{t("landing.hero.trust")}</p>
        </motion.div>

        {/* ─── Dashboard Mockup ─── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="gradient-ring rounded-2xl"
        >
          <div className="game-panel ledger-paper rounded-2xl p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--info)]">
                  {t("landing.mockup.label")}
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-bold tracking-tight neon-text-green">$12,840.00</span>
                  <TrendingUp className="h-4 w-4 text-[var(--accent)]" />
                </div>
              </div>
              <span className="rounded-full bg-[var(--accent)]/10 px-3 py-1 text-xs font-bold text-[var(--accent)]">
                {t("landing.mockup.status")}
              </span>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-3">
              <div className="glass-surface rounded-xl p-4">
                <p className="text-xs text-[var(--fg-subtle)]">{t("landing.mockup.sent")}</p>
                <p className="mt-1.5 text-xl font-bold text-[var(--fg)]">$4,210.00</p>
              </div>
              <div className="glass-surface rounded-xl p-4">
                <p className="text-xs text-[var(--fg-subtle)]">{t("landing.mockup.received")}</p>
                <p className="mt-1.5 text-xl font-bold neon-text-cyan">$8,630.00</p>
              </div>
            </div>

            <div className="space-y-2">
              {mockTransactions.map((tx) => (
                <div
                  key={tx.label}
                  className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-black/20 px-4 py-3"
                >
                  <span className="txn-tag flex items-center gap-3 text-sm text-[var(--fg)]">
                    <span className={`h-2 w-2 rounded-full ${tx.color} shadow-lg`} />
                    {tx.label}
                  </span>
                  <span className="text-xs text-[var(--fg-subtle)]">{tx.ago}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── Differentiators (real, technical — no invented adoption metrics) ─── */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-[var(--fg-subtle)]">
          {t("landing.differentiators.eyebrow")}
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {differentiators.map(({ icon: Icon, key }) => (
            <div key={key} className="glass-surface-2 rounded-xl p-5">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/10">
                <Icon className="h-5 w-5 text-[var(--accent)]" />
              </div>
              <h3 className="text-sm font-bold text-[var(--fg)]">{t(`landing.differentiators.${key}.title`)}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--fg-subtle)]">{t(`landing.differentiators.${key}.text`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--fg)] sm:text-4xl">{t("landing.features.title")}</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[var(--fg-subtle)]">{t("landing.features.subtitle")}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {featureKeys.map((n, i) => {
            const Icon = featureIcons[i]!;
            return (
              <motion.article
                key={n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className="glass-surface-2 rounded-xl p-6"
              >
                <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border ${featureBg[i]}`}>
                  <Icon className={`h-5 w-5 ${featureColors[i]}`} />
                </div>
                <h3 className="text-base font-bold text-[var(--fg)]">{t(`landing.feature${n}.title`)}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--fg-subtle)]">{t(`landing.feature${n}.text`)}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <div className="balance-card p-8 text-center sm:p-12">
          <Wallet className="mx-auto mb-4 h-10 w-10 neon-text-green" />
          <h2 className="text-3xl font-bold tracking-tight text-[var(--fg)] sm:text-4xl">{t("landing.cta.title")}</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-[var(--fg-subtle)]">{t("landing.cta.subtitle")}</p>
          <Link
            href="/register"
            className="btn-primary-cta mt-8 inline-flex h-13 items-center justify-center gap-2 px-8 text-sm font-bold"
          >
            {t("landing.cta.button")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
