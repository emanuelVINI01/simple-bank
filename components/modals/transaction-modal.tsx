"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTransactionModal } from "@/hooks/use-transaction-modal";
import { ConfirmPaymentStep } from "@/components/modals/transaction-confirm-step";
import { TransactionModalHeader, StepProgress } from "@/components/modals/transaction-modal-shell";
import { ReceiptStep } from "@/components/modals/transaction-receipt-step";
import { ResolveKeyStep } from "@/components/modals/transaction-resolve-step";

export function TransactionModal({
  balance,
  onClose,
  open,
}: {
  balance?: number;
  onClose: () => void;
  open: boolean;
}) {
  const flow = useTransactionModal(open);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-lg sm:items-center sm:p-4"
        >
          <motion.section
            initial={{ y: 18, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 16, opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="glass-surface max-h-[94dvh] w-full max-w-lg overflow-y-auto rounded-t-[26px] p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] sm:max-h-[88vh] sm:rounded-2xl sm:p-6"
          >
            <TransactionModalHeader onClose={onClose} />
            <StepProgress step={flow.step} />

            <AnimatePresence mode="wait" initial={false}>
              {flow.step === 1 ? (
                <ResolveKeyStep
                  key="resolve"
                  errorMessage={flow.errorMessage}
                  form={flow.resolveForm}
                  onSubmit={flow.resolveKey}
                  pending={flow.resolvePending}
                />
              ) : null}

              {flow.step === 2 && flow.resolved ? (
                <ConfirmPaymentStep
                  key="confirm"
                  balance={balance}
                  errorMessage={flow.errorMessage}
                  form={flow.payForm}
                  idempotencyKey={flow.idempotencyKey}
                  onBack={flow.goToResolveStep}
                  onSubmit={flow.confirmPayment}
                  paymentKey={flow.resolved}
                  pending={flow.payPending}
                />
              ) : null}

              {flow.step === 3 ? (
                <ReceiptStep
                  key="receipt"
                  error={flow.receiptError}
                  opening={flow.openingReceipt}
                  onClose={onClose}
                  onOpenReceipt={flow.accessReceipt}
                  receipt={flow.receipt}
                />
              ) : null}
            </AnimatePresence>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
