import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { publicUserSelect } from "@/lib/ledger-selects";
import { prisma } from "@/lib/prisma";
import { generateReceiptPdf } from "@/lib/receipt-pdf";
import { TransactionType } from "@prisma/client";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: Params) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const transaction = await prisma.transaction.findFirst({
    where: {
      id,
      userId: session.user.id,
      type: TransactionType.DEBIT,
    },
    include: {
      payer: { select: publicUserSelect },
      receiver: { select: publicUserSelect },
    },
  });

  if (!transaction) {
    return NextResponse.json({ message: "Receipt not found for this account." }, { status: 404 });
  }

  const pdf = generateReceiptPdf(transaction);

  return new Response(pdf, {
    headers: {
      "content-disposition": `inline; filename="transaction-receipt-${transaction.id}.pdf"`,
      "content-type": "application/pdf",
    },
  });
}
