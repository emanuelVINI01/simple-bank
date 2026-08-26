"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowLeft, ArrowUpRight, FileText, Plus, ReceiptText } from "lucide-react";
import { useState } from "react";
import { ApiWakeGate } from "@/components/layout/api-wake-gate";
import { TransactionModal } from "@/components/modals/transaction-modal";
import { TransactionAnalysisModal } from "@/components/modals/transaction-analysis-modal";
import { TransactionTable } from "@/components/transactions/transaction-table";
import { StatCard } from "@/components/ui/stat-card";
import { useRequireAuth } from "@/hooks/use-auth";
import { useTransactions } from "@/hooks/use-transactions";
import { useWallet } from "@/hooks/use-wallet";
import { formatMoney } from "@/lib/format";
import { summarizeTransactions } from "@/lib/transaction-mappers";
import type { ApiTransaction } from "@/lib/api-types";

export default function TransactionsPage() {
  const auth = useRequireAuth();
  const walletQuery = useWallet(Boolean(auth.token));
  const transactionsQuery = useTransactions(Boolean(auth.token));
  const [modalOpen, setModalOpen] = useState(false);
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState<ApiTransaction | null>(null);

  const transactions = transactionsQuery.data ?? [];
  const user = walletQuery.data ?? auth.user;
  const metrics = summarizeTransactions(transactions);

  return (
    <ApiWakeGate>
      <div className="min-h-screen">
        <main className="mx-auto max-w-7xl px-4 py-6 pb-6 sm:px-6 sm:py-8">
          <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mb-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <Link href="/dashboard" className="chip-btn mb-5 inline-flex h-10 items-center gap-2 px-3 text-sm">
                <ArrowLeft className="h-4 w-4" />
                Voltar ao início
              </Link>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-[var(--info)]">Histórico financeiro</p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--fg)] sm:text-5xl">Extrato</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--fg-muted)]">
                Acompanhe todas as suas movimentações financeiras. Débitos e créditos com comprovantes disponíveis para download.
              </p>
            </div>
            <button onClick={() => setModalOpen(true)} className="btn-primary-cta flex h-13 items-center justify-center gap-2 px-6 text-sm font-bold">
              <Plus className="h-4 w-4" />
              Nova transferência
            </button>
          </motion.section>

          <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={ReceiptText} label="Total de operações" value={String(metrics.total)} tone="info" />
            <StatCard icon={ArrowUpRight} label="Total enviado" value={formatMoney(metrics.sent)} tone="muted" />
            <StatCard icon={ArrowDownLeft} label="Total recebido" value={formatMoney(metrics.received)} tone="accent" />
            <StatCard icon={FileText} label="Comprovantes" value={String(metrics.receipts)} tone="accent" />
          </section>

          <section className="mb-6 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="game-panel rounded-xl p-5">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--info)]">Conta</p>
              <h2 className="mt-3 text-2xl font-bold text-[var(--fg)]">{user?.name ?? "Carregando..."}</h2>
              <p className="mt-2 text-sm text-[var(--fg-muted)]">{user?.email ?? ""}</p>
              <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs text-[var(--fg-muted)]">Saldo disponível</p>
                <p className="mt-2 text-3xl font-bold text-[var(--accent)]">{formatMoney(user?.balance)}</p>
              </div>
            </div>
            <div className="glass-surface-2 rounded-xl p-5">
              <h2 className="text-xl font-bold text-[var(--fg)]">Comprovantes</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--fg-muted)]">
                Todos os comprovantes das suas transações ficam disponíveis para download diretamente pelo extrato. Acesso exclusivo e seguro vinculado à sua conta.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <InfoPill title="Formato" text="PDF autenticado" />
                <InfoPill title="Acesso" text="Somente suas transações" />
              </div>
            </div>
          </section>

          {transactionsQuery.isLoading ? (
            <div className="glass-surface-2 h-96 animate-pulse rounded-xl" />
          ) : (
            <TransactionTable
              transactions={transactions}
              onAnalyzeClick={(txn) => {
                setSelectedTxn(txn);
                setAnalysisOpen(true);
              }}
            />
          )}
        </main>
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

function InfoPill({ text, title }: { text: string; title: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--info)]">{title}</p>
      <p className="mt-2 text-sm text-[var(--fg)]">{text}</p>
    </div>
  );
}
