"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Plus } from "lucide-react";
import { useState } from "react";
import { AiBudgetPanel } from "@/components/dashboard/ai-budget-panel";
import { DashboardSummary } from "@/components/dashboard/dashboard-summary";
import { LedgerChart } from "@/components/dashboard/ledger-chart";
import { PaymentKeyPanel } from "@/components/dashboard/payment-key-panel";
import { WalletIdentityPanel } from "@/components/dashboard/wallet-identity-panel";
import { ApiWakeGate } from "@/components/layout/api-wake-gate";
import { AppFooter } from "@/components/layout/app-footer";
import { AppHeader } from "@/components/layout/app-header";
import { TransactionModal } from "@/components/modals/transaction-modal";
import { TransactionAnalysisModal } from "@/components/modals/transaction-analysis-modal";
import { TransactionTable } from "@/components/transactions/transaction-table";
import { useRequireAuth } from "@/hooks/use-auth";
import { useTransactions } from "@/hooks/use-transactions";
import { useCreatePaymentKey, usePaymentKeys, useWallet } from "@/hooks/use-wallet";
import { summarizeTransactions } from "@/lib/transaction-mappers";
import { useI18n } from "@/src/i18n/provider";
import type { ApiTransaction } from "@/lib/api-types";

export default function DashboardPage() {
  const auth = useRequireAuth();
  const walletQuery = useWallet(Boolean(auth.token));
  const transactionsQuery = useTransactions(Boolean(auth.token));
  const paymentKeysQuery = usePaymentKeys(Boolean(auth.token));
  const createKey = useCreatePaymentKey();
  const [modalOpen, setModalOpen] = useState(false);
  const [lastKey, setLastKey] = useState<string | null>(null);
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState<ApiTransaction | null>(null);
  const { t } = useI18n();

  const user = walletQuery.data ?? auth.user;
  const transactions = transactionsQuery.data ?? [];
  const activePaymentKey = lastKey ?? paymentKeysQuery.data?.[0]?.key ?? null;
  const metrics = summarizeTransactions(transactions);

  async function createPaymentKey() {
    const key = await createKey.mutateAsync();
    setLastKey(key.key);
  }

  const firstName = user?.name ? user.name.split(" ")[0] : "";

  return (
    <ApiWakeGate>
      <div className="min-h-screen">
        <AppHeader />
        <main className="mx-auto max-w-7xl px-4 py-6 pb-12 sm:px-6 sm:py-8">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end"
          >
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#8be9fd]">
                {t("dashboard.title")}
              </p>
              <h1 className="mt-2 text-4xl font-black text-white sm:text-5xl">
                {t("dashboard.greeting", { name: firstName })}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#8892a4]">
                {t("dashboard.subtitle")}
              </p>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="btn-bet flex h-14 items-center justify-center gap-2 px-8 text-sm font-black w-full sm:w-auto"
            >
              <Plus className="h-5 w-5" />
              {t("dashboard.newTransfer")}
            </button>
          </motion.section>

          <DashboardSummary
            balance={user?.balance}
            lastMovement={metrics.last}
            received={metrics.received}
            sent={metrics.sent}
            total={metrics.total}
          />

          <section className="mb-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <WalletIdentityPanel user={user} />
            <PaymentKeyPanel
              error={createKey.error}
              lastKey={activePaymentKey}
              onCreate={createPaymentKey}
              pending={createKey.isPending}
            />
          </section>

          <section className="mb-6 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
            <LedgerChart transactions={transactions} />
            <AiBudgetPanel />
          </section>

          {transactionsQuery.isLoading ? (
            <div className="skeleton h-80 w-full" />
          ) : (
            <div className="space-y-4 mt-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">{t("dashboard.transactions")}</h2>
                <Link href="/transactions" className="chip-btn inline-flex h-10 items-center gap-2 px-4 text-sm font-bold">
                  {t("dashboard.openLedger")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <TransactionTable
                transactions={transactions.slice(0, 5)}
                onAnalyzeClick={(txn) => {
                  setSelectedTxn(txn);
                  setAnalysisOpen(true);
                }}
              />
            </div>
          )}
        </main>
        <AppFooter />
        <TransactionModal open={modalOpen} onClose={() => setModalOpen(false)} balance={user?.balance} />
        <TransactionAnalysisModal
          open={analysisOpen}
          onClose={() => {
            setAnalysisOpen(false);
            setSelectedTxn(null);
          }}
          transaction={selectedTxn}
        />
      </div>
    </ApiWakeGate>
  );
}
