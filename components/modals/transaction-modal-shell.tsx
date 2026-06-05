"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import type { TransactionStep } from "@/hooks/use-transaction-modal";
import { useI18n } from "@/src/i18n/provider";

export function TransactionModalHeader({ onClose }: { onClose: () => void }) {
  const { t } = useI18n();
  return (
    <div className="mb-6 flex items-start justify-between gap-3">
      <div>
        <h2 className="text-xl font-black text-white sm:text-2xl">{t("transfer.title")}</h2>
      </div>
      <button onClick={onClose} className="chip-btn flex h-10 w-10 items-center justify-center" aria-label={t("common.close")}>
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

export function StepProgress({ step }: { step: TransactionStep }) {
  return (
    <div className="mb-6 step-indicator">
      <div className={`step-dot ${step >= 1 ? "active" : ""} ${step > 1 ? "completed" : ""}`}>1</div>
      <div className={`step-line ${step >= 2 ? "completed" : ""}`} />
      <div className={`step-dot ${step >= 2 ? "active" : ""} ${step > 2 ? "completed" : ""}`}>2</div>
      <div className={`step-line ${step >= 3 ? "completed" : ""}`} />
      <div className={`step-dot ${step >= 3 ? "active" : ""} ${step > 3 ? "completed" : ""}`}>3</div>
    </div>
  );
}

export function StepPanel({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 18, filter: "blur(6px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, x: -18, filter: "blur(6px)" }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function ErrorBox({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-[#ff79c6]/30 bg-[#ff79c6]/10 px-4 py-3 text-sm text-[#ff79c6]">
      {message}
    </div>
  );
}
