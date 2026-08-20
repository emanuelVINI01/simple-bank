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

type RegisterFormValues = z.infer<typeof registerFormSchema>;

function RegisterForm() {
  const router = useRouter();
  const auth = useAuth();
  const { t } = useI18n();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      taxId: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: RegisterFormValues) {
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
  
  const fields = [
    { name: "name" as const, label: t("auth.name"), type: "text" },
    { name: "email" as const, label: t("auth.email"), type: "email" },
    { name: "taxId" as const, label: t("auth.taxId"), type: "text", inputMode: "numeric" as const, placeholder: "000.000/00" },
    { name: "password" as const, label: t("auth.password"), type: "password" },
    { name: "confirmPassword" as const, label: t("auth.confirmPassword"), type: "password" },
  ];

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={form.handleSubmit(onSubmit, () => undefined)}
      className="space-y-3"
    >
      <div>
        <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#50fa7b]/15">
          <ShieldCheck className="h-5 w-5 text-[#50fa7b]" />
        </span>
        <h2 className="text-2xl font-black text-white">{t("auth.register")}</h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {fields.map((field) => (
          <label key={field.name} className={`block ${field.name === "taxId" ? "sm:col-span-2" : ""}`}>
            <span className="mb-1.5 block text-xs font-semibold text-[#f8f8f2]">{field.label}</span>
            <input
              className="input-neon h-10 px-3 text-sm"
              type={field.type}
              inputMode={field.inputMode}
              placeholder={field.placeholder}
              {...form.register(field.name, field.name === "taxId" ? {
                onChange: (event) => form.setValue("taxId", formatTaxId(event.target.value), { shouldDirty: true, shouldValidate: true }),
              } : undefined)}
            />
            <span className="mt-1 block min-h-4 text-xs text-[#ff79c6]">{form.formState.errors[field.name] ? t("common.error") : ""}</span>
          </label>
        ))}
      </div>

      {submitError ? (
        <div className="rounded-xl border border-[#ff79c6]/30 bg-[#ff79c6]/10 px-3 py-2 text-xs text-[#ff79c6]">
          {submitError}
        </div>
      ) : null}

      <button
        disabled={form.formState.isSubmitting}
        onClick={() => form.clearErrors("root")}
        className="btn-cashout flex h-10 w-full items-center justify-center gap-2 text-sm font-black disabled:cursor-not-allowed disabled:opacity-60"
      >
        {form.formState.isSubmitting ? t("auth.register.loading") : t("auth.register.cta")}
        <ArrowRight className="h-4 w-4" />
      </button>

      <p className="text-center text-sm text-[#8892a4]">
        {t("auth.hasAccount")} <Link className="font-semibold text-[#8be9fd]" href="/login">{t("auth.login")}</Link>
      </p>
    </motion.form>
  );
}

export function RegisterPage() {
  return (
    <ApiWakeGate>
      <AuthShell
        eyebrowKey="auth.register.eyebrow"
        titleKey="auth.register.title"
        subtitleKey="auth.register.subtitle"
      >
        <RegisterForm />
      </AuthShell>
    </ApiWakeGate>
  );
}
