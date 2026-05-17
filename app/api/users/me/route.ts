import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { publicUser } from "@/lib/ledger-mappers";
import { findCurrentUser } from "@/lib/user-service";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const user = await findCurrentUser(session.user.id);

  if (!user) {
    return NextResponse.json({ message: "User not found." }, { status: 404 });
  }

  return NextResponse.json({ user: publicUser(user) });
}
