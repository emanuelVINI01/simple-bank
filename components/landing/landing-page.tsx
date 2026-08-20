"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Fingerprint,
  KeyRound,
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
  "text-[#50fa7b]",
  "text-[#8be9fd]",
  "text-[#bd93f9]",
  "text-[#ff79c6]",
  "text-[#f1fa8c]",
  "text-[#ffb86c]",
];
const featureBg = [
  "bg-[#50fa7b]/10 border-[#50fa7b]/20",
  "bg-[#8be9fd]/10 border-[#8be9fd]/20",
  "bg-[#bd93f9]/10 border-[#bd93f9]/20",
  "bg-[#ff79c6]/10 border-[#ff79c6]/20",
  "bg-[#f1fa8c]/10 border-[#f1fa8c]/20",
  "bg-[#ffb86c]/10 border-[#ffb86c]/20",
];

const featureKeys = [1, 2, 3, 4, 5, 6] as const;

const socialStats = [
  { value: "10k+", labelKey: "landing.social.users" as const },
  { value: "R$ 0", labelKey: "landing.social.fee" as const },
  { value: "99.9%", labelKey: "landing.social.uptime" as const },
];

const mockTransactions = [
  { label: "CREDIT · ref_92b", color: "bg-[#50fa7b]", ago: "2m" },
  { label: "DEBIT · ref_91a", color: "bg-[#ff79c6]", ago: "15m" },
  { label: "CREDIT · ref_88c", color: "bg-[#50fa7b]", ago: "1h" },
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
          <h1 className="max-w-2xl text-5xl font-black leading-[1.02] text-white sm:text-6xl lg:text-[68px] lg:leading-[0.96]">
            {t("landing.hero.title")}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-[#8892a4] sm:text-lg sm:leading-8">
            {t("landing.hero.subtitle")}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="btn-bet inline-flex h-13 items-center justify-center gap-2 px-7 text-sm font-bold"
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
          <p className="mt-5 text-xs text-[#8892a4]">{t("landing.hero.trust")}</p>
        </motion.div>

        {/* ─── Dashboard Mockup ─── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="gradient-ring rounded-2xl"
        >
          <div className="game-panel rounded-2xl p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8be9fd]">
                  {t("landing.mockup.label")}
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-black neon-text-green">$12,840.00</span>
                  <TrendingUp className="h-4 w-4 text-[#50fa7b]" />
                </div>
              </div>
              <span className="rounded-full bg-[#50fa7b]/10 px-3 py-1 text-xs font-bold text-[#50fa7b]">
                {t("landing.mockup.status")}
              </span>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-3">
              <div className="glass-surface rounded-xl p-4">
                <p className="text-xs text-[#8892a4]">{t("landing.mockup.sent")}</p>
                <p className="mt-1.5 text-xl font-bold neon-text-pink">$4,210.00</p>
              </div>
              <div className="glass-surface rounded-xl p-4">
                <p className="text-xs text-[#8892a4]">{t("landing.mockup.received")}</p>
                <p className="mt-1.5 text-xl font-bold neon-text-cyan">$8,630.00</p>
              </div>
            </div>

            <div className="space-y-2">
              {mockTransactions.map((tx) => (
                <div
                  key={tx.label}
                  className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-black/20 px-4 py-3"
                >
                  <span className="flex items-center gap-3 text-sm text-[#f8f8f2]">
                    <span className={`h-2 w-2 rounded-full ${tx.color} shadow-lg`} />
                    {tx.label}
                  </span>
                  <span className="text-xs text-[#8892a4]">{tx.ago}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── Social Proof ─── */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="glass-surface rounded-2xl px-6 py-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            {socialStats.map(({ value, labelKey }) => (
              <div key={labelKey}>
                <p className="text-2xl font-black text-white sm:text-3xl">{value}</p>
                <p className="mt-1 text-xs text-[#8892a4]">{t(labelKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-black text-white sm:text-4xl">{t("landing.features.title")}</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#8892a4]">{t("landing.features.subtitle")}</p>
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
                className="glass-surface-2 hover-scale rounded-2xl p-6"
              >
                <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border ${featureBg[i]}`}>
                  <Icon className={`h-5 w-5 ${featureColors[i]}`} />
                </div>
                <h3 className="text-base font-bold text-white">{t(`landing.feature${n}.title`)}</h3>
                <p className="mt-2 text-sm leading-6 text-[#8892a4]">{t(`landing.feature${n}.text`)}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <div className="balance-card p-8 text-center sm:p-12">
          <Wallet className="mx-auto mb-4 h-10 w-10 neon-text-purple" />
          <h2 className="text-3xl font-black text-white sm:text-4xl">{t("landing.cta.title")}</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-[#8892a4]">{t("landing.cta.subtitle")}</p>
          <Link
            href="/register"
            className="btn-bet mt-8 inline-flex h-13 items-center justify-center gap-2 px-8 text-sm font-black"
          >
            {t("landing.cta.button")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
