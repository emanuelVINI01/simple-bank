import type { ApiTransaction, ApiUser, TransactionType } from "@/api/types";

export type TransactionListItem = {
  id: string;
  amount: number;
  createdAt: string;
  counterparty: ApiUser | null;
  description: string | null;
  direction: "in" | "out";
  referenceId: string;
  receiptUrl?: string;
  title: string;
  type: TransactionType;
};

export type TransactionSummary = {
  received: number;
  sent: number;
  total: number;
  last: ApiTransaction | null;
};

export function getTransactionDirection(transaction: ApiTransaction) {
  return transaction.type === "CREDIT" ? "in" : "out";
}

export function getCounterparty(transaction: ApiTransaction, currentUserId: string) {
  if (transaction.payerId === currentUserId) return transaction.receiver;
  if (transaction.receiverId === currentUserId) return transaction.payer;
  return transaction.type === "CREDIT" ? transaction.payer : transaction.receiver;
}

export function mapTransactionToListItem(transaction: ApiTransaction, currentUserId: string): TransactionListItem {
  const counterparty = getCounterparty(transaction, currentUserId);
  const direction = getTransactionDirection(transaction);

  return {
    id: transaction.id,
    amount: transaction.amount,
    counterparty,
    createdAt: transaction.createdAt,
    description: transaction.description,
    direction,
    receiptUrl: transaction.receiptUrl,
    referenceId: transaction.referenceId,
    title: counterparty?.name ?? (direction === "in" ? "Transferencia recebida" : "Transferencia enviada"),
    type: transaction.type,
  };
}

export function groupTransactionsByDate(transactions: ApiTransaction[]) {
  return transactions.reduce<Record<string, ApiTransaction[]>>((groups, transaction) => {
    const dateKey = transaction.createdAt.slice(0, 10);
    groups[dateKey] = [...(groups[dateKey] ?? []), transaction];
    return groups;
  }, {});
}

export function summarizeTransactions(transactions: ApiTransaction[]): TransactionSummary {
  return transactions.reduce<TransactionSummary>(
    (summary, transaction) => ({
      received: summary.received + (transaction.type === "CREDIT" ? transaction.amount : 0),
      sent: summary.sent + (transaction.type === "DEBIT" ? transaction.amount : 0),
      total: summary.total + 1,
      last: summary.last ?? transaction,
    }),
    { received: 0, sent: 0, total: 0, last: null },
  );
}

export function filterTransactions(transactions: ApiTransaction[], filter: "all" | "credit" | "debit", query = "") {
  const normalizedQuery = query.trim().toLowerCase();

  return transactions.filter((transaction) => {
    const matchesType =
      filter === "all" ||
      (filter === "credit" && transaction.type === "CREDIT") ||
      (filter === "debit" && transaction.type === "DEBIT");

    if (!matchesType) return false;
    if (!normalizedQuery) return true;

    const searchable = [
      transaction.description,
      transaction.referenceId,
      transaction.payer?.name,
      transaction.payer?.email,
      transaction.receiver?.name,
      transaction.receiver?.email,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchable.includes(normalizedQuery);
  });
}

