import { paymentKeySelect, USER_PAYMENT_KEY_LIMIT } from "@/lib/ledger-selects";
import { prisma } from "@/lib/prisma";

export async function createPaymentKey(userId: string) {
  const existingKeys = await prisma.paymentKey.count({ where: { userId } });

  if (existingKeys >= USER_PAYMENT_KEY_LIMIT) {
    throw new Error("Payment key limit reached.");
  }

  return prisma.paymentKey.create({
    data: {
      userId,
      key: crypto.randomUUID(),
    },
    select: paymentKeySelect,
  });
}

export function listPaymentKeys(userId: string) {
  return prisma.paymentKey.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: paymentKeySelect,
  });
}

export function findPaymentKeyByKeyOrId(keyOrId: string) {
  return prisma.paymentKey.findFirst({
    where: {
      OR: [{ key: keyOrId }, { id: keyOrId }],
    },
    select: paymentKeySelect,
  });
}

export async function deletePaymentKeyForUser(userId: string, keyOrId: string) {
  const deleted = await prisma.paymentKey.deleteMany({
    where: {
      userId,
      OR: [{ key: keyOrId }, { id: keyOrId }],
    },
  });

  return deleted.count > 0;
}
