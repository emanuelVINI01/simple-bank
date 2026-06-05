"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle, RefreshCw, X, ShieldAlert, Sparkles, HelpCircle } from "lucide-react";
import { useEffect } from "react";
import { useAnalyzeTransaction } from "@/hooks/use-ai";
import { useI18n } from "@/src/i18n/provider";
import { formatMoney } from "@/lib/format";

interface TransactionAnalysisModalProps {
  open: boolean;
  onClose: () => void;
  transaction: {
    id: string;
    amount: number;
    description: string | null;
    type: "DEBIT" | "CREDIT";
  } | null;
}

export function TransactionAnalysisModal({
  open,
  onClose,
  transaction,
}: TransactionAnalysisModalProps) {
  const { t } = useI18n();
  const analyzeMutation = useAnalyzeTransaction();
  const { mutate } = analyzeMutation;

  useEffect(() => {
    if (open && transaction?.id) {
      mutate({ id: transaction.id });
    }
  }, [mutate, open, transaction?.id]);

  if (!open || !transaction) return null;

  const analysis = analyzeMutation.data?.analysis;
  const isCacheHit = analyzeMutation.data?.cacheHit;
  const isLoading = analyzeMutation.isPending;
  const error = analyzeMutation.error;

  // Function to re-analyze/force refresh
  const handleForceRefresh = () => {
    if (transaction?.id) {
      mutate({ id: transaction.id, forceRefresh: true });
    }
  };

  const getRiskColor = (score = 0) => {
    if (score < 30) return "text-[#50fa7b]"; // Green
    if (score < 70) return "text-[#ffb86c]"; // Orange
    return "text-[#ff5555]"; // Red
  };

  const getRiskProgressColor = (score = 0) => {
    if (score < 30) return "bg-[#50fa7b]";
    if (score < 70) return "bg-[#ffb86c]";
    return "bg-[#ff5555]";
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-lg sm:items-center sm:p-4"
      >
        <motion.section
          initial={{ y: 18, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 16, opacity: 0, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className="glass-surface max-h-[94dvh] w-full max-w-lg overflow-y-auto rounded-t-[26px] p-5 pb-[calc(env(safe-area-inset-bottom)+1rem)] sm:max-h-[88vh] sm:rounded-2xl sm:p-6"
        >
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#bd93f9]/10">
                <Sparkles className="h-4 w-4 text-[#bd93f9]" />
              </div>
              <h3 className="text-lg font-black text-white sm:text-xl">
                AI Transaction Review
              </h3>
            </div>
            <div className="flex items-center gap-2">
              {!isLoading && !error && analysis && (
                <button
                  onClick={handleForceRefresh}
                  className="chip-btn flex h-9 w-9 items-center justify-center rounded-lg text-white"
                  title="Re-analyze transaction"
                >
                  <RefreshCw className="h-4 w-4 text-[#8be9fd]" />
                </button>
              )}
              <button
                onClick={onClose}
                className="chip-btn flex h-9 w-9 items-center justify-center rounded-lg text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          {isLoading ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center space-y-4 text-center">
              <div className="relative flex h-16 w-16 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#bd93f9]/10 opacity-75"></span>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#bd93f9]/20">
                  <RefreshCw className="h-6 w-6 animate-spin text-[#bd93f9]" />
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-white">Consulting Finance Model...</p>
                <p className="mt-1 text-xs text-[#8892a4]">Generating friendly labels, category classification and risk scoring</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center space-y-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ff5555]/10">
                <AlertTriangle className="h-6 w-6 text-[#ff5555]" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{t("common.error")}</p>
                <p className="mt-1 text-xs text-[#ff5555]">{error.message}</p>
              </div>
              <button
                onClick={() => mutate({ id: transaction.id })}
                className="btn-bet h-10 px-4 text-xs font-bold"
              >
                {t("common.retry")}
              </button>
            </div>
          ) : analysis ? (
            <div className="space-y-6">
              {/* Transaction Mini Summary */}
              <div className="glass-surface-2 rounded-xl p-4 border border-white/5 flex justify-between items-center">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#8892a4]">Original Details</p>
                  <p className="mt-1 font-bold text-white truncate max-w-[200px]">
                    {transaction.description || "No description provided"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#8892a4]">Amount</p>
                  <p className={`mt-1 font-black ${transaction.type === "CREDIT" ? "text-[#50fa7b]" : "text-white"}`}>
                    {transaction.type === "CREDIT" ? "+" : "-"}{formatMoney(transaction.amount)}
                  </p>
                </div>
              </div>

              {/* Cache Indicator */}
              {isCacheHit && (
                <div className="flex items-center gap-1.5 rounded-lg bg-[#50fa7b]/10 border border-[#50fa7b]/20 px-3 py-1.5 text-xs text-[#50fa7b]">
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>Cache hit! Saved daily API quota.</span>
                </div>
              )}

              {/* AI Categorized Label */}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#bd93f9]">AI Classification</span>
                  <span className="badge-tag bg-[#ff79c6]/10 text-[#ff79c6] border border-[#ff79c6]/20 py-0.5 px-2 text-xs font-bold rounded">
                    {analysis.category}
                  </span>
                </div>
                <h4 className="mt-2 text-xl font-bold text-white leading-snug">
                  {analysis.friendlyDescription}
                </h4>
              </div>

              {/* Fraud and Risk Scoring Gauge */}
              <div className="glass-surface-2 rounded-xl p-4 border border-white/5 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-[#8be9fd]" />
                    <span className="text-xs font-bold text-white">Risk Evaluation</span>
                  </div>
                  <span className={`text-xs font-bold uppercase ${getRiskColor(analysis.riskScore)}`}>
                    {analysis.riskLevel} Risk ({analysis.riskScore}/100)
                  </span>
                </div>
                {/* Horizontal Progress Gauge */}
                <div className="relative h-2 w-full rounded-full bg-black/30 overflow-hidden">
                  <div
                    style={{ width: `${analysis.riskScore}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${getRiskProgressColor(analysis.riskScore)}`}
                  />
                </div>
                <p className="text-xs leading-relaxed text-[#a7b0c8]">
                  {analysis.riskExplanation}
                </p>
              </div>

              {/* Budgeting Tip */}
              <div className="rounded-xl border border-[#bd93f9]/30 bg-[#bd93f9]/5 p-4 space-y-1">
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#bd93f9]">Financial Tip</p>
                <p className="text-xs leading-relaxed text-white">
                  {analysis.budgetTip}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
              <HelpCircle className="h-12 w-12 text-[#8892a4]/40" />
              <p className="mt-3 text-sm text-[#8892a4]">No analysis information available</p>
            </div>
          )}

          {/* Usage Stats Footer */}
          {analyzeMutation.data?.usage && (
            <div className="mt-6 border-t border-white/[0.06] pt-4 text-center">
              <p className="text-[10px] text-[#8892a4]">
                AI Daily Quota: {analyzeMutation.data.usage.used}/{analyzeMutation.data.usage.limit} requests ({analyzeMutation.data.usage.remaining} remaining today)
              </p>
            </div>
          )}
        </motion.section>
      </motion.div>
    </AnimatePresence>
  );
}
