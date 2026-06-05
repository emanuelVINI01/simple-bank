import { useState } from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/use-auth";
import { useTransactions, useTransactionViewModel } from "@/hooks/use-transactions";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { TransactionDateGroup } from "@/components/transactions/TransactionDateGroup";
import { StateView } from "@/components/ui/StateView";
import { Screen } from "@/components/ui/Screen";
import { useI18n } from "@/i18n/provider";

type FilterType = "all" | "credit" | "debit";

export default function TransactionsScreen() {
  const router = useRouter();
  const auth = useAuth();
  const { t } = useI18n();
  const txQuery = useTransactions({ limit: 100 });
  const [filter, setFilter] = useState<FilterType>("all");
  const [query, setQuery] = useState("");

  const { grouped, items } = useTransactionViewModel({
    currentUserId: auth.user?.id,
    filter,
    query,
    transactions: txQuery.data,
  });

  const dateKeys = Object.keys(grouped).sort((a, b) => (a > b ? -1 : 1));

  // Build a map from transaction id → TransactionListItem for date groups
  const itemsById = Object.fromEntries(items.map((i) => [i.id, i]));

  return (
    <Screen scroll contentContainerClassName="pb-8">
      <View className="px-5 pb-3 pt-5">
        <Text className="text-xl font-extrabold text-dracula-fg">{t("transactions.title")}</Text>
        <Text className="mt-1 text-sm text-dracula-muted">{t("transactions.subtitle") ?? "Acompanhe entradas, saidas e comprovantes."}</Text>
      </View>
      <TransactionFilters filter={filter} onFilterChange={setFilter} query={query} onQueryChange={setQuery} />
      {txQuery.isLoading ? (
        <StateView state="loading" skeletonCount={5} />
      ) : txQuery.isError ? (
        <StateView state="error" message={t("common.error")} onRetry={() => void txQuery.refetch()} />
      ) : dateKeys.length === 0 ? (
        <StateView state="empty" message={t("transactions.empty")} />
      ) : (
        dateKeys.map((dateKey) => {
          const txsForDate = grouped[dateKey] ?? [];
          const itemsForDate = txsForDate.map((tx) => itemsById[tx.id]).filter(Boolean) as typeof items;
          return (
            <TransactionDateGroup
              key={dateKey}
              dateKey={dateKey}
              items={itemsForDate}
              onPressItem={(id) => router.push(`/transaction/${id}`)}
            />
          );
        })
      )}
    </Screen>
  );
}
