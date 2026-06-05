"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useI18n } from "@/src/i18n/provider";

export interface AiUsageSummary {
  used: number;
  cacheHits: number;
  totalRequests: number;
  limit: number;
  remaining: number;
  periodStart: string;
  periodEnd: string;
}

export interface TransactionAnalysis {
  category: string;
  friendlyDescription: string;
  riskScore: number;
  riskLevel: "low" | "medium" | "high";
  riskExplanation: string;
  budgetTip: string;
}

export interface BudgetAdvice {
  summary: string;
  recommendations: string[];
  categoryBreakdown: {
    category: string;
    percentage: number;
    totalCents: number;
  }[];
}

export interface ParsedTransfer {
  recipientKey: string | null;
  amount: number | null;
  description: string | null;
}

export function useAiUsage(enabled = true) {
  return useQuery<AiUsageSummary>({
    queryKey: ["ai-usage"],
    queryFn: async () => {
      const res = await fetch("/api/ai/usage");
      if (!res.ok) throw new Error("Could not load AI usage statistics.");
      return res.json();
    },
    enabled,
    refetchOnWindowFocus: false,
  });
}

export function useAnalyzeTransaction() {
  const { locale } = useI18n();
  const queryClient = useQueryClient();

  return useMutation<{ analysis: TransactionAnalysis; cacheHit: boolean; usage: AiUsageSummary }, Error, { id: string; forceRefresh?: boolean }>({
    mutationFn: async ({ id, forceRefresh }) => {
      const res = await fetch(`/api/ai/transaction/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, forceRefresh }),
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Failed to analyze transaction.");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-usage"] });
    },
  });
}

export function useParseTransfer() {
  const { locale } = useI18n();
  const queryClient = useQueryClient();

  return useMutation<{ result: ParsedTransfer; usage: AiUsageSummary }, Error, string>({
    mutationFn: async (textCommand) => {
      const res = await fetch("/api/ai/parse-transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ textCommand, locale }),
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Failed to parse transfer command.");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-usage"] });
    },
  });
}

export function useBudgetAdvice(enabled = false) {
  const { locale } = useI18n();

  return useQuery<{ result: BudgetAdvice; usage: AiUsageSummary }>({
    queryKey: ["ai-budget-advice", locale],
    queryFn: async () => {
      const res = await fetch(`/api/ai/budget-advice?locale=${locale}`);
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Failed to generate budget advice.");
      }
      return res.json();
    },
    enabled,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10, // 10 minutes cache
  });
}
