import { requestJson } from "@/api/client";
import type {
  AiUsageSummary,
  BudgetAdvice,
  ParsedTransfer,
  TransactionAnalysis,
} from "@/api/types";

export function fetchAiUsageRequest() {
  return requestJson<AiUsageSummary>("/api/ai/usage", {
    fallbackMessage: "Nao foi possivel carregar as estatisticas da IA.",
  });
}

export function fetchBudgetAdviceRequest(locale: string = "pt-BR") {
  return requestJson<{ result: BudgetAdvice; usage: AiUsageSummary }>(
    `/api/ai/budget-advice?locale=${encodeURIComponent(locale)}`,
    {
      fallbackMessage: "Nao foi possivel gerar o resumo orcamentario.",
    }
  );
}

export function analyzeTransactionRequest(
  id: string,
  locale: string = "pt-BR",
  forceRefresh: boolean = false
) {
  return requestJson<{
    analysis: TransactionAnalysis;
    cacheHit: boolean;
    usage: AiUsageSummary;
  }>(`/api/ai/transaction/${encodeURIComponent(id)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ locale, forceRefresh }),
    fallbackMessage: "Nao foi possivel analisar a transacao.",
  });
}

export function parseTransferPromptRequest(
  textCommand: string,
  locale: string = "pt-BR"
) {
  return requestJson<{ result: ParsedTransfer; usage: AiUsageSummary }>(
    "/api/ai/parse-transfer",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ textCommand, locale }),
      fallbackMessage: "Nao foi possivel interpretar o comando de transferencia.",
    }
  );
}
