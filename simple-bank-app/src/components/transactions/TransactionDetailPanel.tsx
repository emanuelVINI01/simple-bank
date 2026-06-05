import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { Text, View } from "react-native";
import { Copy } from "lucide-react-native";
import type { ApiTransaction } from "@/api/types";
import { formatMoney, formatFullDate, formatShortReference } from "@/lib/format";
import { colors } from "@/theme/colors";
import { Badge } from "@/components/ui/Badge";
import { Divider } from "@/components/ui/Divider";
import { AnimatedPressable } from "@/components/ui/AnimatedPressable";

type TransactionDetailPanelProps = {
  transaction: ApiTransaction;
};

function Row({ label, value, copyable }: { label: string; value?: string | null; copyable?: boolean }) {
  if (!value) return null;

  async function copyValue() {
    await Clipboard.setStringAsync(value ?? "");
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
  }

  return (
    <View className="gap-1">
      <Text className="text-xs text-dracula-muted">{label}</Text>
      <View className="flex-row items-center gap-2">
        <Text className="flex-1 text-sm text-dracula-fg">{value}</Text>
        {copyable ? (
          <AnimatedPressable onPress={copyValue} feedback="soft" className="rounded-lg p-2">
            <Copy size={14} color={colors.cyan} />
          </AnimatedPressable>
        ) : null}
      </View>
    </View>
  );
}

export function TransactionDetailPanel({ transaction }: TransactionDetailPanelProps) {
  const isIn = transaction.type === "CREDIT";

  return (
    <View className="mx-5 gap-5">
      <View className="items-center gap-2">
        <Badge label={isIn ? "Entrada" : "Saida"} variant={isIn ? "credit" : "debit"} />
        <Text className={`text-4xl font-extrabold ${isIn ? "text-dracula-green" : "text-dracula-pink"}`}>
          {isIn ? "+" : "-"}
          {formatMoney(transaction.amount)}
        </Text>
        <Text className="text-[13px] text-dracula-muted">{formatFullDate(transaction.createdAt)}</Text>
      </View>
      <Divider />
      <View className="gap-4">
        <Row label="ID da transacao" value={transaction.id} copyable />
        <Row label="Referencia" value={formatShortReference(transaction.referenceId)} copyable />
        <Row label="Descricao" value={transaction.description} />
        <Row label="Pagador" value={transaction.payer?.name} />
        <Row label="Recebedor" value={transaction.receiver?.name} />
      </View>
    </View>
  );
}
