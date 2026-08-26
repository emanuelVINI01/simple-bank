"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ApiTransaction } from "@/lib/api-types";

export function LedgerChart({ transactions }: { transactions: ApiTransaction[] }) {
  const data = transactions.slice(0, 8).reverse().map((transaction, index) => ({
    name: `T${index + 1}`,
    credit: transaction.type === "CREDIT" ? transaction.amount : 0,
    debit: transaction.type === "DEBIT" ? transaction.amount : 0,
  }));

  return (
    <div className="glass-surface-2 rounded-xl p-5">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-[var(--fg)]">Movement shape</h2>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">Last ledger rows grouped by direction.</p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#a7b0c8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#a7b0c8" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.04)" }}
              contentStyle={{
                background: "#282a36",
                border: "1px solid rgba(68,71,90,0.6)",
                borderRadius: 16,
                color: "#f8f8f2",
              }}
            />
            <Bar dataKey="credit" fill="#50fa7b" radius={[8, 8, 0, 0]} />
            <Bar dataKey="debit" fill="#6c7086" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
