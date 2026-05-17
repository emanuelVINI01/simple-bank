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

export async function createLedgerPayment(input: CreateLedgerPaymentInput): Promise<LedgerPaymentResult> {
  const existingDebit = await findExistingDebit(input.payerId, input.idempotencyKey);

  if (existingDebit) {
    return paymentSuccess(existingDebit.id);
  }

  return prisma.$transaction(async (tx) => {
    const paymentKey = await tx.paymentKey.findUnique({
      where: { id: input.paymentKeyId },
      select: {
        user: {
          select: publicUserSelect,
        },
      },
    });

    if (!paymentKey) {
      return paymentFailure("Payment key not found.");
    }

    if (paymentKey.user.id === input.payerId) {
      return paymentFailure("You cannot pay yourself.");
    }

    const payer = await tx.user.findUnique({
      where: { id: input.payerId },
      select: publicUserSelect,
    });

    if (!payer) {
      return paymentFailure("Authenticated user not found.");
    }

    const debit = await debitPayer(tx, input.payerId, input.amount);

    if (debit.count === 0) {
      return paymentFailure("Insufficient balance.");
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
