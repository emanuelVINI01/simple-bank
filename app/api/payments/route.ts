import { NextResponse } from "next/server";
import z from "zod";
import { auth } from "@/auth";
import { createLedgerPayment } from "@/lib/payment-service";

const paymentSchema = z.object({
  paymentKey: z.string().uuid(),
  amount: z.number().int().positive(),
  description: z.string().trim().max(255).optional(),
});

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const idempotencyKey = request.headers.get("idempotency-key") ?? crypto.randomUUID();
  const payload = await request.json().catch(() => null);
  const parsed = paymentSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid payment payload.", errors: parsed.error.flatten() }, { status: 400 });
  }

  const result = await createLedgerPayment({
    payerId: session.user.id,
    paymentKeyId: parsed.data.paymentKey,
    amount: parsed.data.amount,
    description: parsed.data.description,
    idempotencyKey,
  });

  if (!result.success) {
    return NextResponse.json({ success: false, error: result.error, message: result.error }, { status: 400 });
  }

  return NextResponse.json(result, { status: 201 });
}
