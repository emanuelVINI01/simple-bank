"use client";

import { Fingerprint, KeyRound, ShieldCheck } from "lucide-react";
import type { ApiUser } from "@/lib/api-types";
import { formatTaxId } from "@/lib/format";

const securityCapabilities = [
  { icon: ShieldCheck, label: "Auth.js JWT session" },
  { icon: Fingerprint, label: "Idempotency key generated" },
  { icon: KeyRound, label: "Payment key resolution" },
];

export function WalletIdentityPanel({ user }: { user?: ApiUser }) {
  return (
    <div className="game-panel rounded-xl p-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#ff79c6]">Wallet identity</p>
          <h2 className="mt-2 text-2xl font-black text-white">{user?.name ?? "Loading user"}</h2>
          <p className="mt-2 text-sm text-[#a7b0c8]">{user?.email ?? "Fetching authenticated profile..."}</p>
          <p className="mt-1 font-mono text-sm text-[#8be9fd]">{user?.taxId ? formatTaxId(user.taxId) : "000.000/00"}</p>
        </div>
        <span className="rounded-full bg-[#50fa7b]/10 px-3 py-1 text-xs font-bold text-[#50fa7b]">reconciled</span>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {securityCapabilities.map(({ icon: Icon, label }) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm font-semibold text-[#f8f8f2]">
            <Icon className="mb-3 h-5 w-5 text-[#8be9fd]" />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
