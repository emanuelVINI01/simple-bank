import { Text, View } from "react-native";
import type { TransactionListItem } from "@/mappers/transaction";
import { formatFullDate } from "@/lib/format";
import { Divider } from "@/components/ui/Divider";
import { TransactionRow } from "@/components/transactions/TransactionRow";

type TransactionDateGroupProps = {
  dateKey: string;
  items: TransactionListItem[];
  onPressItem?: (id: string) => void;
};

export function TransactionDateGroup({ dateKey, items, onPressItem }: TransactionDateGroupProps) {
  return (
    <View className="mb-2">
      <Text className="mb-1 px-5 text-xs font-semibold text-dracula-muted">
        {formatFullDate(dateKey + "T12:00:00Z")}
      </Text>
      {items.map((item, idx) => (
        <View key={item.id}>
          <View className="px-4">
            <TransactionRow item={item} onPress={onPressItem ? () => onPressItem(item.id) : undefined} />
          </View>
          {idx < items.length - 1 ? <Divider className="mx-4" /> : null}
        </View>
      ))}
    </View>
  );
}
