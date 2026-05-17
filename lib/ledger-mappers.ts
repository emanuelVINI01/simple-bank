import { TransactionType } from "@prisma/client";
import type { PublicPaymentKey, PublicTransaction, PublicUser } from "@/lib/ledger-selects";

export function publicUser(user: PublicUser) {
  return {
    ...user,
    createdAt: user.createdAt.toISOString(),
  };
}

export function publicPaymentKey(paymentKey: PublicPaymentKey) {
  return {
    ...paymentKey,
    createdAt: paymentKey.createdAt.toISOString(),
    user: publicUser(paymentKey.user),
  };
}

export function publicTransaction(transaction: PublicTransaction) {
  const hasReceipt = transaction.type === TransactionType.DEBIT && transaction.payerId && transaction.receiverId;

  return {
    ...transaction,
    createdAt: transaction.createdAt.toISOString(),
    receiptUrl: hasReceipt ? `/api/transactions/${transaction.id}/receipt` : transaction.receiptUrl,
  };
}
