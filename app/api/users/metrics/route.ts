import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const [sentResult, receivedResult, count, lastTx] = await Promise.all([
      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { userId, type: "DEBIT" },
      }),
      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { userId, type: "CREDIT" },
      }),
      prisma.transaction.count({
        where: { userId },
      }),
      prisma.transaction.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: { createdAt: true },
      }),
    ]);

    return NextResponse.json({
      metrics: {
        sent: sentResult._sum.amount ?? 0,
        received: receivedResult._sum.amount ?? 0,
        total: count,
        receipts: count,
        last: lastTx?.createdAt?.toISOString() ?? undefined,
      }
    });
  } catch {
    return NextResponse.json({ message: "Failed to aggregate metrics." }, { status: 500 });
  }
}
