"use client";

import QRCode from "qrcode";
import { Copy, KeyRound, Loader2, Plus, QrCode } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/src/i18n/provider";
import { buildPaymentQrPayload, parseCurrencyToCents } from "@/lib/payment-qr";

export function PaymentKeyPanel({
  error,
  lastKey,
  onCreate,
  pending,
}: {
  error: Error | null;
  lastKey: string | null;
  onCreate: () => Promise<void>;
  pending: boolean;
}) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");

  const qrPayload = useMemo(() => {
    if (!lastKey) return "";
    return buildPaymentQrPayload({
      amount: parseCurrencyToCents(amount),
      description,
      key: lastKey,
    });
  }, [amount, description, lastKey]);

  useEffect(() => {
    if (!qrPayload) {
      return;
    }

    let active = true;
    void QRCode.toDataURL(qrPayload, { margin: 2, width: 260 }).then((dataUrl) => {
      if (active) setQrDataUrl(dataUrl);
    });

    return () => {
      active = false;
    };
  }, [qrPayload]);

  function handleCopy() {
    if (!lastKey) return;
    void navigator.clipboard.writeText(lastKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="game-panel rounded-2xl p-6 flex flex-col h-full">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#f1fa8c]/15">
          <KeyRound className="h-5 w-5 text-[#f1fa8c]" />
        </span>
        <div>
          <h2 className="text-xl font-black text-white">{t("keys.panel.title")}</h2>
          <p className="text-xs text-[#8892a4] mt-0.5">{t("keys.panel.subtitle")}</p>
        </div>
      </div>

      <div className="mt-6 flex-1 flex flex-col justify-center">
        {lastKey ? (
          <div className="rounded-xl border border-[#f1fa8c]/20 bg-black/30 p-4">
            <p className="font-mono text-sm break-all text-[#f1fa8c]">{lastKey}</p>
            <button
              onClick={handleCopy}
              className="mt-4 flex w-full h-10 items-center justify-center gap-2 rounded-lg bg-[#f1fa8c]/10 text-sm font-bold text-[#f1fa8c] transition-colors hover:bg-[#f1fa8c]/20"
            >
              <Copy className="h-4 w-4" />
              {copied ? t("common.copied") : t("common.copy")}
            </button>
            <div className="mt-4 rounded-xl border border-[#8be9fd]/15 bg-[#8be9fd]/5 p-4">
              <div className="mb-3 flex items-center gap-2">
                <QrCode className="h-4 w-4 text-[#8be9fd]" />
                <p className="text-sm font-black text-white">QR para receber</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-[#8892a4]">Valor opcional</span>
                  <input
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    className="input-neon h-10 px-3 text-sm"
                    inputMode="decimal"
                    placeholder="0,00"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-[#8892a4]">Descricao opcional</span>
                  <input
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    className="input-neon h-10 px-3 text-sm"
                    maxLength={255}
                    placeholder="Ex: aluguel"
                  />
                </label>
              </div>
              {qrDataUrl ? (
                <div className="mt-4 flex justify-center rounded-xl bg-white p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrDataUrl} alt="QR Code Simple Bank para receber" className="h-48 w-48" />
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-black/10 py-8">
            <p className="text-sm font-medium text-[#8892a4]">{t("keys.panel.noKey")}</p>
          </div>
        )}
      </div>

      {error ? (
        <p className="mt-4 text-xs text-[#ff5555]">{error.message}</p>
      ) : null}

      <button
        onClick={() => void onCreate()}
        disabled={pending}
        className="chip-btn mt-5 flex h-12 w-full items-center justify-center gap-2 text-sm font-bold disabled:opacity-50"
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
        {t("keys.panel.newKey")}
      </button>
    </div>
  );
}
