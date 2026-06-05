export const queryKeys = {
  authSession: ["auth-session"] as const,
  me: ["me"] as const,
  paymentKeys: ["payment-keys"] as const,
  transactions: (limit = 50) => ["transactions", limit] as const,
};

