"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ExternalLink, Loader2 } from "lucide-react";
import { ErrorBox, StepPanel } from "@/components/modals/transaction-modal-shell";
import { useI18n } from "@/src/i18n/provider";

export function ReceiptStep({
  error,
  opening,
  onClose,
  onOpenReceipt,
  receipt,
}: {
  error: string | null;
  opening: boolean;
  onClose: () => void;
  onOpenReceipt: () => Promise<void>;
  receipt: { transactionId: string; receiptUrl?: string } | null;
}) {
  const { t } = useI18n();

  return (
    <StepPanel>
      <div className="py-5 text-center">
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#50fa7b]/15">
          <CheckCircle2 className="h-8 w-8 text-[#50fa7b]" />
        </motion.div>
        <h3 className="text-2xl font-black text-white">{t("transfer.success")}</h3>
        {receipt?.transactionId ? <ReceiptReference transactionId={receipt.transactionId} /> : null}
        {error ? <div className="mt-4"><ErrorBox message={error} /></div> : null}
        <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
          <button onClick={onOpenReceipt} disabled={!receipt?.transactionId || opening} className="btn-cashout flex h-12 items-center justify-center gap-2 px-6 text-sm font-bold disabled:opacity-60">
            {opening ? <Loader2 className="h-4 w-4 animate-spin" /> : <ExternalLink className="h-4 w-4" />}
            {t("transfer.openReceipt")}
          </button>
          <button onClick={onClose} className="chip-btn h-12 px-6 text-sm font-bold">{t("common.close")}</button>
        </div>
      </div>
    </StepPanel>
  );
}

function ReceiptReference({ transactionId }: { transactionId: string }) {
  const { t } = useI18n();

  return (
    <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4 text-left">
      <p className="text-xs uppercase tracking-[0.2em] text-[#8892a4]">{t("transaction.id")}</p>
      <p className="mt-2 break-all font-mono text-xs text-[#8be9fd]">{transactionId}</p>
    </div>
  );
}
