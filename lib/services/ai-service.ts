import { createHash } from "crypto";
import { GoogleGenAI } from "@google/genai";
import { prisma } from "@/lib/prisma";

const DEFAULT_AI_DAILY_LIMIT = 50;
const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";

function getJsonStatus(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const status = (value as Record<string, unknown>).status;
  return typeof status === "string" ? status : undefined;
}

function getErrorCode(error: unknown) {
  if (!error || typeof error !== "object") return undefined;
  const code = (error as Record<string, unknown>).code;
  return typeof code === "string" ? code : undefined;
}

export class AiUsageLimitError extends Error {
  constructor() {
    super("AI usage limit reached for today");
  }
}

export class AiConfigurationError extends Error {
  constructor() {
    super("Gemini API key is not configured");
  }
}

export class AiConcurrencyError extends Error {
  constructor() {
    super("Another AI operation is already in progress");
  }
}

const activeUserLocks = new Set<string>();

class AiService {
  private getApiKey() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "replace-with-gemini-api-key" || apiKey.startsWith("replace-with-")) {
      throw new AiConfigurationError();
    }
    return apiKey;
  }

  private getModel() {
    return process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
  }

  private getDailyLimit() {
    const configuredLimit = Number(process.env.AI_DAILY_LIMIT);
    return Number.isFinite(configuredLimit) && configuredLimit > 0
      ? Math.floor(configuredLimit)
      : DEFAULT_AI_DAILY_LIMIT;
  }

  private getUsageWindow() {
    const start = new Date();
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);
    return { end, start };
  }

  async getUsageSummary(userId: string) {
    const { start, end } = this.getUsageWindow();
    const [used, cacheHits, totalRequests] = await Promise.all([
      prisma.aiUsageEvent.count({
        where: { userId, cacheHit: false, createdAt: { gte: start, lt: end } },
      }),
      prisma.aiUsageEvent.count({
        where: { userId, cacheHit: true, createdAt: { gte: start, lt: end } },
      }),
      prisma.aiUsageEvent.count({
        where: { userId, createdAt: { gte: start, lt: end } },
      }),
    ]);
    const limit = this.getDailyLimit();

    return {
      used,
      cacheHits,
      totalRequests,
      limit,
      remaining: Math.max(limit - used, 0),
      periodStart: start.toISOString(),
      periodEnd: end.toISOString(),
    };
  }

  private async recordUsageEvent(input: {
    userId: string;
    cacheHit: boolean;
    txnHash: string | null;
    model: string;
  }) {
    if (input.txnHash) {
      // Ensure that a matching AiTransactionAnalysis exists so the foreign key relation doesn't throw.
      const analysisExists = await prisma.aiTransactionAnalysis.findUnique({
        where: { txnHash: input.txnHash },
      });
      if (!analysisExists) {
        try {
          await prisma.aiTransactionAnalysis.create({
            data: {
              txnHash: input.txnHash,
              model: input.model,
              result: { status: "placeholder" },
            },
          });
        } catch {
          // Ignore race condition if another request created it concurrently
        }
      }
    }
    return prisma.aiUsageEvent.create({
      data: {
        userId: input.userId,
        cacheHit: input.cacheHit,
        txnHash: input.txnHash,
        model: input.model,
      },
    });
  }

  async analyzeTransaction(
    userId: string,
    txn: {
      payerId: string | null;
      receiverId: string | null;
      amount: number; // in cents
      description: string | null;
    },
    locale: "pt-BR" | "en",
    forceRefresh = false
  ) {
    if (activeUserLocks.has(userId)) {
      throw new AiConcurrencyError();
    }
    activeUserLocks.add(userId);

    try {
      const payerStr = txn.payerId || "system";
      const receiverStr = txn.receiverId || "system";
      const descStr = (txn.description || "").trim();
      const amountStr = txn.amount.toString();

      // Compute hash of transaction metadata
      const normalizedStr = `${payerStr}_${receiverStr}_${descStr}_${amountStr}`;
      const txnHash = createHash("sha256").update(normalizedStr, "utf8").digest("hex");
      const model = this.getModel();

      if (forceRefresh) {
        try {
          await prisma.aiTransactionAnalysis.delete({ where: { txnHash } });
        } catch {}
      }

      let cached = forceRefresh ? null : await prisma.aiTransactionAnalysis.findUnique({ where: { txnHash } });

      if (cached) {
        if (getJsonStatus(cached.result) === "pending") {
          // Another concurrent request is running. Wait and poll.
          let attempts = 0;
          while (attempts < 60) {
            await new Promise((resolve) => setTimeout(resolve, 500));
            cached = await prisma.aiTransactionAnalysis.findUnique({ where: { txnHash } });
            if (!cached) break;
            if (getJsonStatus(cached.result) !== "pending") break;
            attempts++;
          }
        }

        if (cached && getJsonStatus(cached.result) !== "pending") {
          await this.recordUsageEvent({
            userId,
            cacheHit: true,
            txnHash,
            model: cached.model,
          });

          return {
            analysis: cached.result,
            cacheHit: true,
            txnHash,
            usage: await this.getUsageSummary(userId),
          };
        }

        if (cached && getJsonStatus(cached.result) === "pending") {
          try {
            await prisma.aiTransactionAnalysis.delete({ where: { txnHash } });
          } catch {}
          throw new Error("AI analysis timed out. Please try again.");
        }
      }

      // Check daily limit before calling API
      const usage = await this.getUsageSummary(userId);
      if (usage.remaining <= 0) {
        throw new AiUsageLimitError();
      }

      // Create a pending record to lock database transaction
      let pendingCreated = false;
      try {
        await prisma.aiTransactionAnalysis.create({
          data: {
            txnHash,
            model,
            result: { status: "pending" },
          },
        });
        pendingCreated = true;
      } catch (err: unknown) {
        // Unique key constraint violation P2002 -> another concurrent request created it
        if (getErrorCode(err) === "P2002") {
          let attempts = 0;
          while (attempts < 60) {
            await new Promise((resolve) => setTimeout(resolve, 500));
            cached = await prisma.aiTransactionAnalysis.findUnique({ where: { txnHash } });
            if (!cached) break;
            if (getJsonStatus(cached.result) !== "pending") break;
            attempts++;
          }

          if (cached && getJsonStatus(cached.result) !== "pending") {
            await this.recordUsageEvent({
              userId,
              cacheHit: true,
              txnHash,
              model: cached.model,
            });

            return {
              analysis: cached.result,
              cacheHit: true,
              txnHash,
              usage: await this.getUsageSummary(userId),
            };
          }
        }
        throw err;
      }

      if (pendingCreated) {
        try {
          const apiKey = this.getApiKey();
          const ai = new GoogleGenAI({ apiKey });

          const amountFormatted = (txn.amount / 100).toFixed(2);
          const langName = locale === "pt-BR" ? "Portuguese from Brazil" : "English";

          const prompt = locale === "pt-BR"
            ? [
                "Você é o analista financeiro inteligente do Simple Bank.",
                `Responda apenas em ${langName}.`,
                "Analise os detalhes desta transação bancária e retorne um objeto JSON combinando perfeitamente com o esquema fornecido.",
                `Valor: R$ ${amountFormatted}`,
                `Descrição Original: "${txn.description || "Nenhuma descrição fornecida"}"`,
                `Tipo da Transação: ${txn.payerId === userId ? "Débito (Enviado)" : "Crédito (Recebido)"}`,
                "",
                "Tarefas do JSON:",
                "1. Categorize a transação em uma destas opções: 'Alimentação', 'Moradia', 'Utilidades/Contas', 'Transporte', 'Lazer', 'Salário', 'Transferência', 'Outros'.",
                "2. Crie uma descrição amigável simplificada (ex: 'Almoço no restaurante' ou 'Transferência recebida').",
                "3. Avalie o risco de fraude (pontuação de 0 a 100) com base no valor e descrição. Se parecer normal, a pontuação deve ser baixa (< 15).",
                "4. Dê uma dica financeira personalizada baseada nesta categoria.",
              ].join("\n")
            : [
                "You are Simple Bank's intelligent financial analyst.",
                `Reply only in ${langName}.`,
                "Analyze the bank transaction details below and return a JSON matching the requested schema.",
                `Amount: $ ${amountFormatted}`,
                `Original Description: "${txn.description || "No description provided"}"`,
                `Type: ${txn.payerId === userId ? "Debit (Sent)" : "Credit (Received)"}`,
                "",
                "JSON Tasks:",
                "1. Categorize the transaction into one of: 'Food', 'Housing', 'Utilities', 'Transportation', 'Leisure', 'Salary', 'Transfer', 'Others'.",
                "2. Generate a friendly, simplified description (e.g. 'Lunch at diner' or 'Transfer received').",
                "3. Evaluate fraud risk (score 0 to 100) based on amount and description. If typical, score should be low (< 15).",
                "4. Provide a tailored budgeting tip related to this category.",
              ].join("\n");

          const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseJsonSchema: {
                type: "object",
                additionalProperties: false,
                required: ["category", "friendlyDescription", "riskScore", "riskLevel", "riskExplanation", "budgetTip"],
                properties: {
                  category: { type: "string" },
                  friendlyDescription: { type: "string" },
                  riskScore: { type: "integer", minimum: 0, maximum: 100 },
                  riskLevel: { type: "string", enum: ["low", "medium", "high"] },
                  riskExplanation: { type: "string" },
                  budgetTip: { type: "string" },
                },
              },
              temperature: 0.25,
            },
          });

          const result = JSON.parse(response.text ?? "{}");

          await prisma.aiTransactionAnalysis.update({
            where: { txnHash },
            data: { result },
          });

          await this.recordUsageEvent({
            userId,
            cacheHit: false,
            txnHash,
            model,
          });

          return {
            analysis: result,
            cacheHit: false,
            txnHash,
            usage: await this.getUsageSummary(userId),
          };
        } catch (error) {
          try {
            await prisma.aiTransactionAnalysis.delete({ where: { txnHash } });
          } catch {}
          throw error;
        }
      }

      throw new Error("Failed to process transaction analysis.");
    } finally {
      activeUserLocks.delete(userId);
    }
  }

  async parseTransferCommand(userId: string, textCommand: string, locale: "pt-BR" | "en") {
    const usage = await this.getUsageSummary(userId);
    if (usage.remaining <= 0) {
      throw new AiUsageLimitError();
    }

    const apiKey = this.getApiKey();
    const ai = new GoogleGenAI({ apiKey });
    const model = this.getModel();

    const systemPrompt = locale === "pt-BR"
      ? [
          "Você é o assistente de transferência por voz/texto do Simple Bank.",
          "Analise o comando em linguagem natural do usuário e extraia as informações de transferência.",
          "Retorne um único objeto JSON combinando perfeitamente com o esquema.",
          "Converta o valor financeiro para centavos (ex: 'R$ 50', '50 reais', '50.00' devem se tornar 5000; 'cem reais' deve se tornar 10000).",
          "Se o usuário mencionar um nome ou chave de pagamento UUID, coloque no campo 'recipientKey'. Se for um nome próprio, coloque o nome.",
          "Extraia a descrição ou motivo se mencionado (ex: 'para a pizza' -> 'pizza').",
        ].join("\n")
      : [
          "You are Simple Bank's voice/text transfer parsing assistant.",
          "Analyze the user's natural language command and extract the transfer variables.",
          "Return a single JSON object matching the requested schema.",
          "Convert the financial amount to cents (e.g., '$50', '50 dollars', '50.00' should become 5000; 'one hundred dollars' should become 10000).",
          "If the user mentions a name or UUID payment key, put it in 'recipientKey'.",
          "Extract the description or reason if mentioned (e.g. 'for pizza' -> 'pizza').",
        ].join("\n");

    const response = await ai.models.generateContent({
      model,
      contents: [systemPrompt, `Command: "${textCommand}"`].join("\n"),
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: {
          type: "object",
          additionalProperties: false,
          required: ["recipientKey", "amount", "description"],
          properties: {
            recipientKey: { type: "string", nullable: true },
            amount: { type: "integer", nullable: true },
            description: { type: "string", nullable: true },
          },
        },
        temperature: 0.1,
      },
    });

    const result = JSON.parse(response.text ?? "{}");

    await this.recordUsageEvent({
      userId,
      cacheHit: false,
      txnHash: null,
      model,
    });

    return {
      result: result as { recipientKey: string | null; amount: number | null; description: string | null },
      usage: await this.getUsageSummary(userId),
    };
  }

  async generateBudgetAdvice(userId: string, locale: "pt-BR" | "en") {
    if (activeUserLocks.has(userId)) {
      throw new AiConcurrencyError();
    }
    activeUserLocks.add(userId);

    try {
      const usage = await this.getUsageSummary(userId);
      if (usage.remaining <= 0) {
        throw new AiUsageLimitError();
      }

      const apiKey = this.getApiKey();
      const ai = new GoogleGenAI({ apiKey });
      const model = this.getModel();

      // Retrieve past 30 days of transactions
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const transactions = await prisma.transaction.findMany({
        where: {
          userId,
          createdAt: { gte: thirtyDaysAgo },
        },
        orderBy: { createdAt: "desc" },
      });

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { balance: true, name: true },
      });

      const currentBalanceCents = user?.balance ?? 0;

      // Group metadata for AI
      const txList = transactions.map((t) => ({
        type: t.type, // DEBIT (Sent) or CREDIT (Received)
        amountCents: t.amount,
        description: t.description || "No description",
        date: t.createdAt.toISOString().slice(0, 10),
      }));

      const langName = locale === "pt-BR" ? "Portuguese from Brazil" : "English";

      const prompt = locale === "pt-BR"
        ? [
            "Você é o consultor de finanças pessoais do Simple Bank.",
            `Responda apenas em ${langName}.`,
            "Analise o histórico recente do usuário e forneça um relatório em formato JSON com feedback construtivo.",
            `Nome do Usuário: ${user?.name || "Cliente"}`,
            `Saldo Atual: R$ ${(currentBalanceCents / 100).toFixed(2)}`,
            "Transações nos últimos 30 dias:",
            JSON.stringify(txList),
            "",
            "Instruções do JSON:",
            "1. 'summary': Um parágrafo resumindo as tendências de gastos (ex: se está gastando muito com lazer ou transferindo em excesso).",
            "2. 'recommendations': Uma lista (3 a 5 itens) de dicas acionáveis (ex: 'Reduza transferências de lazer no final de semana').",
            "3. 'categoryBreakdown': Distribuição estimada dos débitos categorizados, contendo a categoria, a porcentagem e o total em centavos.",
          ].join("\n")
        : [
            "You are Simple Bank's personal finance advisor.",
            `Reply only in ${langName}.`,
            "Analyze the user's transaction ledger history and return a JSON financial report.",
            `User Name: ${user?.name || "Customer"}`,
            `Current Balance: $ ${(currentBalanceCents / 100).toFixed(2)}`,
            "Transactions over the past 30 days:",
            JSON.stringify(txList),
            "",
            "JSON Instructions:",
            "1. 'summary': A paragraph summarizing spending trends.",
            "2. 'recommendations': An array (3-5 items) of actionable recommendations.",
            "3. 'categoryBreakdown': Breakdown of categorized debits, detailing category, percentage (0-100), and total in cents.",
          ].join("\n");

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseJsonSchema: {
            type: "object",
            additionalProperties: false,
            required: ["summary", "recommendations", "categoryBreakdown"],
            properties: {
              summary: { type: "string" },
              recommendations: {
                type: "array",
                items: { type: "string" },
              },
              categoryBreakdown: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  required: ["category", "percentage", "totalCents"],
                  properties: {
                    category: { type: "string" },
                    percentage: { type: "integer", minimum: 0, maximum: 100 },
                    totalCents: { type: "integer" },
                  },
                },
              },
            },
          },
          temperature: 0.3,
        },
      });

      const result = JSON.parse(response.text ?? "{}");

      await this.recordUsageEvent({
        userId,
        cacheHit: false,
        txnHash: null,
        model,
      });

      return {
        result,
        usage: await this.getUsageSummary(userId),
      };
    } finally {
      activeUserLocks.delete(userId);
    }
  }
}

export const aiService = new AiService();
