"use client";

import { Fingerprint, KeyRound, ShieldCheck } from "lucide-react";
import type { ApiUser } from "@/lib/api-types";
import { formatTaxId } from "@/lib/format";
import { useI18n } from "@/src/i18n/provider";

function getInitials(name?: string | null) {
  if (!name) return "SB";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return (parts[0]![0] ?? "S").toUpperCase();
  return ((parts[0]![0] ?? "") + (parts[parts.length - 1]![0] ?? "")).toUpperCase();
}

export function WalletIdentityPanel({ user }: { user?: ApiUser }) {
  const { t } = useI18n();

  const securityCapabilities = [
    { icon: ShieldCheck, labelKey: "dashboard.identity.security1" as const },
    { icon: Fingerprint, labelKey: "dashboard.identity.security2" as const },
    { icon: KeyRound, labelKey: "dashboard.identity.security3" as const },
  ];

  return (
    <div className="game-panel rounded-2xl p-6">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
        <div className="flex items-start gap-4">
          <div className="avatar-initials h-14 w-14 text-lg">
            {getInitials(user?.name)}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff79c6]">
              {t("dashboard.identity.title")}
            </p>
            <h2 className="mt-1 text-2xl font-black text-white">{user?.name ?? t("dashboard.identity.loading")}</h2>
            <div className="mt-2 flex flex-col gap-1 text-sm text-[#8892a4]">
              <span>{user?.email ?? "..."}</span>
              <span className="font-mono text-[#8be9fd]">
                {user?.taxId ? formatTaxId(user.taxId) : "000.000/00"}
              </span>
            </div>
          </div>
        </div>
        <span className="inline-flex h-8 items-center rounded-full bg-[#50fa7b]/10 px-4 text-xs font-bold text-[#50fa7b] border border-[#50fa7b]/20">
          {t("dashboard.identity.status")}
        </span>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {securityCapabilities.map(({ icon: Icon, labelKey }) => (
          <div key={labelKey} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-black/20 p-4 text-sm font-semibold text-[#f8f8f2]">
            <Icon className="h-5 w-5 text-[#8be9fd]" />
            {t(labelKey)}
          </div>
        ))}
      </div>
    </div>
  );
}
