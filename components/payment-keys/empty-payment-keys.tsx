"use client";

import { KeyRound, Loader2, Plus } from "lucide-react";

export function EmptyPaymentKeys({ onCreate, pending }: { onCreate: () => void; pending: boolean }) {
  return (
    <div className="glass-surface-2 flex min-h-[360px] flex-col items-center justify-center rounded-xl p-8 text-center">
      <KeyRound className="mb-5 h-12 w-12 text-[#8be9fd]" />
      <h2 className="text-2xl font-black text-white">No active payment keys</h2>
      <p className="mt-3 max-w-md text-sm leading-6 text-[#a7b0c8]">
        Generate one key to let another demo wallet resolve your account before sending a ledger transfer.
      </p>
      <button onClick={onCreate} disabled={pending} className="btn-bet mt-7 inline-flex h-12 items-center gap-2 px-6 text-sm font-black disabled:opacity-60">
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        Generate first key
      </button>
    </div>
  );
}
