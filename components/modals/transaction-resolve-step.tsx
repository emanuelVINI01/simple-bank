"use client";

import { useState } from "react";
import { Loader2, Search, Sparkles } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { ResolveForm } from "@/hooks/use-transaction-modal";
import { ErrorBox, StepPanel } from "@/components/modals/transaction-modal-shell";
import { useI18n } from "@/src/i18n/provider";
import { useParseTransfer } from "@/hooks/use-ai";

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export function ResolveKeyStep({
  errorMessage,
  form,
  onSubmit,
  pending,
  onAiResolve,
}: {
  errorMessage: string | null;
  form: UseFormReturn<ResolveForm>;
  onSubmit: (values: ResolveForm) => Promise<void>;
  pending: boolean;
  onAiResolve: (key: string, amount: number | null, description: string | null) => Promise<void>;
}) {
  const { t, locale } = useI18n();
  const [aiText, setAiText] = useState("");
  const parseTransfer = useParseTransfer();
  const [aiError, setAiError] = useState<string | null>(null);

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiText.trim()) return;
    setAiError(null);

    try {
      const result = await parseTransfer.mutateAsync(aiText);
      const parsed = result.result;
      if (!parsed.recipientKey) {
        setAiError(locale === "pt-BR" ? "Não foi possível encontrar ou associar o destinatário." : "Could not identify or match recipient.");
        return;
      }
      await onAiResolve(parsed.recipientKey, parsed.amount, parsed.description);
    } catch (err: unknown) {
      setAiError(getErrorMessage(err, "Failed to analyze command"));
    }
  };

  return (
    <StepPanel>
      <div className="space-y-6">
        {/* AI Voice / Text Command input */}
        <div className="glass-surface-2 border border-white/5 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-1.5 text-[#bd93f9]">
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider">AI Assistant Transfer</span>
          </div>
          <p className="text-[11px] leading-relaxed text-[#a7b0c8]">
            {locale === "pt-BR"
              ? "Escreva o comando da transferência em linguagem natural (ex: 'Enviar R$ 50 para João pagar a pizza' ou 'Transfer 10 dollars to Alice')."
              : "Instruct the wallet in plain text (e.g., 'Transfer 50 dollars to Alice for dinner' or 'Enviar R$ 15 para Dave')."}
          </p>
          <form onSubmit={handleAiSubmit} className="space-y-3">
            <textarea
              className="w-full rounded-xl bg-black/30 border border-white/10 p-3 text-xs text-white placeholder-white/30 h-16 focus:outline-none focus:border-[#bd93f9] focus:ring-1 focus:ring-[#bd93f9] resize-none"
              placeholder={locale === "pt-BR" ? "Ex: Enviar R$ 50 para Dave" : "E.g., Transfer 50 dollars to Dave"}
              value={aiText}
              onChange={(e) => setAiText(e.target.value)}
            />
            {aiError && <div className="text-[11px] text-[#ff5555] font-bold">{aiError}</div>}
            <button
              type="submit"
              disabled={parseTransfer.isPending || !aiText.trim()}
              className="btn-bet h-9 w-full flex items-center justify-center gap-2 text-xs font-black disabled:opacity-50"
            >
              {parseTransfer.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              {locale === "pt-BR" ? "Processar Comando" : "Process Command"}
            </button>
          </form>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-between text-xs text-[#a7b0c8] uppercase tracking-[0.2em]">
          <div className="h-px bg-white/10 flex-1" />
          <span className="px-3 text-[10px]">{locale === "pt-BR" ? "Ou chave manual" : "Or manual key"}</span>
          <div className="h-px bg-white/10 flex-1" />
        </div>

        {/* Manual Key Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#f8f8f2]">{t("transfer.key")}</span>
            <input className="input-neon h-12 px-4 font-mono text-sm" placeholder={t("transfer.keyPlaceholder")} {...form.register("key")} />
            <span className="mt-2 block min-h-5 text-xs text-[#ff79c6]">{form.formState.errors.key ? t("common.error") : ""}</span>
          </label>
          {errorMessage ? <ErrorBox message={errorMessage} /> : null}
          <button disabled={pending} className="btn-bet flex h-12 w-full items-center justify-center gap-2 text-sm font-black disabled:opacity-60">
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            {t("transfer.resolve")}
          </button>
        </form>
      </div>
    </StepPanel>
  );
}
