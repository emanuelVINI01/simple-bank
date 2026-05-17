"use client";

import { useState } from "react";
import { useCreatePaymentKey, useDeletePaymentKey } from "@/hooks/use-wallet";
import { ApiError } from "@/lib/api-types";
import { maskKey } from "@/lib/format";

export function usePaymentKeyActions() {
  const createKey = useCreatePaymentKey();
  const deleteKey = useDeletePaymentKey();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);

  async function createPaymentKey() {
    try {
      setFeedback(null);
      const paymentKey = await createKey.mutateAsync();
      setFeedback(`New key created: ${maskKey(paymentKey.key)}`);
    } catch (error) {
      setFeedback(error instanceof ApiError ? error.message : "Could not create payment key.");
    }
  }

  async function removePaymentKey(key: string) {
    const confirmed = window.confirm("Delete this payment key? Existing transfers cannot use it after removal.");
    if (!confirmed) return;

    try {
      setFeedback(null);
      setDeletingKey(key);
      await deleteKey.mutateAsync(key);
      setFeedback("Payment key deleted.");
    } catch (error) {
      setFeedback(error instanceof ApiError ? error.message : "Could not delete payment key.");
    } finally {
      setDeletingKey(null);
    }
  }

  async function copyPaymentKey(key: string) {
    await navigator.clipboard.writeText(key);
    setFeedback("Payment key copied.");
  }

  return {
    copyPaymentKey,
    createPaymentKey,
    createPending: createKey.isPending,
    deletingKey,
    feedback,
    removePaymentKey,
  };
}
