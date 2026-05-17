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
