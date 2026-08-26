"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

const tones = {
  accent: {
    bg: "bg-[var(--accent)]/10",
    text: "text-[var(--accent)]",
  },
  info: {
    bg: "bg-[var(--info)]/10",
    text: "text-[var(--info)]",
  },
  warning: {
    bg: "bg-[var(--warning)]/10",
    text: "text-[var(--warning)]",
  },
  muted: {
    bg: "bg-[var(--fg-subtle)]/10",
    text: "text-[var(--fg-subtle)]",
  },
} as const;

export type StatTone = keyof typeof tones;

export function StatCard({
  icon: Icon,
  label,
  value,
  tone = "info",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone?: StatTone;
}) {
  const { bg, text } = tones[tone];

  return (
    <motion.article
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="glass-surface-2 rounded-xl p-5"
    >
      <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
        <Icon className={`h-5 w-5 ${text}`} />
      </span>
      <p className="mt-4 text-3xl font-bold tracking-tight text-[var(--fg)]">{value}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-[var(--fg-subtle)]">{label}</p>
    </motion.article>
  );
}
