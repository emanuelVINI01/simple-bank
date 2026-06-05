import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { aiService } from "@/lib/services/ai-service";
import { prisma } from "@/lib/prisma";

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  try {
    const { textCommand, locale } = await req.json();
    if (!textCommand) {
      return NextResponse.json({ message: "Command text is required." }, { status: 400 });
    }

    const lang = locale === "pt-BR" ? "pt-BR" : "en";
    const result = await aiService.parseTransferCommand(session.user.id, textCommand, lang);

    // If recipientKey is returned and is not a UUID, attempt to resolve it to a user's payment key
    if (result.result.recipientKey && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(result.result.recipientKey)) {
      const targetUser = await prisma.user.findFirst({
        where: {
          name: {
            contains: result.result.recipientKey,
            mode: "insensitive",
          },
          // Don't allow transferring to oneself by name resolution
          id: { not: session.user.id }
        },
        include: {
          paymentKeys: {
            take: 1,
          },
        },
      });

      if (targetUser && targetUser.paymentKeys.length > 0) {
        result.result.recipientKey = targetUser.paymentKeys[0].key;
      }
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = getErrorMessage(error, "Failed to parse command");
    const status = message.includes("limit reached") ? 429 : 500;
    return NextResponse.json({ message }, { status });
  }
}
