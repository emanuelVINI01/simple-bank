import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { publicPaymentKey } from "@/lib/ledger-mappers";
import { paymentKeySelect } from "@/lib/ledger-selects";
import { createPaymentKey } from "@/lib/payment-key-service";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const paymentKeys = await prisma.paymentKey.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: paymentKeySelect,
  });

  return NextResponse.json({ paymentKeys: paymentKeys.map(publicPaymentKey) });
}

export async function POST() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  try {
    const paymentKey = await createPaymentKey(session.user.id);
    return NextResponse.json({ paymentKey: publicPaymentKey(paymentKey) }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Could not create payment key." }, { status: 400 });
  }
}
