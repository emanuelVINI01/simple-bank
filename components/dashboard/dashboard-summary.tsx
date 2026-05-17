"use client";

import { Activity, ArrowDownLeft, ArrowUpRight, ReceiptText, WalletCards } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { formatDate, formatMoney } from "@/lib/format";

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
  return (
    <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <StatCard icon={WalletCards} label="Current balance" value={formatMoney(balance)} tone="green" />
      <StatCard icon={ArrowUpRight} label="Total sent" value={formatMoney(sent)} tone="pink" />
      <StatCard icon={ArrowDownLeft} label="Total received" value={formatMoney(received)} tone="cyan" />
      <StatCard icon={ReceiptText} label="Transactions" value={String(total)} tone="purple" />
      <StatCard icon={Activity} label="Last movement" value={formatDate(lastMovement)} tone="yellow" />
    </section>
  );
}
