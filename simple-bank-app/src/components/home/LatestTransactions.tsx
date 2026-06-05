import { Text, View } from "react-native";
import { ChevronRight } from "lucide-react-native";
import type { TransactionListItem } from "@/mappers/transaction";
import { colors } from "@/theme/colors";
import { StateView } from "@/components/ui/StateView";
import { TransactionRow } from "@/components/transactions/TransactionRow";
import { AnimatedPressable } from "@/components/ui/AnimatedPressable";
import { useI18n } from "@/i18n/provider";

type LatestTransactionsProps = {
  items: TransactionListItem[];
  loading?: boolean;
  onSeeAll?: () => void;
  onPressItem?: (id: string) => void;
};

export function LatestTransactions({ items, loading, onSeeAll, onPressItem }: LatestTransactionsProps) {
  const { t } = useI18n();

  return (
    <View className="mx-5">
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-[15px] font-bold text-dracula-fg">{t("home.latestTransactions")}</Text>
        {onSeeAll ? (
          <AnimatedPressable onPress={onSeeAll} feedback="soft" className="flex-row items-center gap-0.5">
            <Text className="text-[13px] text-dracula-cyan">{t("home.seeAll")}</Text>
            <ChevronRight size={14} color={colors.cyan} />
          </AnimatedPressable>
        ) : null}
      </View>
      {loading ? (
        <StateView state="loading" skeletonCount={3} />
      ) : items.length === 0 ? (
        <StateView state="empty" message={t("transactions.empty")} />
      ) : (
        <View className="gap-0.5">
          {items.map((item) => (
            <TransactionRow key={item.id} item={item} onPress={onPressItem ? () => onPressItem(item.id) : undefined} />
          ))}
        </View>
      )}
    </View>
  );
}
