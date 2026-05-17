import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { publicPaymentKey } from "@/lib/ledger-mappers";
import { paymentKeySelect } from "@/lib/ledger-selects";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{ key: string }>;
};

export async function GET(_request: Request, { params }: Params) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { key } = await params;
  const paymentKey = await prisma.paymentKey.findFirst({
    where: {
      OR: [
        { key },
        { id: key },
      ],
    },
    select: paymentKeySelect,
  });

  if (!paymentKey) {
    return NextResponse.json({ message: "Payment key not found." }, { status: 404 });
  }

  return NextResponse.json({ paymentKey: publicPaymentKey(paymentKey) });
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { key } = await params;
  const deleted = await prisma.paymentKey.deleteMany({
    where: {
      userId: session.user.id,
      OR: [
        { key },
        { id: key },
      ],
    },
  });

  if (deleted.count === 0) {
    return NextResponse.json({ message: "Payment key not found." }, { status: 404 });
  }

  return new Response(null, { status: 204 });
}
