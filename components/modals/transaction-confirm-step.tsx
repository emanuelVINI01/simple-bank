"use client";

import { ArrowLeft, Loader2, Send } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { PayForm } from "@/hooks/use-transaction-modal";
import type { ApiPaymentKey, ApiUser } from "@/lib/api-types";
import { formatMoney, formatTaxId, maskEmail, maskKey } from "@/lib/format";
import { ErrorBox, StepPanel } from "@/components/modals/transaction-modal-shell";
import { useI18n } from "@/src/i18n/provider";

export function ConfirmPaymentStep({
  balance,
  errorMessage,
  form,
  idempotencyKey,
  onBack,
  onSubmit,
  paymentKey,
  pending,
}: {
  balance?: number;
  errorMessage: string | null;
  form: UseFormReturn<PayForm>;
  idempotencyKey: string;
  onBack: () => void;
  onSubmit: (values: PayForm) => Promise<void>;
  paymentKey: ApiPaymentKey;
  pending: boolean;
}) {
  const { t } = useI18n();

  return (
    <StepPanel>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <RecipientCard user={paymentKey.user} paymentKey={paymentKey.key} />
        <PaymentFields balance={balance} form={form} />
        <IdempotencyKey value={idempotencyKey} />
        {errorMessage ? <ErrorBox message={errorMessage} /> : null}
        <div className="grid gap-3 sm:grid-cols-[auto_1fr]">
          <button type="button" onClick={onBack} className="chip-btn flex h-12 items-center justify-center gap-2 px-5 text-sm">
            <ArrowLeft className="h-4 w-4" />
            {t("transfer.back")}
          </button>
          <button disabled={pending} className="btn-secondary-cta flex h-12 items-center justify-center gap-2 text-sm font-bold disabled:opacity-60">
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {pending ? t("transfer.confirmPending") : t("transfer.confirm")}
          </button>
        </div>
      </form>
    </StepPanel>
  );
}

function PaymentFields({ balance, form }: { balance?: number; form: UseFormReturn<PayForm> }) {
  const { t } = useI18n();

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-[var(--fg)]">{t("transfer.amount")}</span>
          <input className="input-neon h-12 px-4" type="number" min={0.01} step="0.01" placeholder={t("transfer.amountPlaceholder")} {...form.register("amount", { valueAsNumber: true })} />
          <span className="mt-2 block min-h-5 text-xs text-[var(--error)]">{form.formState.errors.amount ? t("common.error") : ""}</span>
        </label>
        <div className="rounded-xl border border-white/10 bg-black/20 p-3">
          <p className="text-xs text-[var(--fg-subtle)]">{t("transfer.availableBalance", { balance: "" })}</p>
          <p className="mt-1 text-xl font-bold text-[var(--accent)]">{formatMoney(balance)}</p>
        </div>
      </div>
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-[var(--fg)]">{t("transfer.description")}</span>
        <textarea className="input-neon min-h-20 px-4 py-3" placeholder={t("transfer.descriptionPlaceholder")} {...form.register("description")} />
      </label>
    </>
  );
}

function RecipientCard({ user, paymentKey }: { user: ApiUser; paymentKey: string }) {
  const { t } = useI18n();
  const initials = user.name.split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="rounded-2xl border border-[var(--info)]/20 bg-[var(--info)]/5 p-5">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--info)]">{t("transfer.youArePaying")}</p>

      <div className="mt-3 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--info)]/30 bg-[var(--info)]/10 text-lg font-bold text-[var(--info)]">
          {initials}
        </div>
        <div>
          <h3 className="text-xl font-bold text-[var(--fg)]">{user.name}</h3>
          <p className="text-sm text-[var(--fg-subtle)]">{maskEmail(user.email)}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-2 text-sm text-[var(--fg-subtle)] sm:grid-cols-2">
        <span>CPF: {formatTaxId(user.taxId)}</span>
        <span className="sm:col-span-2">Chave: <span className="font-mono text-[var(--info)]">{maskKey(paymentKey)}</span></span>
      </div>
    </div>
  );
}

function IdempotencyKey({ value }: { value: string }) {
  const { t } = useI18n();
  return (
    <div className="rounded-xl border border-white/5 bg-black/30 p-3">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--fg-subtle)]">{t("transfer.idempotencyKey")}</p>
      <p className="mt-1 break-all font-mono text-[11px] text-[var(--info)]">{value}</p>
    </div>
  );
}
