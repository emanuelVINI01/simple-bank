import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Informe um email valido.").transform((value) => value.toLowerCase()),
  password: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres."),
});

export const registerSchema = z.object({
  name: z.string().trim().min(3, "Informe seu nome completo.").max(50, "Use no maximo 50 caracteres."),
  email: z.email("Informe um email valido.").max(64, "Use no maximo 64 caracteres.").transform((value) => value.toLowerCase()),
  taxId: z.string().transform((value) => value.replace(/\D/g, "")).pipe(z.string().regex(/^\d{8}$/, "Informe exatamente 8 digitos.")),
  password: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres.").max(128, "Use no maximo 128 caracteres."),
});

export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
