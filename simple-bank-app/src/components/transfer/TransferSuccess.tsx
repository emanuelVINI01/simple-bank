import { Text, View } from "react-native";
import { CheckCircle } from "lucide-react-native";
import type { PaymentResult } from "@/api/types";
import { formatMoney } from "@/lib/format";
import { colors } from "@/theme/colors";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { TextButton } from "@/components/ui/TextButton";
import { useI18n } from "@/i18n/provider";

type TransferSuccessProps = {
  result: PaymentResult;
  amount?: number;
  onOpenReceipt?: () => void;
  onNewTransfer: () => void;
};

export function TransferSuccess({ result, amount, onOpenReceipt, onNewTransfer }: TransferSuccessProps) {
  const { t } = useI18n();

  return (
    <View className="items-center gap-6 p-5 pt-10">
      <CheckCircle size={72} color={colors.green} />
      <View className="items-center gap-1.5">
        <Text className="text-[22px] font-extrabold text-dracula-fg">{t("transfer.success")}</Text>
        {amount != null ? (
          <Text className="text-[32px] font-extrabold text-dracula-green">{formatMoney(amount)}</Text>
        ) : null}
      </View>
      <View className="w-full gap-3">
        {result.receiptUrl && onOpenReceipt ? (
          <PrimaryButton title={t("transfer.openReceipt")} onPress={onOpenReceipt} />
        ) : null}
        <TextButton title={t("transfer.newTransfer")} onPress={onNewTransfer} textClassName="text-center" />
      </View>
    </View>
  );
}
