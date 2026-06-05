import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTransactions } from "@/api/banking";
import type { ApiTransaction } from "@/api/types";
import { queryKeys } from "@/hooks/query-keys";
import { filterTransactions, groupTransactionsByDate, mapTransactionToListItem, summarizeTransactions } from "@/mappers/transaction";

export function useTransactions(options: { enabled?: boolean; limit?: number } = {}) {
  const limit = options.limit ?? 50;

  return useQuery({
    queryKey: queryKeys.transactions(limit),
    queryFn: () => fetchTransactions(limit),
    enabled: options.enabled ?? true,
  });
}

export function useTransactionViewModel(input: {
  currentUserId?: string;
  filter?: "all" | "credit" | "debit";
  query?: string;
  transactions?: ApiTransaction[];
}) {
  return useMemo(() => {
    const transactions = input.transactions ?? [];
    const filtered = filterTransactions(transactions, input.filter ?? "all", input.query);

    return {
      filtered,
      grouped: groupTransactionsByDate(filtered),
      items: input.currentUserId ? filtered.map((transaction) => mapTransactionToListItem(transaction, input.currentUserId as string)) : [],
      summary: summarizeTransactions(transactions),
    };
  }, [input.currentUserId, input.filter, input.query, input.transactions]);
}

export function findTransactionById(transactions: ApiTransaction[] | undefined, transactionId: string) {
  return transactions?.find((transaction) => transaction.id === transactionId) ?? null;
}

