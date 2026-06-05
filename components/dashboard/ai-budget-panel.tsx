"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, AlertTriangle } from "lucide-react";
import { useBudgetAdvice, useAiUsage } from "@/hooks/use-ai";
import { formatMoney } from "@/lib/format";
import { useI18n } from "@/src/i18n/provider";

export function AiBudgetPanel() {
  const { t } = useI18n();
  const [enabled, setEnabled] = useState(false);
  
  const usageQuery = useAiUsage(true);
  const budgetQuery = useBudgetAdvice(enabled);

  const usage = usageQuery.data;
  const budget = budgetQuery.data?.result;
  const isLoading = budgetQuery.isFetching;
  const error = budgetQuery.error;

  const handleGenerate = () => {
    setEnabled(true);
    budgetQuery.refetch();
  };

  return (
    <article className="glass-surface-2 flex flex-col justify-between rounded-xl p-5 border border-white/5 min-h-[380px]">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#bd93f9]/10">
            <Sparkles className="h-4 w-4 text-[#bd93f9]" />
          </div>
          <h3 className="text-base font-bold text-white">{t("dashboard.ai.title")}</h3>
        </div>
        
        {usage && (
          <span className="text-[10px] bg-black/30 border border-white/10 rounded px-2 py-0.5 font-mono text-[#8be9fd]">
            {usage.remaining} {t("dashboard.ai.remaining")}
          </span>
        )}
      </div>

      <div className="mt-4 flex-1">
        <AnimatePresence mode="wait">
          {!enabled && !budget ? (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex min-h-[220px] flex-col items-center justify-center text-center space-y-4"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#bd93f9]/10">
                <Sparkles className="h-6 w-6 text-[#bd93f9] animate-pulse" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-white">{t("dashboard.ai.intro.title")}</p>
                <p className="max-w-[280px] text-xs text-[#a7b0c8]">
                  {t("dashboard.ai.intro.subtitle")}
                </p>
              </div>
              <button
                onClick={handleGenerate}
                disabled={usage?.remaining === 0}
                className="btn-bet h-10 px-5 text-xs font-black flex items-center gap-1.5 disabled:opacity-50"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {t("dashboard.ai.cta")}
              </button>
            </motion.div>
          ) : isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex min-h-[220px] flex-col items-center justify-center text-center space-y-3"
            >
              <Loader2 className="h-8 w-8 animate-spin text-[#bd93f9]" />
              <div>
                <p className="text-sm font-bold text-white">{t("dashboard.ai.loading.title")}</p>
                <p className="text-[11px] text-[#a7b0c8]">{t("dashboard.ai.loading.subtitle")}</p>
              </div>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex min-h-[220px] flex-col items-center justify-center text-center space-y-3"
            >
              <AlertTriangle className="h-8 w-8 text-[#ff5555]" />
              <div>
                <p className="text-sm font-bold text-white">{t("dashboard.ai.error.title")}</p>
                <p className="text-[11px] text-[#ff5555]">{error.message}</p>
              </div>
              <button onClick={handleGenerate} className="chip-btn h-9 px-4 text-xs font-bold">
                {t("dashboard.ai.retry")}
              </button>
            </motion.div>
          ) : budget ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 max-h-[300px] overflow-y-auto pr-1"
            >
              {/* Summary Paragraph */}
              <p className="text-xs leading-relaxed text-[#a7b0c8]">
                {budget.summary}
              </p>

              {/* Recommendations list */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#bd93f9]">{t("dashboard.ai.recommendations")}</h4>
                <ul className="space-y-1.5">
                  {budget.recommendations.map((rec, i) => (
                    <li key={i} className="text-[11px] leading-relaxed text-white bg-white/[0.02] border border-white/5 rounded-lg p-2 flex items-start gap-2">
                      <span className="text-[#ff79c6] font-bold">·</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Category breakdown bars */}
              {budget.categoryBreakdown && budget.categoryBreakdown.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#bd93f9]">{t("dashboard.ai.categories")}</h4>
                  <div className="space-y-2">
                    {budget.categoryBreakdown.map((cat, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-[#a7b0c8]">{cat.category}</span>
                          <span className="text-white font-bold">{cat.percentage}% ({formatMoney(cat.totalCents)})</span>
                        </div>
                        <div className="h-1.5 w-full bg-black/30 rounded-full overflow-hidden">
                          <div
                            className="bg-[#bd93f9] h-full rounded-full"
                            style={{ width: `${cat.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Usage Footer */}
      {usage && (
        <div className="mt-4 border-t border-white/[0.06] pt-3 flex items-center justify-between text-[10px] text-[#8892a4]">
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#50fa7b]" />
            <span>{t("dashboard.ai.status.online")}</span>
          </div>
          <span>{usage.used}/{usage.limit} {t("dashboard.ai.status.queries")}</span>
        </div>
      )}
    </article>
  );
}
