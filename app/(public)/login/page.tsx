"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";
import { AuthShell } from "@/components/auth/auth-shell";
import { ApiWakeGate } from "@/components/layout/api-wake-gate";
import { ApiError } from "@/lib/api-types";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/src/i18n/provider";

const loginFormSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

type LoginForm = z.infer<typeof loginFormSchema>;

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { t } = useI18n();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginForm) {
    await auth.login(values);
    router.replace("/dashboard");
  }

  const errorMessage = auth.loginError instanceof ApiError ? t("auth.login.error") : null;

  return (
    <ApiWakeGate>
      <AuthShell
        eyebrowKey="auth.login.eyebrow"
        titleKey="auth.login.title"
        subtitleKey="auth.login.subtitle"
      >
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-3"
        >
          <div>
            <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#bd93f9]/20">
              <LockKeyhole className="h-5 w-5 text-[#bd93f9]" />
            </span>
            <h2 className="text-2xl font-black text-white">{t("auth.login")}</h2>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-[#f8f8f2]">{t("auth.email")}</span>
            <input className="input-neon h-10 px-3 text-sm" type="email" {...form.register("email")} />
            <span className="mt-1 block min-h-5 text-xs text-[#ff79c6]">{form.formState.errors.email ? t("common.error") : ""}</span>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-[#f8f8f2]">{t("auth.password")}</span>
            <input className="input-neon h-10 px-3 text-sm" type="password" {...form.register("password")} />
            <span className="mt-1 block min-h-5 text-xs text-[#ff79c6]">{form.formState.errors.password ? t("common.error") : ""}</span>
          </label>

          {errorMessage ? (
            <div className="rounded-xl border border-[#ff79c6]/30 bg-[#ff79c6]/10 px-3 py-2 text-xs text-[#ff79c6]">
              {errorMessage}
            </div>
          ) : null}

          <button disabled={auth.loginPending} className="btn-bet flex h-10 w-full items-center justify-center gap-2 text-sm font-black disabled:cursor-not-allowed disabled:opacity-60">
            {auth.loginPending ? t("auth.login.loading") : t("auth.login.cta")}
            <ArrowRight className="h-4 w-4" />
          </button>

          <p className="text-center text-sm text-[#8892a4]">
            {t("auth.noAccount")} <Link className="font-semibold text-[#8be9fd]" href="/register">{t("auth.register")}</Link>
          </p>
        </motion.form>
      </AuthShell>
    </ApiWakeGate>
  );
}
