"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import type { TransactionStep } from "@/hooks/use-transaction-modal";

const steps = ["Resolve key", "Confirm", "Receipt"];

export function TransactionModalHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="mb-5 flex items-start justify-between gap-3">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#8be9fd]">Two-step transfer</p>
        <h2 className="mt-2 text-xl font-black text-white sm:text-2xl">Send ledger payment</h2>
      </div>
      <button onClick={onClose} className="chip-btn flex h-10 w-10 items-center justify-center" aria-label="Close modal">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function StepProgress({ step }: { step: TransactionStep }) {
  return (
    <div className="mb-5 grid grid-cols-3 gap-2">
      {steps.map((label, index) => {
        const active = step >= index + 1;

        return (
          <motion.div
            key={label}
            animate={{
              scale: step === index + 1 ? 1.02 : 1,
              opacity: active ? 1 : 0.58,
            }}
            className={`rounded-2xl px-2 py-2 text-center text-[11px] font-bold sm:text-xs ${active ? "bg-[#bd93f9]/25 text-white" : "bg-white/[0.04] text-[#a7b0c8]"}`}
          >
            {label}
          </motion.div>
        );
      })}
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
