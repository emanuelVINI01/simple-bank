"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTransactions } from "@/lib/services/banking-api";

export function useTransactions(enabled = true) {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: () => fetchTransactions(),
    enabled,
  });
}
