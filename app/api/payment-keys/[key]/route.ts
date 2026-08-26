import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { publicPaymentKey } from "@/lib/ledger-mappers";
import { deletePaymentKeyForUser, findPaymentKeyByKeyOrId } from "@/lib/payment-key-service";

type Params = {
  params: Promise<{ key: string }>;
};

export async function GET(_request: Request, { params }: Params) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { key } = await params;
  const paymentKey = await findPaymentKeyByKeyOrId(key);

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
  const deleted = await deletePaymentKeyForUser(session.user.id, key);

  if (!deleted) {
    return NextResponse.json({ message: "Payment key not found." }, { status: 404 });
  }

  return new Response(null, { status: 204 });
}
