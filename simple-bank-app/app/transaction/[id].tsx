import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, View } from "react-native";
import { ArrowLeft, FileText } from "lucide-react-native";
import { useAuth } from "@/hooks/use-auth";
import { useTransactions, findTransactionById } from "@/hooks/use-transactions";
import { colors } from "@/theme/colors";
import { StateView } from "@/components/ui/StateView";
import { TransactionDetailPanel } from "@/components/transactions/TransactionDetailPanel";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { IconButton } from "@/components/ui/IconButton";
import { Screen } from "@/components/ui/Screen";

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const txQuery = useTransactions({ limit: 100 });

  const transaction = findTransactionById(txQuery.data, id ?? "");

  return (
    <Screen scroll contentContainerClassName="pb-8">
      <View className="flex-row items-center gap-2 px-5 py-3">
        <IconButton icon={<ArrowLeft size={20} color={colors.fg} />} onPress={() => router.back()} />
        <Text className="flex-1 text-[17px] font-bold text-dracula-fg">Detalhe</Text>
      </View>
      {txQuery.isLoading ? (
        <StateView state="loading" skeletonCount={4} />
      ) : !transaction ? (
        <StateView state="empty" message="Transacao nao encontrada." />
      ) : (
        <>
          <TransactionDetailPanel transaction={transaction} />
          <View className="mt-6 px-5">
            <PrimaryButton
              title="Gerar comprovante"
              onPress={() => router.push(`/receipt/${transaction.id}`)}
              leftIcon={<FileText size={18} color={colors.fg} />}
            />
          </View>
        </>
      )}
    </Screen>
  );
}
