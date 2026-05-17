import { parseJsonResponse, type ApiPaymentKey, type ApiTransaction, type ApiUser } from "@/lib/api-types";

export function fetchCurrentUser() {
  return getJson<{ user: ApiUser }>("/api/users/me", "Could not load authenticated user.").then((data) => data.user);
}

export function fetchWalletProfile() {
  return getJson<{ user: ApiUser }>("/api/users/me", "Could not load wallet profile.").then((data) => data.user);
}

export function fetchTransactions(limit = 50) {
  return getJson<{ transactions: ApiTransaction[] }>(`/api/users/transactions?limit=${limit}`, "Could not load transactions.").then((data) => data.transactions);
}

export function fetchPaymentKeys() {
  return getJson<{ paymentKeys: ApiPaymentKey[] }>("/api/payment-keys", "Could not load payment keys.").then((data) => data.paymentKeys);
}

export function createPaymentKeyRequest() {
  return requestJson<{ paymentKey: ApiPaymentKey }>("/api/payment-keys", "Could not create payment key.", {
    method: "POST",
  }).then((data) => data.paymentKey);
}

export async function deletePaymentKeyRequest(key: string) {
  const response = await fetch(`/api/payment-keys/${encodeURIComponent(key)}`, {
    method: "DELETE",
    credentials: "same-origin",
  });

  if (response.status === 204) return;

  await parseJsonResponse<unknown>(response, "Could not delete payment key.");
}

export function resolvePaymentKeyRequest(key: string) {
  return getJson<{ paymentKey: ApiPaymentKey }>(`/api/payment-keys/${encodeURIComponent(key)}`, "Could not resolve payment key.").then((data) => data.paymentKey);
}

export function createPaymentRequest(input: { paymentKey: string; amount: number; description?: string; idempotencyKey: string }) {
  return requestJson<{ success: boolean; transactionId?: string; receiptUrl?: string; error?: string }>("/api/payments", "Could not create payment.", {
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
  });
}

export function registerUserRequest(input: { email: string; name: string; password: string; taxId: string }) {
  return requestJson("/api/auth/register", "Unable to register demo user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
}

function getJson<T>(url: string, fallbackMessage: string) {
  return requestJson<T>(url, fallbackMessage);
}

async function requestJson<T>(url: string, fallbackMessage: string, init?: RequestInit) {
  const response = await fetch(url, {
    credentials: "same-origin",
    ...init,
  });

  return parseJsonResponse<T>(response, fallbackMessage);
}
