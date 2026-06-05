import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { createPaymentRequest, resolvePaymentKeyRequest } from "@/api/banking";
import type { ApiPaymentKey, PaymentInput, PaymentResult } from "@/api/types";
import { queryKeys } from "@/hooks/query-keys";
import { createIdempotencyKey } from "@/lib/idempotency";

export type TransferStep = "resolve-key" | "payment-data" | "confirm" | "success";

export function useResolvePaymentKey() {
  return useMutation({
    mutationFn: resolvePaymentKeyRequest,
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPaymentRequest,
    onSuccess: async () => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
      void queryClient.invalidateQueries({ queryKey: queryKeys.me });
      void queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useTransferFlow() {
  const [step, setStep] = useState<TransferStep>("resolve-key");
  const [resolvedKey, setResolvedKey] = useState<ApiPaymentKey | null>(null);
  const [paymentDraft, setPaymentDraft] = useState<Omit<PaymentInput, "paymentKey" | "idempotencyKey"> | null>(null);
  const [idempotencyKey, setIdempotencyKey] = useState(createIdempotencyKey);
  const resolveMutation = useResolvePaymentKey();
  const paymentMutation = useCreatePayment();

  const canConfirm = Boolean(resolvedKey && paymentDraft);

  async function resolveKey(key: string) {
    const paymentKey = await resolveMutation.mutateAsync(key);
    setResolvedKey(paymentKey);
    setStep("payment-data");
    await Haptics.selectionAsync().catch(() => undefined);
    return paymentKey;
  }

  function setPaymentData(input: Omit<PaymentInput, "paymentKey" | "idempotencyKey">) {
    setPaymentDraft(input);
    setStep("confirm");
  }

  async function confirmPayment(): Promise<PaymentResult> {
    if (!resolvedKey || !paymentDraft) {
      throw new Error("Complete os dados da transferencia antes de confirmar.");
    }

    const result = await paymentMutation.mutateAsync({
      ...paymentDraft,
      idempotencyKey,
      paymentKey: resolvedKey.id,
    });

    setStep("success");
    return result;
  }

  function reset() {
    setStep("resolve-key");
    setResolvedKey(null);
    setPaymentDraft(null);
    setIdempotencyKey(createIdempotencyKey());
    resolveMutation.reset();
    paymentMutation.reset();
  }

  return {
    canConfirm,
    confirmPayment,
    idempotencyKey,
    paymentDraft,
    paymentError: paymentMutation.error,
    paymentPending: paymentMutation.isPending,
    paymentResult: paymentMutation.data,
    reset,
    resolveError: resolveMutation.error,
    resolveKey,
    resolvePending: resolveMutation.isPending,
    resolvedKey,
    setPaymentData,
    setStep,
    step,
  };
}
