import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { aiService } from "@/lib/services/ai-service";

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export async function GET(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const locale = searchParams.get("locale") === "pt-BR" ? "pt-BR" : "en";

  try {
    const result = await aiService.generateBudgetAdvice(session.user.id, locale);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = getErrorMessage(error, "Failed to generate budget advice");
    const status = message.includes("limit reached") ? 429 : 500;
    return NextResponse.json({ message }, { status });
  }
}
