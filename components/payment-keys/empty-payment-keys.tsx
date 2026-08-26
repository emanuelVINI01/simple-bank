"use client";

import { KeyRound, Loader2, Plus } from "lucide-react";

export function EmptyPaymentKeys({ onCreate, pending }: { onCreate: () => void; pending: boolean }) {
  return (
    <div className="glass-surface-2 flex min-h-[360px] flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] p-8 text-center">
      <KeyRound className="mb-5 h-12 w-12 text-[var(--info)]" />
      <h2 className="text-2xl font-bold text-[var(--fg)]">No active payment keys</h2>
      <p className="mt-3 max-w-md text-sm leading-6 text-[var(--fg-muted)]">
        Generate one key to let other accounts resolve your wallet before sending a secure ledger transfer.
      </p>
      <button onClick={onCreate} disabled={pending} className="btn-primary-cta mt-7 inline-flex h-12 items-center gap-2 px-6 text-sm font-bold disabled:opacity-60">
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        Generate first key
      </button>
    </div>
  );
}
