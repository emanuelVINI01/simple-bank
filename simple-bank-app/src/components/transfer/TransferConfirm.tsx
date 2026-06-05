import { Text, View } from "react-native";
import type { ApiPaymentKey, PaymentInput } from "@/api/types";
import { formatMoney, formatShortReference } from "@/lib/format";
import { Divider } from "@/components/ui/Divider";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { TextButton } from "@/components/ui/TextButton";
import { ResolvedRecipientCard } from "@/components/transfer/ResolvedRecipientCard";
import { StateView } from "@/components/ui/StateView";

type TransferConfirmProps = {
  resolvedKey: ApiPaymentKey;
  paymentDraft: Omit<PaymentInput, "paymentKey" | "idempotencyKey">;
  idempotencyKey: string;
  onConfirm: () => Promise<void>;
  onBack: () => void;
  loading?: boolean;
  error?: Error | null;
};

export function TransferConfirm({ resolvedKey, paymentDraft, idempotencyKey, onConfirm, onBack, loading, error }: TransferConfirmProps) {
  return (
    <View className="gap-6 p-5">
      <View className="gap-1">
        <Text className="text-[26px] font-extrabold text-dracula-fg">Confirmar envio</Text>
        <Text className="text-sm text-dracula-muted">Revise os dados antes de concluir.</Text>
      </View>
      <ResolvedRecipientCard paymentKey={resolvedKey} />
      <Divider />
      <View className="gap-4 rounded-2xl bg-dracula-surface p-4">
        <View className="flex-row justify-between">
          <Text className="text-sm text-dracula-muted">Valor</Text>
          <Text className="text-xl font-extrabold text-dracula-pink">{formatMoney(paymentDraft.amount)}</Text>
        </View>
        {paymentDraft.description ? (
          <View className="flex-row justify-between gap-3">
            <Text className="text-sm text-dracula-muted">Descricao</Text>
            <Text className="flex-1 text-right text-sm text-dracula-fg" numberOfLines={2}>{paymentDraft.description}</Text>
          </View>
        ) : null}
        <View className="flex-row justify-between">
          <Text className="text-[13px] text-dracula-muted">Ref</Text>
          <Text className="text-xs text-dracula-muted">{formatShortReference(idempotencyKey)}</Text>
        </View>
      </View>
      {error ? <StateView state="error" message={error.message} /> : null}
      <View className="gap-2">
        <PrimaryButton title="Enviar transferencia" onPress={onConfirm} loading={loading} disabled={loading} className="bg-dracula-purple" />
        <TextButton title="Editar valor" onPress={onBack} textClassName="text-center" />
      </View>
    </View>
  );
}
