import { useMemo } from "react";
import { useRouter } from "expo-router";
import { ArrowLeft, Bell, BellRing, CheckCircle2, Send } from "lucide-react-native";
import { Text, View } from "react-native";
import { useAuth } from "@/hooks/use-auth";
import { useNotificationPreference } from "@/hooks/use-notification-preference";
import { useTransactions, useTransactionViewModel } from "@/hooks/use-transactions";
import type { TransactionListItem } from "@/mappers/transaction";
import { formatDateTime, formatMoney } from "@/lib/format";
import { colors } from "@/theme/colors";
import { AnimatedPressable } from "@/components/ui/AnimatedPressable";
import { IconButton } from "@/components/ui/IconButton";
import { Screen } from "@/components/ui/Screen";
import { StateView } from "@/components/ui/StateView";

export default function NotificationsScreen() {
  const router = useRouter();
  const auth = useAuth();
  const preference = useNotificationPreference();
  const transactionsQuery = useTransactions({ limit: 100 });

  const { items } = useTransactionViewModel({
    currentUserId: auth.user?.id,
    transactions: transactionsQuery.data,
  });

  const notifications = useMemo(() => {
    return items
      .filter((item) => item.direction === "in")
      .map((item) => ({
        item,
        title: "Transferencia recebida",
        body: `Voce recebeu ${formatMoney(item.amount)} de ${item.counterparty?.name ?? "alguem"}.`,
      }));
  }, [items]);

  return (
    <Screen scroll contentContainerClassName="pb-8">
      <View className="flex-row items-center gap-2 px-5 py-3">
        <IconButton icon={<ArrowLeft size={20} color={colors.fg} />} onPress={() => router.back()} />
        <View className="flex-1">
          <Text className="text-xl font-extrabold text-dracula-fg">Notificacoes</Text>
          <Text className="mt-0.5 text-sm text-dracula-muted">Acompanhe avisos importantes da sua conta.</Text>
        </View>
      </View>

      <View className="mx-5 mb-5 rounded-[24px] border border-dracula-purple/25 bg-dracula-surface p-4">
        <View className="flex-row items-center gap-3">
          <View className="h-11 w-11 items-center justify-center rounded-2xl bg-dracula-purple/20">
            {preference.enabled ? <BellRing size={21} color={colors.purple} /> : <Bell size={21} color={colors.muted} />}
          </View>
          <View className="flex-1">
            <Text className="text-base font-extrabold text-dracula-fg">
              {preference.enabled ? "Avisos de recebimento ativos" : "Avisos de recebimento pausados"}
            </Text>
            <Text className="mt-1 text-xs leading-5 text-dracula-muted">
              {preference.enabled
                ? "O app verifica novas transferencias e exibe alertas locais."
                : "Ative no perfil para receber alertas quando entrar dinheiro."}
            </Text>
          </View>
        </View>
      </View>

      <View className="gap-3 px-5">
        <Text className="text-[15px] font-extrabold text-dracula-fg">Recentes</Text>
        {transactionsQuery.isLoading ? (
          <StateView state="loading" skeletonCount={4} />
        ) : transactionsQuery.isError ? (
          <StateView state="error" message="Nao foi possivel carregar notificacoes." onRetry={() => void transactionsQuery.refetch()} />
        ) : notifications.length === 0 ? (
          <StateView state="empty" message="Nenhuma notificacao recente." />
        ) : (
          notifications.map((notification) => (
            <NotificationCard
              key={notification.item.id}
              body={notification.body}
              item={notification.item}
              title={notification.title}
              onPress={() => router.push(`/transaction/${notification.item.id}`)}
            />
          ))
        )}
      </View>
    </Screen>
  );
}

function NotificationCard({
  body,
  item,
  onPress,
  title,
}: {
  body: string;
  item: TransactionListItem;
  onPress: () => void;
  title: string;
}) {
  return (
    <AnimatedPressable
      onPress={onPress}
      feedback="soft"
      className="flex-row items-start gap-3 rounded-[20px] border border-dracula-card bg-dracula-surface p-4"
    >
      <View className="h-11 w-11 items-center justify-center rounded-2xl bg-dracula-green/15">
        <Send size={19} color={colors.green} />
      </View>
      <View className="flex-1">
        <View className="flex-row items-center gap-2">
          <Text className="flex-1 text-sm font-extrabold text-dracula-fg">{title}</Text>
          <CheckCircle2 size={15} color={colors.green} />
        </View>
        <Text className="mt-1 text-sm leading-5 text-dracula-muted">{body}</Text>
        <Text className="mt-2 text-[11px] text-dracula-muted">{formatDateTime(item.createdAt)}</Text>
      </View>
    </AnimatedPressable>
  );
}
