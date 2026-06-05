import { z } from "zod";
import { parseMoneyToCents } from "@/lib/format";

export const resolveKeySchema = z.object({
  paymentKey: z.string().uuid("Informe uma chave Simple Bank valida."),
});

export const paymentSchema = z.object({
  amount: z
    .string()
    .min(1, "Informe um valor.")
    .transform(parseMoneyToCents)
    .refine((value) => Number.isInteger(value) && value > 0, "Informe um valor maior que zero."),
  description: z.string().trim().max(255, "Use no maximo 255 caracteres.").optional(),
});

export type ResolveKeyForm = z.infer<typeof resolveKeySchema>;
export type PaymentForm = z.input<typeof paymentSchema>;
export type ParsedPaymentForm = z.output<typeof paymentSchema>;
