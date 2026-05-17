"use client";

import { motion } from "framer-motion";
import { Copy, Loader2, ShieldCheck, Trash2 } from "lucide-react";
import type { ApiPaymentKey } from "@/lib/api-types";
import { formatDate, formatTaxId } from "@/lib/format";

export function PaymentKeyCard({
  deleting,
  index,
  onCopy,
  onDelete,
  paymentKey,
}: {
  deleting: boolean;
  index: number;
  onCopy: (key: string) => void;
  onDelete: (key: string) => void;
  paymentKey: ApiPaymentKey;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="game-panel rounded-xl p-5"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#ff79c6]">Receivable key</p>
          <p className="mt-3 break-all font-mono text-sm text-[#8be9fd]">{paymentKey.key}</p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#50fa7b]/10 px-3 py-1 text-xs font-bold text-[#50fa7b]">
          <ShieldCheck className="h-3.5 w-3.5" />
          active
        </span>
      </div>

      <div className="mt-5 grid gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-[#a7b0c8] sm:grid-cols-2">
        <span>Owner: {paymentKey.user.name}</span>
        <span>Tax ID: {formatTaxId(paymentKey.user.taxId)}</span>
        <span className="sm:col-span-2">Created: {formatDate(paymentKey.createdAt)}</span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button onClick={() => void onCopy(paymentKey.key)} className="chip-btn flex h-12 items-center justify-center gap-2 px-4 text-sm font-bold">
          <Copy className="h-4 w-4" />
          Copy key
        </button>
        <button
          onClick={() => void onDelete(paymentKey.key)}
          disabled={deleting}
          className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#ff79c6]/35 bg-[#ff79c6]/10 px-4 text-sm font-bold text-[#ff79c6] transition hover:bg-[#ff79c6]/20 disabled:opacity-60"
        >
          {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          Delete
        </button>
      </div>
    </motion.article>
  );
}
