import { useEffect, useMemo, useRef } from "react";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { useTransferFlow } from "@/hooks/use-transfer";
import { useWallet } from "@/hooks/use-wallet";
import { Screen } from "@/components/ui/Screen";
import { ResolveKeyForm } from "@/components/transfer/ResolveKeyForm";
import { ResolvedRecipientCard } from "@/components/transfer/ResolvedRecipientCard";
import { PaymentAmountForm } from "@/components/transfer/PaymentAmountForm";
import { TransferConfirm } from "@/components/transfer/TransferConfirm";
import { TransferSuccess } from "@/components/transfer/TransferSuccess";
import type { ParsedPaymentForm } from "@/validation/transfer";
import { View } from "react-native";
import { formatCentsForInput } from "@/lib/payment-qr";
import { AiTransferInput } from "@/components/transfer/AiTransferInput";

export default function TransferScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ amount?: string; description?: string; key?: string }>();
  const flow = useTransferFlow();
  const wallet = useWallet();
  const appliedQrRef = useRef("");

  const qrDraft = useMemo(() => {
    const key = typeof params.key === "string" ? params.key : "";
    const amount = typeof params.amount === "string" ? Number(params.amount) : undefined;
    const description = typeof params.description === "string" ? params.description : undefined;

    return {
      amount: Number.isInteger(amount) && amount && amount > 0 ? amount : undefined,
      description,
      key,
    };
  }, [params.amount, params.description, params.key]);

  useEffect(() => {
    if (!qrDraft.key) return;
    const signature = `${qrDraft.key}:${qrDraft.amount ?? ""}:${qrDraft.description ?? ""}`;
    if (appliedQrRef.current === signature) return;
    appliedQrRef.current = signature;

    void flow.resolveKey(qrDraft.key).then(() => {
      if (qrDraft.amount) {
        flow.setPaymentData({ amount: qrDraft.amount, description: qrDraft.description });
      }
    });
  }, [flow, qrDraft]);

  async function handleResolveKey(key: string) {
    await flow.resolveKey(key);
  }

  function handlePaymentData(data: ParsedPaymentForm) {
    flow.setPaymentData({ amount: data.amount, description: data.description });
  }

  async function handleConfirm() {
    await flow.confirmPayment();
  }

  if (flow.step === "resolve-key") {
    return (
      <Screen>
        <View className="px-5 mt-5">
          <AiTransferInput
            onParsed={async (data) => {
              if (data.recipientKey) {
                await flow.resolveKey(data.recipientKey);
                if (data.amount || data.description) {
                  flow.setPaymentData({
                    amount: data.amount ?? 0,
                    description: data.description ?? "",
                  });
                }
              }
            }}
          />
        </View>
        <ResolveKeyForm
          onSubmit={handleResolveKey}
          onScanQr={() => router.push("/qr-scan")}
          loading={flow.resolvePending}
          error={flow.resolveError as Error | null}
        />
      </Screen>
    );
  }

  if (flow.step === "payment-data" && flow.resolvedKey) {
    return (
      <Screen scroll>
        <ResolvedRecipientCard paymentKey={flow.resolvedKey} />
        <PaymentAmountForm
          balance={wallet.data?.balance}
          initialAmount={formatCentsForInput(qrDraft.amount)}
          initialDescription={qrDraft.description}
          onSubmit={handlePaymentData}
          onBack={() => flow.setStep("resolve-key")}
        />
      </Screen>
    );
  }

  if (flow.step === "confirm" && flow.resolvedKey && flow.paymentDraft) {
    return (
      <Screen scroll>
        <TransferConfirm
          resolvedKey={flow.resolvedKey}
          paymentDraft={flow.paymentDraft}
          idempotencyKey={flow.idempotencyKey}
          onConfirm={handleConfirm}
          onBack={() => flow.setStep("payment-data")}
          loading={flow.paymentPending}
          error={flow.paymentError as Error | null}
        />
      </Screen>
    );
  }

  if (flow.step === "success" && flow.paymentResult) {
    return (
      <Screen>
        <TransferSuccess
          result={flow.paymentResult}
          amount={flow.paymentDraft?.amount}
          onOpenReceipt={
            flow.paymentResult.transactionId
              ? () => router.push(`/receipt/${flow.paymentResult!.transactionId}`)
              : undefined
          }
          onNewTransfer={flow.reset}
        />
      </Screen>
    );
  }

  return null;
}
