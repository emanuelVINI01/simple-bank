import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  analyzeTransactionRequest,
  fetchAiUsageRequest,
  fetchBudgetAdviceRequest,
  parseTransferPromptRequest,
} from "@/api/ai";
import type {
  AiUsageSummary,
  BudgetAdvice,
  ParsedTransfer,
  TransactionAnalysis,
} from "@/api/types";
import { useI18n } from "@/i18n/provider";

export function useAiUsage(enabled = true) {
  return useQuery<AiUsageSummary>({
    queryKey: ["ai-usage"],
    queryFn: () => fetchAiUsageRequest(),
    enabled,
    refetchOnWindowFocus: false,
  });
}

export function useAnalyzeTransaction() {
  const { locale } = useI18n();
  const queryClient = useQueryClient();

  return useMutation<{
    analysis: TransactionAnalysis;
    cacheHit: boolean;
    usage: AiUsageSummary;
  }, Error, { id: string; forceRefresh?: boolean }>({
    mutationFn: ({ id, forceRefresh }) =>
      analyzeTransactionRequest(id, locale, forceRefresh),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-usage"] });
    },
  });
}

export function useParseTransfer() {
  const { locale } = useI18n();
  const queryClient = useQueryClient();

  return useMutation<{
    result: ParsedTransfer;
    usage: AiUsageSummary;
  }, Error, string>({
    mutationFn: (textCommand: string) =>
      parseTransferPromptRequest(textCommand, locale),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-usage"] });
    },
  });
}

export function useBudgetAdvice(enabled = false) {
  const { locale } = useI18n();

  return useQuery<{ result: BudgetAdvice; usage: AiUsageSummary }>({
    queryKey: ["ai-budget-advice", locale],
    queryFn: () => fetchBudgetAdviceRequest(locale),
    enabled,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10, // 10 minutes cache
  });
}
