import type { ApiTransaction } from "@/lib/api-types";

export function summarizeTransactions(transactions: ApiTransaction[]) {
  return transactions.reduce(
    (summary, transaction, index) => {
      if (transaction.type === "DEBIT") {
        summary.sent += transaction.amount;
      }

      if (transaction.type === "CREDIT") {
        summary.received += transaction.amount;
      }

      if (transaction.receiptUrl) {
        summary.receipts += 1;
      }

      if (index === 0) {
        summary.last = transaction.createdAt;
      }

      summary.total += 1;
      return summary;
    },
    {
      last: undefined as string | undefined,
      receipts: 0,
      received: 0,
      sent: 0,
      total: 0,
    },
  );
}

export function getTransactionTypeMeta(type: ApiTransaction["type"]) {
  if (type === "CREDIT") {
    return {
      className: "bg-[#50fa7b]/10 text-[#50fa7b]",
      direction: "in" as const,
    };
  }

  return {
    className: "bg-[#ff79c6]/10 text-[#ff79c6]",
    direction: "out" as const,
  };
}

export function truncateReference(referenceId: string) {
  return `${referenceId.slice(0, 12)}...`;
}
