import { useState } from "react";
import { useRouter } from "expo-router";
import {
  Copy,
  List,
  Send,
  Wallet,
} from "lucide-react-native";
import { useAuth } from "@/hooks/use-auth";
import { useWallet } from "@/hooks/use-wallet";
import { useTransactions, useTransactionViewModel } from "@/hooks/use-transactions";
import { usePaymentKeys, useCopyPaymentKey } from "@/hooks/use-payment-keys";
import { Screen } from "@/components/ui/Screen";
import { AppHeader } from "@/components/app/AppHeader";
import { BalancePanel } from "@/components/home/BalancePanel";
import { QuickActionRail, type QuickActionItem } from "@/components/home/QuickActionRail";
import { LatestTransactions } from "@/components/home/LatestTransactions";
import { AccountCardPreview } from "@/components/home/AccountCardPreview";
import { colors } from "@/theme/colors";
import { View } from "react-native";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { AiBudgetCard } from "@/components/home/AiBudgetCard";

export default function HomeScreen() {
  const router = useRouter();
  const auth = useAuth();
  const wallet = useWallet();
  const txQuery = useTransactions({ limit: 10 });
  const keysQuery = usePaymentKeys();
  const copyKey = useCopyPaymentKey();
  const [balanceVisible, setBalanceVisible] = useState(true);

  const { items } = useTransactionViewModel({
    currentUserId: auth.user?.id,
    transactions: txQuery.data,
  });
  const notificationCount = items.filter((item) => item.direction === "in").slice(0, 9).length;

  const firstKey = keysQuery.data?.[0];

  const quickActions: QuickActionItem[] = [
    { id: "receive", label: "Receber", icon: Wallet, onPress: () => router.push("/(tabs)/keys"), iconColor: colors.cyan },
    {
      id: "copy-key",
      label: "Copiar chave",
      icon: Copy,
      iconColor: colors.green,
      onPress: firstKey
        ? () => { copyKey.mutate(firstKey.key); }
        : () => router.push("/(tabs)/keys"),
    },
    { id: "statements", label: "Extrato", icon: List, onPress: () => router.push("/(tabs)/transactions"), iconColor: colors.orange },
  ];

  return (
    <Screen
      scroll
      contentContainerClassName="pb-8"
    >
      <AppHeader
        name={auth.user?.name}
        balanceVisible={balanceVisible}
        notificationCount={notificationCount}
        onToggleBalance={() => setBalanceVisible((v) => !v)}
        onOpenNotifications={() => router.push("/(tabs)/notifications")}
        onOpenProfile={() => router.push("/(tabs)/profile")}
      />

      <AccountCardPreview name={auth.user?.name} id={auth.user?.id} />

      <BalancePanel
        balance={wallet.data?.balance}
        loading={wallet.isLoading}
        visible={balanceVisible}
        onToggleVisible={() => setBalanceVisible((v) => !v)}
      />

      <PrimaryButton
        title="Fazer transferência"
        onPress={() => router.push("/(tabs)/transfer")}
        leftIcon={<Send size={18} color={colors.fg} />}
        className="mx-5 mb-5 bg-dracula-purple"
      />

      <QuickActionRail items={quickActions} />

      <View className="px-5 mb-5">
        <AiBudgetCard />
      </View>

      <LatestTransactions
        items={items.slice(0, 5)}
        loading={txQuery.isLoading}
        onSeeAll={() => router.push("/(tabs)/transactions")}
        onPressItem={(id) => router.push(`/transaction/${id}`)}
      />
    </Screen>
  );
}
