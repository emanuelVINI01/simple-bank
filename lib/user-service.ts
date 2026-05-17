import { publicUserSelect } from "@/lib/ledger-selects";
import { prisma } from "@/lib/prisma";

export function findCurrentUser(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: publicUserSelect,
  });
}
