import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { aiService } from "@/lib/services/ai-service";

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  try {
    const summary = await aiService.getUsageSummary(session.user.id);
    return NextResponse.json(summary);
  } catch (error: unknown) {
    return NextResponse.json({ message: getErrorMessage(error, "Failed to load usage summary") }, { status: 500 });
  }
}
