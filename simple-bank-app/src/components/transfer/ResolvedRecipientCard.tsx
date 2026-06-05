import { Text, View } from "react-native";
import type { ApiPaymentKey } from "@/api/types";
import { maskEmail, maskTaxId } from "@/lib/mask";
import { Avatar } from "@/components/ui/Avatar";

type ResolvedRecipientCardProps = { paymentKey: ApiPaymentKey };

export function ResolvedRecipientCard({ paymentKey }: ResolvedRecipientCardProps) {
  const user = paymentKey.user;
  return (
    <View className="flex-row items-center gap-3.5 rounded-xl border border-dracula-purple/25 bg-dracula-surface p-4">
      <Avatar name={user.name} size="lg" />
      <View className="flex-1 gap-[3px]">
        <Text className="text-[15px] font-bold text-dracula-fg" numberOfLines={1}>
          {user.name}
        </Text>
        <Text className="text-[13px] text-dracula-muted">{maskEmail(user.email)}</Text>
        <Text className="text-xs text-dracula-muted">Doc: {maskTaxId(user.taxId)}</Text>
      </View>
    </View>
  );
}
