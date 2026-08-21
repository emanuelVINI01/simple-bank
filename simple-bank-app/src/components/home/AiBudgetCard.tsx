import { useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { AlertTriangle, Sparkles } from "lucide-react-native";
import { useAiUsage, useBudgetAdvice } from "@/hooks/use-ai";
import { useI18n } from "@/i18n/provider";
import { formatMoney } from "@/lib/format";
import { colors } from "@/theme/colors";
import { AnimatedPressable } from "@/components/ui/AnimatedPressable";

export function AiBudgetCard() {
  const { t } = useI18n();
  const [enabled, setEnabled] = useState(false);

  const usageQuery = useAiUsage(true);
  const budgetQuery = useBudgetAdvice(enabled);

  const usage = usageQuery.data;
  const budget = budgetQuery.data?.result;
  const isLoading = budgetQuery.isFetching;
  const error = budgetQuery.error;

  const handleGenerate = () => {
    setEnabled(true);
    budgetQuery.refetch();
  };

  return (
    <View className="gap-3.5 rounded-[22px] border border-dracula-purple/30 bg-dracula-surface p-4 shadow-lg shadow-black/40">
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-white/[0.08] pb-3">
        <View className="flex-row items-center gap-2">
          <View className="h-7 w-7 items-center justify-center rounded-lg bg-dracula-purple/20">
            <Sparkles size={16} color={colors.purple} />
          </View>
          <Text className="text-[15px] font-bold text-dracula-fg">
            {t("home.ai.title")}
          </Text>
        </View>

        {usage ? (
          <View className="rounded-md border border-dracula-cyan/30 bg-black/40 px-2 py-0.5">
            <Text className="font-mono text-[11px] text-dracula-cyan">
              {usage.remaining} restando
            </Text>
          </View>
        ) : null}
      </View>

      {/* Body */}
      {!enabled && !budget ? (
        <View className="items-center justify-center py-4 text-center">
          <Text className="text-center text-xs leading-5 text-dracula-muted">
            {t("home.ai.subtitle")}
          </Text>
          <AnimatedPressable
            onPress={handleGenerate}
            disabled={usage?.remaining === 0}
            feedback="lift"
            className="mt-3.5 flex-row items-center gap-2 rounded-xl bg-dracula-purple px-4 py-2.5"
          >
            <Sparkles size={14} color={colors.fg} />
            <Text className="text-xs font-bold text-dracula-fg">
              {t("home.ai.generate")}
            </Text>
          </AnimatedPressable>
        </View>
      ) : isLoading ? (
        <View className="items-center justify-center py-6 gap-2">
          <ActivityIndicator size="small" color={colors.purple} />
          <Text className="text-xs text-dracula-muted">
            Consultando modelo financeiro...
          </Text>
        </View>
      ) : error ? (
        <View className="items-center justify-center py-4 gap-2">
          <AlertTriangle size={20} color={colors.red} />
          <Text className="text-center text-xs text-dracula-red">
            {error.message}
          </Text>
          <AnimatedPressable
            onPress={handleGenerate}
            feedback="soft"
            className="rounded-lg bg-dracula-card px-3 py-1.5"
          >
            <Text className="text-xs font-bold text-dracula-fg">
              {t("common.retry")}
            </Text>
          </AnimatedPressable>
        </View>
      ) : budget ? (
        <View className="gap-3 pt-1">
          {/* Summary text */}
          <Text className="text-xs leading-5 text-dracula-muted">
            {budget.summary}
          </Text>

          {/* Recommendations list */}
          {budget.recommendations && budget.recommendations.length > 0 ? (
            <View className="gap-1.5">
              <Text className="text-[11px] font-bold uppercase tracking-wider text-dracula-purple">
                {t("home.ai.recommendations")}
              </Text>
              {budget.recommendations.map((rec, i) => (
                <View
                  key={i}
                  className="flex-row items-start gap-2 rounded-lg border border-white/5 bg-dracula-surface-deep/70 p-2"
                >
                  <Text className="font-bold text-dracula-pink">·</Text>
                  <Text className="flex-1 text-[11px] leading-4 text-dracula-fg">
                    {rec}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}

          {/* Category breakdown bars */}
          {budget.categoryBreakdown && budget.categoryBreakdown.length > 0 ? (
            <View className="gap-1.5 pt-1">
              <Text className="text-[11px] font-bold uppercase tracking-wider text-dracula-purple">
                {t("home.ai.breakdown")}
              </Text>
              {budget.categoryBreakdown.map((cat, i) => (
                <View key={i} className="gap-1">
                  <View className="flex-row justify-between">
                    <Text className="text-[10px] text-dracula-muted">{cat.category}</Text>
                    <Text className="text-[10px] font-bold text-dracula-fg">
                      {cat.percentage}% ({formatMoney(cat.totalCents)})
                    </Text>
                  </View>
                  <View className="h-1.5 w-full rounded-full bg-black/40 overflow-hidden">
                    <View
                      style={{ width: `${Math.min(cat.percentage, 100)}%` }}
                      className="h-full rounded-full bg-dracula-purple"
                    />
                  </View>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
