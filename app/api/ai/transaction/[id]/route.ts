import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { aiService } from "@/lib/services/ai-service";
import { prisma } from "@/lib/prisma";

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const { locale, forceRefresh } = await req.json().catch(() => ({}));
  const lang = locale === "pt-BR" ? "pt-BR" : "en";

  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        payer: { select: { name: true } },
        receiver: { select: { name: true } },
      },
    });

    if (!transaction) {
      return NextResponse.json({ message: "Transaction not found." }, { status: 404 });
    }

    // Security check: Only the transaction owner (user who has this ledger row) can analyze it
    if (transaction.userId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

    const result = await aiService.analyzeTransaction(
      session.user.id,
      {
        payerId: transaction.payerId,
        receiverId: transaction.receiverId,
        amount: transaction.amount,
        description: transaction.description,
      },
      lang,
      !!forceRefresh
    );

    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = getErrorMessage(error, "Failed to analyze transaction");
    const status = message.includes("limit reached") ? 429 : 500;
    return NextResponse.json({ message }, { status });
  }
}
