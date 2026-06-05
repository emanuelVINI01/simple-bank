"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";
import { AuthShell } from "@/components/auth/auth-shell";
import { ApiWakeGate } from "@/components/layout/api-wake-gate";
import { useAuth } from "@/hooks/use-auth";
import { formatTaxId, onlyDigits } from "@/lib/format";
import { registerUserRequest } from "@/lib/services/banking-api";
import { useI18n } from "@/src/i18n/provider";

const registerFormSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.email().max(64),
  taxId: z.string().refine((value) => onlyDigits(value).length === 8),
  password: z.string()
    .min(8)
    .max(128)
    .regex(/\d/)
    .regex(/[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?`~]/),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerFormSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const auth = useAuth();
  const { t } = useI18n();

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      taxId: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: RegisterForm) {
    try {
      await registerUserRequest({
        name: values.name,
        email: values.email,
        taxId: onlyDigits(values.taxId),
        password: values.password,
      });
      await auth.login({ email: values.email, password: values.password });
      router.replace("/dashboard");
    } catch {
      form.setError("root", {
        message: t("auth.register.error"),
      });
    }
  }

  const submitError = form.formState.errors.root?.message;

  return (
    <ApiWakeGate>
      <AuthShell
        eyebrowKey="auth.register.eyebrow"
        titleKey="auth.register.title"
        subtitleKey="auth.register.subtitle"
      >
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={form.handleSubmit(onSubmit, () => undefined)}
          className="space-y-4"
        >
          <div>
            <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#50fa7b]/15">
              <ShieldCheck className="h-6 w-6 text-[#50fa7b]" />
            </span>
            <h2 className="text-3xl font-black text-white">{t("auth.register")}</h2>
          </div>

          {([
            ["name", t("auth.name"), "text"],
            ["email", t("auth.email"), "email"],
            ["taxId", t("auth.taxId"), "text"],
            ["password", t("auth.password"), "password"],
            ["confirmPassword", t("auth.confirmPassword"), "password"],
          ] as const).map(([name, label, type]) => (
            <label key={name} className="block">
              <span className="mb-2 block text-sm font-semibold text-[#f8f8f2]">{label}</span>
              <input
                className="input-neon h-12 px-4"
                type={type}
                inputMode={name === "taxId" ? "numeric" : undefined}
                placeholder={name === "taxId" ? "000.000/00" : undefined}
                {...form.register(name, name === "taxId" ? {
                  onChange: (event) => form.setValue("taxId", formatTaxId(event.target.value), { shouldDirty: true, shouldValidate: true }),
                } : undefined)}
              />
              <span className="mt-1 block min-h-5 text-xs text-[#ff79c6]">{form.formState.errors[name] ? t("common.error") : ""}</span>
            </label>
          ))}

          {submitError ? (
            <div className="rounded-2xl border border-[#ff79c6]/30 bg-[#ff79c6]/10 px-4 py-3 text-sm text-[#ff79c6]">
              {submitError}
            </div>
          ) : null}

          <button
            disabled={form.formState.isSubmitting}
            onClick={() => form.clearErrors("root")}
            className="btn-cashout flex h-13 w-full items-center justify-center gap-2 text-sm font-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            {form.formState.isSubmitting ? t("auth.register.loading") : t("auth.register.cta")}
            <ArrowRight className="h-4 w-4" />
          </button>

          <p className="text-center text-sm text-[#8892a4]">
            {t("auth.hasAccount")} <Link className="font-semibold text-[#8be9fd]" href="/login">{t("auth.login")}</Link>
          </p>
        </motion.form>
      </AuthShell>
    </ApiWakeGate>
  );
}
