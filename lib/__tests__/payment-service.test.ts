import { describe, it, expect, vi, beforeEach } from "vitest";
import { createLedgerPayment } from "../payment-service";
import { prisma } from "../prisma";
import { TransactionType } from "@prisma/client";

// Mock prisma
vi.mock("../prisma", () => ({
  prisma: {
    $transaction: vi.fn(),
    transaction: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    paymentKey: {
      findUnique: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
      updateMany: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe("payment-service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createLedgerPayment", () => {
    it("should return success immediately if existing debit is found (idempotency)", async () => {
      const mockTx = {
        transaction: {
          findFirst: vi.fn().mockResolvedValue({ id: "existing-tx-id" }),
        },
      };

      vi.mocked(prisma.$transaction).mockImplementation(async (callback: (tx: unknown) => Promise<unknown>) => {
        return callback(mockTx);
      });

      const result = await createLedgerPayment({
        amount: 100,
        idempotencyKey: "idem-key-123",
        payerId: "payer-1",
        paymentKeyId: "pk-1",
      });

      expect(result).toEqual({
        success: true,
        transactionId: "existing-tx-id",
        receiptUrl: "/api/transactions/existing-tx-id/receipt",
      });
      expect(mockTx.transaction.findFirst).toHaveBeenCalledWith({
        where: {
          userId: "payer-1",
          referenceId: "idem-key-123",
          type: TransactionType.DEBIT,
        },
        select: { id: true },
      });
    });

    it("should fail if payer has insufficient balance", async () => {
      const mockTx = {
        transaction: {
          findFirst: vi.fn().mockResolvedValue(null),
        },
        paymentKey: {
          findUnique: vi.fn().mockResolvedValue({ user: { id: "receiver-1" } }),
        },
        user: {
          findUnique: vi.fn().mockResolvedValue({ id: "payer-1" }),
          updateMany: vi.fn().mockResolvedValue({ count: 0 }), // count 0 = no rows updated = insufficient balance
        },
      };

      vi.mocked(prisma.$transaction).mockImplementation(async (callback: (tx: unknown) => Promise<unknown>) => {
        return callback(mockTx);
      });

      const result = await createLedgerPayment({
        amount: 5000,
        idempotencyKey: "idem-key-124",
        payerId: "payer-1",
        paymentKeyId: "pk-1",
      });

      expect(result).toEqual({
        success: false,
        error: "Insufficient balance.",
      });
    });

    it("should execute transaction correctly if balance is sufficient", async () => {
      const mockTx = {
        transaction: {
          findFirst: vi.fn().mockResolvedValue(null),
          create: vi.fn().mockImplementation((args: { data: { type: string } }) => {
            if (args.data.type === "DEBIT") return Promise.resolve({ id: "new-debit-tx" });
            return Promise.resolve({ id: "new-credit-tx" });
          }),
        },
        paymentKey: {
          findUnique: vi.fn().mockResolvedValue({ user: { id: "receiver-1" } }),
        },
        user: {
          findUnique: vi.fn().mockResolvedValue({ id: "payer-1" }),
          updateMany: vi.fn().mockResolvedValue({ count: 1 }), // count 1 = balance debited
          update: vi.fn().mockResolvedValue({}),
        },
      };

      vi.mocked(prisma.$transaction).mockImplementation(async (callback: (tx: unknown) => Promise<unknown>) => {
        return callback(mockTx);
      });

      const result = await createLedgerPayment({
        amount: 100,
        description: "Test payment",
        idempotencyKey: "idem-key-125",
        payerId: "payer-1",
        paymentKeyId: "pk-1",
      });

      expect(result).toEqual({
        success: true,
        transactionId: "new-debit-tx",
        receiptUrl: "/api/transactions/new-debit-tx/receipt",
      });

      // Verify DB updates
      expect(mockTx.user.updateMany).toHaveBeenCalledWith({
        where: { id: "payer-1", balance: { gte: 100 } },
        data: { balance: { decrement: 100 } },
      });

      expect(mockTx.user.update).toHaveBeenCalledWith({
        where: { id: "receiver-1" },
        data: { balance: { increment: 100 } },
      });
    });

    it("should catch P2002 error as concurrency issue", async () => {
      vi.mocked(prisma.$transaction).mockRejectedValue({ code: "P2002" });

      const result = await createLedgerPayment({
        amount: 100,
        idempotencyKey: "idem-key-concurrency",
        payerId: "payer-1",
        paymentKeyId: "pk-1",
      });

      expect(result).toEqual({
        success: false,
        error: "Concurrent request detected. Please try again or check your statement.",
      });
    });
  });
});
