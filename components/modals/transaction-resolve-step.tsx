"use client";

import { Loader2, Search } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { ResolveForm } from "@/hooks/use-transaction-modal";
import { ErrorBox, StepPanel } from "@/components/modals/transaction-modal-shell";

export function ResolveKeyStep({
  errorMessage,
  form,
  onSubmit,
  pending,
}: {
  errorMessage: string | null;
  form: UseFormReturn<ResolveForm>;
  onSubmit: (values: ResolveForm) => Promise<void>;
  pending: boolean;
}) {
  return (
    <StepPanel>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-[#f8f8f2]">Recipient payment key</span>
          <input className="input-neon h-12 px-4 font-mono text-sm" placeholder="00000000-0000-0000-0000-000000000000" {...form.register("key")} />
          <span className="mt-2 block min-h-5 text-xs text-[#ff79c6]">{form.formState.errors.key?.message}</span>
        </label>
        {errorMessage ? <ErrorBox message={errorMessage} /> : null}
        <button disabled={pending} className="btn-bet flex h-12 w-full items-center justify-center gap-2 text-sm font-black disabled:opacity-60">
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Resolve recipient
        </button>
      </form>
    </StepPanel>
  );
}
