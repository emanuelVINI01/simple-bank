import { useState } from "react";
import { Text, View } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import { formatMoney } from "@/lib/format";
import { colors } from "@/theme/colors";
import { SkeletonBlock } from "@/components/ui/SkeletonBlock";
import { IconButton } from "@/components/ui/IconButton";
import { useI18n } from "@/i18n/provider";

type BalancePanelProps = {
  balance?: number;
  loading?: boolean;
  visible: boolean;
  onToggleVisible: () => void;
};

export function BalancePanel({ balance, loading, visible, onToggleVisible }: BalancePanelProps) {
  const { t } = useI18n();

  return (
    <View className="mx-5 mb-5 rounded-3xl bg-dracula-surface p-5 shadow-lg">
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="text-[13px] text-dracula-muted">{t("home.balance")}</Text>
        <IconButton
          icon={visible ? <EyeOff size={16} color={colors.muted} /> : <Eye size={16} color={colors.muted} />}
          onPress={onToggleVisible}
        />
      </View>
      {loading ? (
        <SkeletonBlock height={56} className="max-w-40" />
      ) : (
        <Text className={`text-[32px] font-extrabold ${visible ? "text-dracula-green" : "text-dracula-muted"}`}>
          {visible ? formatMoney(balance) : t("home.hiddenBalance")}
        </Text>
      )}
    </View>
  );
}
