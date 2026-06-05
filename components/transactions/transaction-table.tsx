"use client";

import { ArrowDownLeft, ArrowUpRight, Download, Loader2, ReceiptText, Sparkles } from "lucide-react";
import { useReceiptDownload } from "@/hooks/use-receipt-download";
import type { ApiTransaction } from "@/lib/api-types";
import { formatDate, formatMoney } from "@/lib/format";
import { getTransactionTypeMeta, truncateReference } from "@/lib/transaction-mappers";
import { useI18n } from "@/src/i18n/provider";

export function TransactionTable({
  transactions,
  onAnalyzeClick,
}: {
  transactions: ApiTransaction[];
  onAnalyzeClick?: (txn: ApiTransaction) => void;
}) {
  const receiptDownload = useReceiptDownload();
  const { t } = useI18n();

  if (transactions.length === 0) {
    return (
      <div className="glass-surface-2 flex min-h-[280px] flex-col items-center justify-center rounded-2xl p-8 text-center border border-dashed border-white/10">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#bd93f9]/10">
          <ReceiptText className="h-8 w-8 text-[#bd93f9]" />
        </div>
        <h3 className="text-xl font-bold text-white">{t("transactions.empty")}</h3>
        <p className="mt-2 max-w-sm text-sm leading-6 text-[#8892a4]">
          {t("transactions.emptySubtitle")}
        </p>
      </div>
    );
  }

  return (
    <div className="glass-surface-2 overflow-hidden rounded-2xl">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead className="bg-white/[0.03] text-[11px] font-bold uppercase tracking-[0.15em] text-[#8892a4]">
            <tr>
              <th className="px-5 py-4">{t("transactions.type")}</th>
              <th className="px-5 py-4">{t("transactions.amount")}</th>
              <th className="px-5 py-4">{t("transactions.reference")}</th>
              <th className="px-5 py-4">{t("transactions.description")}</th>
              <th className="px-5 py-4">{t("transactions.date")}</th>
              <th className="px-5 py-4 text-right">{t("transactions.receipt")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {transactions.map((transaction) => {
              const typeMeta = getTransactionTypeMeta(transaction.type);
              const isCredit = typeMeta.direction === "in";
              const amountStr = formatMoney(transaction.amount);

              return (
                <tr key={transaction.id} className="text-sm transition-colors hover:bg-white/[0.02]">
                  <td className="px-5 py-4">
                    <span className={isCredit ? "badge-credit" : "badge-debit"}>
                      {isCredit ? <ArrowDownLeft className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
                      {isCredit ? t("transactions.credit") : t("transactions.debit")}
                    </span>
                  </td>
                  <td className={`px-5 py-4 font-black ${isCredit ? "text-[#50fa7b]" : "text-white"}`}>
                    {isCredit ? "+" : "-"}{amountStr}
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded bg-black/20 px-2 py-1 font-mono text-[11px] text-[#8892a4]">
                      {truncateReference(transaction.referenceId)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[#8892a4]">
                    {transaction.description || <span className="italic opacity-60">{t("transactions.noDescription")}</span>}
                  </td>
                  <td className="px-5 py-4 text-[#8892a4]">{formatDate(transaction.createdAt)}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {onAnalyzeClick && (
                        <button
                          onClick={() => onAnalyzeClick(transaction)}
                          className="chip-btn inline-flex h-8 w-8 items-center justify-center text-[#bd93f9] hover:bg-[#bd93f9]/10 rounded-lg"
                          title="Analyze with AI"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                        </button>
                      )}
                      {transaction.receiptUrl ? (
                        <button
                          onClick={() => void receiptDownload.downloadReceipt(transaction.id)}
                          disabled={receiptDownload.downloadingId === transaction.id}
                          className="chip-btn inline-flex h-8 items-center justify-center gap-1.5 px-3 text-[11px] font-bold disabled:opacity-50"
                        >
                          {receiptDownload.downloadingId === transaction.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />}
                          {t("transactions.download")}
                        </button>
                      ) : (
                        <span className="text-[#8892a4] opacity-50">-</span>
                      )}
                    </div>
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
