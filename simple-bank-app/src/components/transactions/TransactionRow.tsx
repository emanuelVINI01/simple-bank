import { Text, View } from "react-native";
import type { TransactionListItem } from "@/mappers/transaction";
import { formatMoney, formatDateTime } from "@/lib/format";
import { Avatar } from "@/components/ui/Avatar";
import { AnimatedPressable } from "@/components/ui/AnimatedPressable";

type TransactionRowProps = {
  item: TransactionListItem;
  onPress?: () => void;
};

export function TransactionRow({ item, onPress }: TransactionRowProps) {
  const isIn = item.direction === "in";
  const amountPrefix = isIn ? "+" : "-";

  return (
    <AnimatedPressable
      onPress={onPress}
      feedback="soft"
      className="flex-row items-center gap-3 px-1 py-3"
    >
      <Avatar name={item.counterparty?.name} />
      <View className="flex-1">
        <Text className="text-sm font-semibold text-dracula-fg" numberOfLines={1}>
          {item.title}
        </Text>
        {item.description ? (
          <Text className="text-xs text-dracula-muted" numberOfLines={1}>
            {item.description}
          </Text>
        ) : null}
        <Text className="mt-0.5 text-[11px] text-dracula-muted">{formatDateTime(item.createdAt)}</Text>
      </View>
      <Text className={`text-sm font-bold ${isIn ? "text-dracula-green" : "text-dracula-pink"}`}>
        {amountPrefix}
        {formatMoney(item.amount)}
      </Text>
    </AnimatedPressable>
  );
}
