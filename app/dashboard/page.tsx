"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { DashboardInsights } from "@/components/dashboard/dashboard-insights";
import { DashboardSummary } from "@/components/dashboard/dashboard-summary";
import { LedgerChart } from "@/components/dashboard/ledger-chart";
import { PaymentKeyPanel } from "@/components/dashboard/payment-key-panel";
import { WalletIdentityPanel } from "@/components/dashboard/wallet-identity-panel";
import { ApiWakeGate } from "@/components/layout/api-wake-gate";
import { AppFooter } from "@/components/layout/app-footer";
import { AppHeader } from "@/components/layout/app-header";
import { TransactionModal } from "@/components/modals/transaction-modal";
import { TransactionTable } from "@/components/transactions/transaction-table";
import { useRequireAuth } from "@/hooks/use-auth";
import { useTransactions } from "@/hooks/use-transactions";
import { useCreatePaymentKey, useWallet } from "@/hooks/use-wallet";
import { summarizeTransactions } from "@/lib/transaction-mappers";

export default function DashboardPage() {
  const auth = useRequireAuth();
  const walletQuery = useWallet(Boolean(auth.token));
  const transactionsQuery = useTransactions(Boolean(auth.token));
  const createKey = useCreatePaymentKey();
  const [modalOpen, setModalOpen] = useState(false);
  const [lastKey, setLastKey] = useState<string | null>(null);
  const user = walletQuery.data ?? auth.user;
  const transactions = transactionsQuery.data ?? [];
  const metrics = summarizeTransactions(transactions);

  async function createPaymentKey() {
    const key = await createKey.mutateAsync();
    setLastKey(key.key);
  }

  return (
    <ApiWakeGate>
      <div className="min-h-screen">
        <AppHeader />
        <main className="mx-auto max-w-7xl px-4 py-6 pb-6 sm:px-6 sm:py-8">
          <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mb-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#8be9fd]">Authenticated ledger workspace</p>
              <h1 className="mt-3 text-4xl font-black text-white sm:text-5xl">Dashboard</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#a7b0c8]">
                Protected Next.js workspace for the local wallet API. Balance, transfer flow and transaction history are fetched through first-party route handlers.
              </p>
            </div>
            <button onClick={() => setModalOpen(true)} className="btn-bet flex h-13 items-center justify-center gap-2 px-6 text-sm font-black">
              <Plus className="h-4 w-4" />
              New transfer
            </button>
          </motion.section>

          <DashboardSummary balance={user?.balance} lastMovement={metrics.last} received={metrics.received} sent={metrics.sent} total={metrics.total} />

          <section className="mb-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <WalletIdentityPanel user={user} />
            <PaymentKeyPanel error={createKey.error} lastKey={lastKey} onCreate={createPaymentKey} pending={createKey.isPending} />
          </section>

          <section className="mb-6 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
            <LedgerChart transactions={transactions} />
            <DashboardInsights />
          </section>

          {transactionsQuery.isLoading ? (
            <div className="glass-surface-2 h-80 animate-pulse rounded-xl" />
          ) : (
            <div className="space-y-3">
              <div className="flex justify-end">
                <Link href="/transactions" className="chip-btn inline-flex h-10 items-center px-4 text-sm font-bold">
                  Open transactions page
                </Link>
              </div>
              <TransactionTable transactions={transactions} />
            </div>
          )}
        </main>
        <AppFooter />
        <TransactionModal open={modalOpen} onClose={() => setModalOpen(false)} balance={user?.balance} />
      </div>
    </ApiWakeGate>
  );
}
