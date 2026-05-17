import type { Prisma, User } from "@prisma/client";

export const USER_PAYMENT_KEY_LIMIT = 10;

export type PublicUser = Pick<User, "id" | "name" | "email" | "taxId" | "balance" | "createdAt">;

export const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  taxId: true,
  balance: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

export const paymentKeySelect = {
  id: true,
  key: true,
  userId: true,
  createdAt: true,
  user: {
    select: publicUserSelect,
  },
} satisfies Prisma.PaymentKeySelect;

export const transactionSelect = {
  id: true,
  userId: true,
  payerId: true,
  receiverId: true,
  amount: true,
  type: true,
  referenceId: true,
  description: true,
  createdAt: true,
  payer: {
    select: publicUserSelect,
  },
  receiver: {
    select: publicUserSelect,
  },
} satisfies Prisma.TransactionSelect;

export type PublicPaymentKey = Prisma.PaymentKeyGetPayload<{ select: typeof paymentKeySelect }>;
export type PublicTransaction = Prisma.TransactionGetPayload<{ select: typeof transactionSelect }> & {
  receiptUrl?: string;
};
