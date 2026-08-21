import { useEffect } from "react";
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, View } from "react-native";
import { AlertTriangle, CheckCircle, RefreshCw, ShieldAlert, Sparkles, X } from "lucide-react-native";
import { useAnalyzeTransaction } from "@/hooks/use-ai";
import { useI18n } from "@/i18n/provider";
import { formatMoney } from "@/lib/format";
import { colors } from "@/theme/colors";
import { IconButton } from "@/components/ui/IconButton";
import { AnimatedPressable } from "@/components/ui/AnimatedPressable";
import type { ApiTransaction } from "@/api/types";

type TransactionAnalysisSheetProps = {
  visible: boolean;
  onClose: () => void;
  transaction: ApiTransaction | null;
};

export function TransactionAnalysisSheet({
  visible,
  onClose,
  transaction,
}: TransactionAnalysisSheetProps) {
  const { t } = useI18n();
  const analyzeMutation = useAnalyzeTransaction();
  const { mutate, data, isPending, error } = analyzeMutation;

  useEffect(() => {
    if (visible && transaction?.id) {
      mutate({ id: transaction.id });
    }
  }, [visible, transaction?.id, mutate]);

  const analysis = data?.analysis;
  const isCacheHit = data?.cacheHit;

  const handleForceRefresh = () => {
    if (transaction?.id) {
      mutate({ id: transaction.id, forceRefresh: true });
    }
  };

  const getRiskTextColor = (score = 0) => {
    if (score < 30) return "text-dracula-green";
    if (score < 70) return "text-dracula-yellow";
    return "text-dracula-red";
  };

  const getRiskBgColor = (score = 0) => {
    if (score < 30) return "bg-dracula-green";
    if (score < 70) return "bg-dracula-yellow";
    return "bg-dracula-red";
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1 justify-end bg-black/70" onPress={onClose}>
        <Pressable
          className="max-h-[85%] rounded-t-[28px] bg-dracula-surface p-5 border-t border-white/10"
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View className="mb-4 flex-row items-center justify-between border-b border-white/[0.08] pb-3">
            <View className="flex-row items-center gap-2">
              <View className="h-8 w-8 items-center justify-center rounded-lg bg-dracula-purple/20">
                <Sparkles size={16} color={colors.purple} />
              </View>
              <Text className="text-[17px] font-bold text-dracula-fg">
                {t("transaction.ai.title")}
              </Text>
            </View>

            <View className="flex-row items-center gap-2">
              {!isPending && !error && analysis ? (
                <IconButton
                  icon={<RefreshCw size={16} color={colors.cyan} />}
                  onPress={handleForceRefresh}
                />
              ) : null}
              <IconButton icon={<X size={20} color={colors.fg} />} onPress={onClose} />
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-6">
            {isPending ? (
              <View className="items-center justify-center py-12 gap-3">
                <ActivityIndicator size="large" color={colors.purple} />
                <Text className="text-sm font-bold text-dracula-fg">
                  Consultando Modelo Financeiro...
                </Text>
                <Text className="text-center text-xs text-dracula-muted">
                  Classificando categoria e calculando risco da movimentação
                </Text>
              </View>
            ) : error ? (
              <View className="items-center justify-center py-8 gap-3">
                <AlertTriangle size={24} color={colors.red} />
                <Text className="text-sm font-bold text-dracula-red">{error.message}</Text>
                <AnimatedPressable
                  onPress={() => transaction?.id && mutate({ id: transaction.id })}
                  feedback="soft"
                  className="rounded-xl bg-dracula-card px-4 py-2"
                >
                  <Text className="text-xs font-bold text-dracula-fg">{t("common.retry")}</Text>
                </AnimatedPressable>
              </View>
            ) : analysis && transaction ? (
              <View className="gap-4">
                {/* Transaction summary card */}
                <View className="flex-row items-center justify-between rounded-xl border border-white/5 bg-dracula-surface-deep/80 p-3.5">
                  <View className="flex-1 pr-2">
                    <Text className="text-[10px] font-bold uppercase tracking-wider text-dracula-muted">
                      Original
                    </Text>
                    <Text className="mt-0.5 text-xs font-bold text-dracula-fg" numberOfLines={1}>
                      {transaction.description || "Sem descrição"}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-[10px] font-bold uppercase tracking-wider text-dracula-muted">
                      Valor
                    </Text>
                    <Text
                      className={`mt-0.5 font-bold ${
                        transaction.type === "CREDIT" ? "text-dracula-green" : "text-dracula-fg"
                      }`}
                    >
                      {transaction.type === "CREDIT" ? "+" : "-"}
                      {formatMoney(transaction.amount)}
                    </Text>
                  </View>
                </View>

                {/* Cache indicator */}
                {isCacheHit ? (
                  <View className="flex-row items-center gap-1.5 rounded-lg border border-dracula-green/20 bg-dracula-green/10 px-3 py-1.5">
                    <CheckCircle size={14} color={colors.green} />
                    <Text className="text-[11px] font-semibold text-dracula-green">
                      {t("transaction.ai.cacheHit")}
                    </Text>
                  </View>
                ) : null}

                {/* AI Classification */}
                <View className="gap-1.5">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-[10px] font-bold uppercase tracking-wider text-dracula-purple">
                      {t("transaction.ai.category")}
                    </Text>
                    <View className="rounded border border-dracula-pink/30 bg-dracula-pink/10 px-2 py-0.5">
                      <Text className="text-[11px] font-bold text-dracula-pink">
                        {analysis.category}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-base font-bold text-dracula-fg leading-6">
                    {analysis.friendlyDescription}
                  </Text>
                </View>

                {/* Risk evaluation gauge */}
                <View className="gap-2.5 rounded-xl border border-white/5 bg-dracula-surface-deep/80 p-3.5">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-1.5">
                      <ShieldAlert size={15} color={colors.cyan} />
                      <Text className="text-xs font-bold text-dracula-fg">
                        {t("transaction.ai.risk")}
                      </Text>
                    </View>
                    <Text className={`text-xs font-bold uppercase ${getRiskTextColor(analysis.riskScore)}`}>
                      Risco {analysis.riskLevel} ({analysis.riskScore}/100)
                    </Text>
                  </View>

                  {/* Risk bar */}
                  <View className="h-2 w-full rounded-full bg-black/40 overflow-hidden">
                    <View
                      style={{ width: `${Math.min(analysis.riskScore, 100)}%` }}
                      className={`h-full rounded-full ${getRiskBgColor(analysis.riskScore)}`}
                    />
                  </View>

                  <Text className="text-xs leading-5 text-dracula-muted">
                    {analysis.riskExplanation}
                  </Text>
                </View>

                {/* Budget tip */}
                <View className="gap-1 rounded-xl border border-dracula-purple/30 bg-dracula-purple/10 p-3.5">
                  <Text className="text-[10px] font-bold uppercase tracking-wider text-dracula-purple">
                    {t("transaction.ai.tip")}
                  </Text>
                  <Text className="text-xs leading-5 text-dracula-fg">
                    {analysis.budgetTip}
                  </Text>
                </View>
              </View>
            ) : null}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
