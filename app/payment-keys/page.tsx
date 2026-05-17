"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Plus } from "lucide-react";
import { ApiWakeGate } from "@/components/layout/api-wake-gate";
import { AppFooter } from "@/components/layout/app-footer";
import { AppHeader } from "@/components/layout/app-header";
import { EmptyPaymentKeys } from "@/components/payment-keys/empty-payment-keys";
import { PaymentKeyCard } from "@/components/payment-keys/payment-key-card";
import { PaymentKeySummary } from "@/components/payment-keys/payment-key-summary";
import { useRequireAuth } from "@/hooks/use-auth";
import { usePaymentKeyActions } from "@/hooks/use-payment-key-actions";
import { usePaymentKeys } from "@/hooks/use-wallet";
import { formatTaxId } from "@/lib/format";

export default function PaymentKeysPage() {
  const auth = useRequireAuth();
  const keysQuery = usePaymentKeys(Boolean(auth.token));
  const keyActions = usePaymentKeyActions();
  const paymentKeys = keysQuery.data ?? [];

  return (
    <ApiWakeGate>
      <div className="min-h-screen">
        <AppHeader />
        <main className="mx-auto max-w-7xl px-4 py-6 pb-6 sm:px-6 sm:py-8">
          <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mb-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <Link href="/dashboard" className="chip-btn mb-5 inline-flex h-10 items-center gap-2 px-3 text-sm">
                <ArrowLeft className="h-4 w-4" />
                Back to dashboard
              </Link>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#8be9fd]">Payment key vault</p>
              <h1 className="mt-3 text-4xl font-black text-white sm:text-5xl">Your receivable keys</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#a7b0c8]">
                These UUID keys are the pix-like identifiers another authenticated wallet uses to resolve your public user data before paying.
              </p>
            </div>
            <button onClick={keyActions.createPaymentKey} disabled={keyActions.createPending} className="btn-cashout flex h-13 items-center justify-center gap-2 px-6 text-sm font-black disabled:opacity-60">
              {keyActions.createPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Generate key
            </button>
          </motion.section>

          {keyActions.feedback ? (
            <div className="mb-6 rounded-2xl border border-[#8be9fd]/25 bg-[#8be9fd]/[0.07] px-4 py-3 text-sm text-[#B8F6FF]">
              {keyActions.feedback}
            </div>
          ) : null}

          <PaymentKeySummary totalKeys={paymentKeys.length} ownerTaxId={auth.user?.taxId ? formatTaxId(auth.user.taxId) : "000.000/00"} />

          {keysQuery.isLoading ? (
            <div className="glass-surface-2 h-96 animate-pulse rounded-xl" />
          ) : paymentKeys.length === 0 ? (
            <EmptyPaymentKeys onCreate={keyActions.createPaymentKey} pending={keyActions.createPending} />
          ) : (
            <section className="grid gap-4 lg:grid-cols-2">
              {paymentKeys.map((paymentKey, index) => (
                <PaymentKeyCard
                  key={paymentKey.id}
                  index={index}
                  paymentKey={paymentKey}
                  deleting={keyActions.deletingKey === paymentKey.key}
                  onCopy={keyActions.copyPaymentKey}
                  onDelete={keyActions.removePaymentKey}
                />
              ))}
            </section>
          )}
        </main>
        <AppFooter />
      </div>
    </ApiWakeGate>
  );
}
