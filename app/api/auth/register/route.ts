import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import z from "zod";
import { prisma } from "@/lib/prisma";
import { publicUser } from "@/lib/ledger-mappers";
import { publicUserSelect } from "@/lib/ledger-selects";

const registerSchema = z.object({
  name: z.string().trim().min(3).max(50),
  email: z.email().max(64).transform((value) => value.toLowerCase()),
  taxId: z.string().regex(/^\d{8}$/),
  password: z.string().min(8).max(128),
});

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid registration payload.", errors: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.user.findFirst({
    where: {
      OR: [
        { email: parsed.data.email },
        { taxId: parsed.data.taxId },
      ],
    },
    select: { id: true },
  });

  if (existing) {
    return NextResponse.json({ message: "Email or tax ID already registered." }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      taxId: parsed.data.taxId,
      passwordHash: await bcrypt.hash(parsed.data.password, 12),
    },
    select: publicUserSelect,
  });

  return NextResponse.json({ user: publicUser(user) }, { status: 201 });
}
