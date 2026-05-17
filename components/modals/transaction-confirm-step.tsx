"use client";

import { ArrowLeft, Loader2, Send } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { PayForm } from "@/hooks/use-transaction-modal";
import type { ApiPaymentKey, ApiUser } from "@/lib/api-types";
import { formatMoney, formatTaxId, maskEmail, maskKey } from "@/lib/format";
import { ErrorBox, StepPanel } from "@/components/modals/transaction-modal-shell";

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
            Back
          </button>
          <button disabled={pending} className="btn-cashout flex h-12 items-center justify-center gap-2 text-sm font-black disabled:opacity-60">
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Confirm transfer
          </button>
        </div>
      </form>
    </StepPanel>
  );
}

function PaymentFields({ balance, form }: { balance?: number; form: UseFormReturn<PayForm> }) {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-[#f8f8f2]">Amount</span>
          <input className="input-neon h-12 px-4" type="number" min={1} {...form.register("amount", { valueAsNumber: true })} />
          <span className="mt-2 block min-h-5 text-xs text-[#ff79c6]">{form.formState.errors.amount?.message}</span>
        </label>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
          <p className="text-xs text-[#a7b0c8]">Current balance</p>
          <p className="mt-2 text-xl font-bold text-[#50fa7b]">{formatMoney(balance)}</p>
        </div>
      </div>
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-[#f8f8f2]">Description</span>
        <textarea className="input-neon min-h-20 px-4 py-3" {...form.register("description")} />
      </label>
    </>
  );
}

function RecipientCard({ user, paymentKey }: { user: ApiUser; paymentKey: string }) {
  return (
    <div className="rounded-xl border border-[#8be9fd]/20 bg-[#8be9fd]/[0.06] p-4">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#8be9fd]">You are paying</p>
      <h3 className="mt-3 text-xl font-black text-white">{user.name}</h3>
      <div className="mt-4 grid gap-2 text-sm text-[#a7b0c8] sm:grid-cols-2">
        <span>Email: {maskEmail(user.email)}</span>
        <span>Tax ID: {formatTaxId(user.taxId)}</span>
        <span className="sm:col-span-2">Key: <span className="font-mono text-[#8be9fd]">{maskKey(paymentKey)}</span></span>
      </div>
    </div>
  );
}

function IdempotencyKey({ value }: { value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
      <p className="text-xs uppercase tracking-[0.2em] text-[#a7b0c8]">Idempotency key</p>
      <p className="mt-2 break-all font-mono text-[11px] text-[#8be9fd]">{value}</p>
    </div>
  );
}
