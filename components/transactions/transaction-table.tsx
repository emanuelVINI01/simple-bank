"use client";

import { ArrowDownLeft, ArrowUpRight, Download, Loader2, ReceiptText } from "lucide-react";
import { useReceiptDownload } from "@/hooks/use-receipt-download";
import type { ApiTransaction } from "@/lib/api-types";
import { formatDate, formatMoney } from "@/lib/format";
import { getTransactionTypeMeta, truncateReference } from "@/lib/transaction-mappers";

export function TransactionTable({ transactions }: { transactions: ApiTransaction[] }) {
  const receiptDownload = useReceiptDownload();

  if (transactions.length === 0) {
    return (
      <div className="glass-surface-2 flex min-h-[280px] flex-col items-center justify-center rounded-xl p-8 text-center">
        <ReceiptText className="mb-4 h-10 w-10 text-[#8be9fd]" />
        <h3 className="text-xl font-bold text-white">No ledger movements yet</h3>
        <p className="mt-2 max-w-sm text-sm leading-6 text-[#a7b0c8]">Create a payment key or send a transfer to start building an auditable transaction history.</p>
      </div>
    );
  }

  return (
    <div className="glass-surface-2 overflow-hidden rounded-xl">
      <div className="border-b border-white/[0.06] px-5 py-4">
        <h2 className="text-lg font-bold text-white">Ledger transactions</h2>
        <p className="mt-1 text-sm text-[#a7b0c8]">Debit and credit rows returned by local Next.js API routes.</p>
        {receiptDownload.error ? <p className="mt-2 text-sm text-[#ff79c6]">{receiptDownload.error}</p> : null}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead className="bg-white/[0.03] text-xs uppercase tracking-[0.16em] text-[#a7b0c8]">
            <tr>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Amount</th>
              <th className="px-5 py-3">Reference</th>
              <th className="px-5 py-3">Description</th>
              <th className="px-5 py-3">Created</th>
              <th className="px-5 py-3">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {transactions.map((transaction) => {
              const typeMeta = getTransactionTypeMeta(transaction.type);

              return (
                <tr key={transaction.id} className="text-sm text-[#f8f8f2]">
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${typeMeta.className}`}>
                      {typeMeta.direction === "in" ? <ArrowDownLeft className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-bold text-white">{formatMoney(transaction.amount)}</td>
                  <td className="px-5 py-4 font-mono text-xs text-[#8be9fd]">{truncateReference(transaction.referenceId)}</td>
                  <td className="px-5 py-4 text-[#a7b0c8]">{transaction.description ?? "No description"}</td>
                  <td className="px-5 py-4 text-[#a7b0c8]">{formatDate(transaction.createdAt)}</td>
                  <td className="px-5 py-4">
                    {transaction.receiptUrl ? (
                      <button
                        onClick={() => void receiptDownload.downloadReceipt(transaction.id)}
                        disabled={receiptDownload.downloadingId === transaction.id}
                        className="chip-btn inline-flex h-9 items-center gap-2 px-3 text-xs font-bold disabled:opacity-60"
                      >
                        {receiptDownload.downloadingId === transaction.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                        PDF
                      </button>
                    ) : (
                      <span className="text-xs text-[#a7b0c8]">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
