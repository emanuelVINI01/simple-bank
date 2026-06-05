"use client";

import { Activity, ArrowDownLeft, ArrowUpRight, ReceiptText, Wallet } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { formatDate, formatMoney } from "@/lib/format";
import { useI18n } from "@/src/i18n/provider";
import { motion } from "framer-motion";

export function DashboardSummary({
  balance,
  lastMovement,
  received,
  sent,
  total,
}: {
  balance?: number;
  lastMovement?: string;
  received: number;
  sent: number;
  total: number;
}) {
  const { t } = useI18n();

  return (
    <div className="mb-8">
      {/* Balance Hero Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="balance-card mb-4 p-6 sm:p-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-[#8be9fd] mb-2">
              <Wallet className="h-5 w-5" />
              <span className="text-sm font-bold uppercase tracking-[0.15em]">{t("dashboard.balance")}</span>
            </div>
            <div className="counter-in text-5xl font-black text-white sm:text-7xl">
              {formatMoney(balance)}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Other Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard icon={ArrowUpRight} label={t("dashboard.sent")} value={formatMoney(sent)} tone="pink" />
        <StatCard icon={ArrowDownLeft} label={t("dashboard.received")} value={formatMoney(received)} tone="cyan" />
        <StatCard icon={ReceiptText} label={t("dashboard.transactions")} value={String(total)} tone="purple" />
        <StatCard icon={Activity} label={t("dashboard.lastMovement")} value={formatDate(lastMovement)} tone="yellow" />
      </div>
    </div>
  );
}
