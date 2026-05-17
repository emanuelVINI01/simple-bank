"use client";

import Link from "next/link";
import { KeyRound } from "lucide-react";

export function PaymentKeyPanel({
  error,
  lastKey,
  onCreate,
  pending,
}: {
  error: unknown;
  lastKey: string | null;
  onCreate: () => void;
  pending: boolean;
}) {
  return (
    <div className="glass-surface-2 rounded-xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Payment key</h2>
          <p className="mt-1 text-sm text-[#a7b0c8]">Create a key for another demo account to pay you.</p>
        </div>
        <KeyRound className="h-6 w-6 text-[#8be9fd]" />
      </div>
      {lastKey ? <NewKey keyValue={lastKey} /> : <NoSessionKey />}
      <button onClick={onCreate} disabled={pending} className="btn-cashout mt-4 h-12 w-full text-sm font-black disabled:opacity-60">
        {pending ? "Creating..." : "Generate payment key"}
      </button>
      <Link href="/payment-keys" className="chip-btn mt-3 flex h-12 items-center justify-center text-sm font-bold">
        View all keys
      </Link>
      {error ? <p className="mt-3 text-sm text-[#ff79c6]">Could not create key. You may have reached the API limit.</p> : null}
    </div>
  );
}

function NewKey({ keyValue }: { keyValue: string }) {
  return (
    <div className="rounded-2xl border border-[#8be9fd]/20 bg-[#8be9fd]/[0.06] p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-[#a7b0c8]">New key</p>
      <p className="mt-2 break-all font-mono text-sm text-[#8be9fd]">{keyValue}</p>
      <p className="mt-2 text-xs text-[#a7b0c8]">Share this with another logged-in demo user.</p>
    </div>
  );
}

function NoSessionKey() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-[#a7b0c8]">
      No key generated in this browser session.
    </div>
  );
}
