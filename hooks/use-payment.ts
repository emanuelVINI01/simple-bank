"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPaymentRequest, resolvePaymentKeyRequest } from "@/lib/services/banking-api";

export function useResolvePaymentKey() {
  return useMutation({
    mutationFn: resolvePaymentKeyRequest,
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPaymentRequest,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["me"] });
      void queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
