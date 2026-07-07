"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTransactions, fetchWalletMetrics } from "@/lib/services/banking-api";

export function useTransactions(enabled = true) {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: () => fetchTransactions(),
    enabled,
  });
}

export function useWalletMetrics(enabled = true) {
  return useQuery({
    queryKey: ["metrics"],
    queryFn: () => fetchWalletMetrics(),
    enabled,
  });
}
