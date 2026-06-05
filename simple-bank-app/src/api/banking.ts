import { requestEmpty, requestJson } from "@/api/client";
import type { ApiPaymentKey, ApiTransaction, ApiUser, PaymentInput, PaymentResult } from "@/api/types";

export function fetchWalletProfile() {
  return requestJson<{ user: ApiUser }>("/api/users/me", {
    fallbackMessage: "Nao foi possivel carregar a conta.",
  }).then((payload) => payload.user);
}

export function fetchTransactions(limit = 50) {
  return requestJson<{ transactions: ApiTransaction[] }>(`/api/users/transactions?limit=${limit}`, {
    fallbackMessage: "Nao foi possivel carregar o extrato.",
  }).then((payload) => payload.transactions);
}

export function fetchPaymentKeys() {
  return requestJson<{ paymentKeys: ApiPaymentKey[] }>("/api/payment-keys", {
    fallbackMessage: "Nao foi possivel carregar as chaves.",
  }).then((payload) => payload.paymentKeys);
}

export function createPaymentKeyRequest() {
  return requestJson<{ paymentKey: ApiPaymentKey }>("/api/payment-keys", {
    method: "POST",
    fallbackMessage: "Nao foi possivel criar a chave.",
  }).then((payload) => payload.paymentKey);
}

export async function deletePaymentKeyRequest(key: string) {
  await requestEmpty(`/api/payment-keys/${encodeURIComponent(key)}`, {
    method: "DELETE",
    fallbackMessage: "Nao foi possivel excluir a chave.",
  });
}

export function resolvePaymentKeyRequest(key: string) {
  return requestJson<{ paymentKey: ApiPaymentKey }>(`/api/payment-keys/${encodeURIComponent(key)}`, {
    fallbackMessage: "Nao foi possivel localizar a chave.",
  }).then((payload) => payload.paymentKey);
}

export function createPaymentRequest(input: PaymentInput) {
  return requestJson<PaymentResult>("/api/payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": input.idempotencyKey,
    },
    body: JSON.stringify({
      paymentKey: input.paymentKey,
      amount: input.amount,
      description: input.description,
    }),
    fallbackMessage: "Nao foi possivel concluir a transferencia.",
  });
}

