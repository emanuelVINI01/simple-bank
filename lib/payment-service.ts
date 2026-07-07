import type { Prisma } from "@prisma/client";
import { TransactionType } from "@prisma/client";
import { publicUserSelect } from "@/lib/ledger-selects";
import { prisma } from "@/lib/prisma";

type CreateLedgerPaymentInput = {
  amount: number;
  description?: string;
  idempotencyKey: string;
  payerId: string;
  paymentKeyId: string;
};

type LedgerPaymentResult =
  | {
      success: true;
      transactionId: string;
      receiptUrl: string;
    }
  | {
      success: false;
      error: string;
    };

class PaymentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PaymentError";
  }
}

export async function createLedgerPayment(input: CreateLedgerPaymentInput): Promise<LedgerPaymentResult> {
  try {
    return await prisma.$transaction(async (tx) => {
      const existingDebit = await tx.transaction.findFirst({
        where: {
          userId: input.payerId,
          referenceId: input.idempotencyKey,
          type: TransactionType.DEBIT,
        },
        select: { id: true },
      });

      if (existingDebit) {
        return paymentSuccess(existingDebit.id);
      }

      const paymentKey = await tx.paymentKey.findUnique({
        where: { id: input.paymentKeyId },
        select: {
          user: {
            select: publicUserSelect,
          },
        },
      });

      if (!paymentKey) {
        throw new PaymentError("Payment key not found.");
      }

      if (paymentKey.user.id === input.payerId) {
        throw new PaymentError("You cannot pay yourself.");
      }

      const payer = await tx.user.findUnique({
        where: { id: input.payerId },
        select: publicUserSelect,
      });

      if (!payer) {
        throw new PaymentError("Authenticated user not found.");
      }

      const debit = await debitPayer(tx, input.payerId, input.amount);

      if (debit.count === 0) {
        throw new PaymentError("Insufficient balance.");
      }

      await creditReceiver(tx, paymentKey.user.id, input.amount);

      const debitTransaction = await createPairedTransactions(tx, {
        amount: input.amount,
        description: input.description,
        idempotencyKey: input.idempotencyKey,
        payerId: payer.id,
        receiverId: paymentKey.user.id,
      });

      return paymentSuccess(debitTransaction.id);
    });
  } catch (error) {
    if (error instanceof PaymentError) {
      return paymentFailure(error.message);
    }
    
    // Unique constraint violation in Prisma (P2002) for idempotency key
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      // It means another transaction inserted the same referenceId concurrently
      // We can try to fetch it and return success, but falling back to generic error is also okay.
      return paymentFailure("Concurrent request detected. Please try again or check your statement.");
    }

    throw error;
  }
}

function findExistingDebit(payerId: string, idempotencyKey: string) {
  return prisma.transaction.findFirst({
    where: {
      userId: payerId,
      referenceId: idempotencyKey,
      type: TransactionType.DEBIT,
    },
    select: { id: true },
  });
}

function debitPayer(tx: Prisma.TransactionClient, payerId: string, amount: number) {
  return tx.user.updateMany({
    where: {
      id: payerId,
      balance: { gte: amount },
    },
    data: {
      balance: { decrement: amount },
    },
  });
}

function creditReceiver(tx: Prisma.TransactionClient, receiverId: string, amount: number) {
  return tx.user.update({
    where: { id: receiverId },
    data: {
      balance: { increment: amount },
    },
  });
}

function paymentSuccess(transactionId: string): LedgerPaymentResult {
  return {
    success: true,
    transactionId,
    receiptUrl: `/api/transactions/${transactionId}/receipt`,
  };
}

function paymentFailure(error: string): LedgerPaymentResult {
  return {
    success: false,
    error,
  };
}

async function createPairedTransactions(
  tx: Prisma.TransactionClient,
  input: {
    amount: number;
    description?: string;
    idempotencyKey: string;
    payerId: string;
    receiverId: string;
  },
) {
  const transactionData = {
    amount: input.amount,
    referenceId: input.idempotencyKey,
    description: input.description || null,
    payerId: input.payerId,
    receiverId: input.receiverId,
  };

  const debitTransaction = await tx.transaction.create({
    data: {
      ...transactionData,
      userId: input.payerId,
      type: TransactionType.DEBIT,
    },
  });

  await tx.transaction.create({
    data: {
      ...transactionData,
      userId: input.receiverId,
      type: TransactionType.CREDIT,
    },
  });

  return debitTransaction;
}
