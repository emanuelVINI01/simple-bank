import { NextResponse } from "next/server";
import z from "zod";
import { auth } from "@/auth";
import { aiService } from "@/lib/services/ai-service";

const parseTransferSchema = z.object({
  textCommand: z.string().trim().min(1, "Command text is required.").max(500, "Command text is too long."),
  locale: z.enum(["pt-BR", "en"]).optional(),
});

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const payload = await req.json().catch(() => null);
  const parsed = parseTransferSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid command payload.", errors: parsed.error.flatten() }, { status: 400 });
  }

  const lang = parsed.data.locale === "pt-BR" ? "pt-BR" : "en";

  try {
    const result = await aiService.parseTransferCommand(session.user.id, parsed.data.textCommand, lang);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = getErrorMessage(error, "Failed to parse command");
    const status = message.includes("limit reached") ? 429 : 500;
    return NextResponse.json({ message }, { status });
  }
}
