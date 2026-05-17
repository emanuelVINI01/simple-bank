"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { useCreatePayment, useResolvePaymentKey } from "@/hooks/use-payment";
import { ApiError, type ApiPaymentKey } from "@/lib/api-types";
import { makeIdempotencyKey } from "@/lib/format";
import { openReceiptPdf } from "@/lib/receipt";

const resolveSchema = z.object({
  key: z.uuid("Use a valid payment key UUID"),
});

const paySchema = z.object({
  amount: z.number().int().positive("Amount must be greater than zero"),
  description: z.string().trim().max(255).optional(),
});

export type ResolveForm = z.infer<typeof resolveSchema>;
export type PayForm = z.infer<typeof paySchema>;
export type TransactionStep = 1 | 2 | 3;

type ReceiptState = {
  transactionId: string;
  receiptUrl?: string;
};

export function useTransactionModal(open: boolean) {
  const [step, setStep] = useState<TransactionStep>(1);
  const [resolved, setResolved] = useState<ApiPaymentKey | null>(null);
  const [idempotencyKey, setIdempotencyKey] = useState("");
  const [receipt, setReceipt] = useState<ReceiptState | null>(null);
  const [receiptError, setReceiptError] = useState<string | null>(null);
  const [openingReceipt, setOpeningReceipt] = useState(false);
  const resolveMutation = useResolvePaymentKey();
  const payMutation = useCreatePayment();
  const resolveForm = useForm<ResolveForm>({ resolver: zodResolver(resolveSchema), defaultValues: { key: "" } });
  const payForm = useForm<PayForm>({ resolver: zodResolver(paySchema), defaultValues: { amount: 1, description: "" } });

  useEffect(() => {
    if (!open) return;

    const timer = window.setTimeout(() => {
      setStep(1);
      setResolved(null);
      setReceipt(null);
      setReceiptError(null);
      setIdempotencyKey(makeIdempotencyKey());
      resolveForm.reset({ key: "" });
      payForm.reset({ amount: 1, description: "" });
    }, 0);

    return () => window.clearTimeout(timer);
  }, [open, payForm, resolveForm]);

  const mutationError = resolveMutation.error ?? payMutation.error;
  const errorMessage = mutationError instanceof ApiError ? mutationError.message : null;

  async function resolveKey(values: ResolveForm) {
    const paymentKey = await resolveMutation.mutateAsync(values.key);
    setResolved(paymentKey);
    setStep(2);
  }

  async function confirmPayment(values: PayForm) {
    if (!resolved) return;

    const response = await payMutation.mutateAsync({
      paymentKey: resolved.id,
      amount: values.amount,
      description: values.description,
      idempotencyKey,
    });

    if (response.transactionId) {
      setReceipt({ transactionId: response.transactionId, receiptUrl: response.receiptUrl });
    }

    setStep(3);
  }

  async function accessReceipt() {
    if (!receipt?.transactionId) return;

    try {
      setReceiptError(null);
      setOpeningReceipt(true);
      await openReceiptPdf(receipt.transactionId);
    } catch (error) {
      setReceiptError(error instanceof ApiError ? error.message : "Could not open receipt PDF.");
    } finally {
      setOpeningReceipt(false);
    }
  }

  return {
    accessReceipt,
    confirmPayment,
    errorMessage,
    goToResolveStep: () => setStep(1),
    idempotencyKey,
    openingReceipt,
    payForm,
    payPending: payMutation.isPending,
    receipt,
    receiptError,
    resolveForm,
    resolveKey,
    resolvePending: resolveMutation.isPending,
    resolved,
    step,
  };
}
