"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPaymentKeyRequest, deletePaymentKeyRequest, fetchPaymentKeys, fetchWalletProfile } from "@/lib/services/banking-api";

export function useWallet(enabled = true) {
  return useQuery({
    queryKey: ["me"],
    queryFn: fetchWalletProfile,
    enabled,
  });
}

export function useCreatePaymentKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPaymentKeyRequest,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["me"] });
      void queryClient.invalidateQueries({ queryKey: ["payment-keys"] });
    },
  });
}

export function usePaymentKeys(enabled = true) {
  return useQuery({
    queryKey: ["payment-keys"],
    queryFn: fetchPaymentKeys,
    enabled,
  });
}

export function useDeletePaymentKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePaymentKeyRequest,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["payment-keys"] });
    },
  });
}
