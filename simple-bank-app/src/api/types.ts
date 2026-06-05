export type ApiUser = {
  id: string;
  name: string;
  email: string;
  taxId: string;
  balance: number;
  createdAt: string;
};

export type TransactionType = "DEBIT" | "CREDIT";

export type ApiTransaction = {
  id: string;
  userId: string;
  payerId: string | null;
  receiverId: string | null;
  amount: number;
  type: TransactionType;
  referenceId: string;
  description: string | null;
  createdAt: string;
  payer: ApiUser | null;
  receiver: ApiUser | null;
  receiptUrl?: string;
};

export type ApiPaymentKey = {
  id: string;
  key: string;
  userId: string;
  createdAt: string;
  user: ApiUser;
};

export type ApiErrorPayload = {
  message?: string;
  error?: string;
  errors?: unknown;
};

export type RegisterInput = {
  name: string;
  email: string;
  taxId: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type PaymentInput = {
  paymentKey: string;
  amount: number;
  description?: string;
  idempotencyKey: string;
};

export type PaymentResult = {
  success: boolean;
  transactionId?: string;
  receiptUrl?: string;
  error?: string;
};

export type AuthSessionPayload = {
  user?: ApiUser;
  expires?: string;
};

export type CsrfPayload = {
  csrfToken: string;
};

