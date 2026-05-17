import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { publicTransaction } from "@/lib/ledger-mappers";
import { transactionSelect } from "@/lib/ledger-selects";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(Math.max(Number(searchParams.get("limit") ?? 50), 1), 100);
  const transactions = await prisma.transaction.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: transactionSelect,
  });

  return NextResponse.json({ transactions: transactions.map(publicTransaction) });
}
