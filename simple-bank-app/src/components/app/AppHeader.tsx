import { Bell } from "lucide-react-native";
import { Text, View } from "react-native";
import { Avatar } from "@/components/ui/Avatar";
import { AnimatedPressable } from "@/components/ui/AnimatedPressable";
import { IconButton } from "@/components/ui/IconButton";
import { colors } from "@/theme/colors";
import { useI18n } from "@/i18n/provider";

type AppHeaderProps = {
  name?: string | null;
  balanceVisible: boolean;
  notificationCount?: number;
  onToggleBalance: () => void;
  onOpenNotifications?: () => void;
  onOpenProfile?: () => void;
};

export function AppHeader({
  name,
  balanceVisible,
  notificationCount = 0,
  onToggleBalance,
  onOpenNotifications,
  onOpenProfile,
}: AppHeaderProps) {
  const { t } = useI18n();
  const firstName = name?.trim().split(/\s+/)[0] ?? "Você";
  const hasNotifications = notificationCount > 0;

  return (
    <View className="flex-row items-center gap-3 px-5 py-4">
      <AnimatedPressable
        onPress={onOpenProfile}
        feedback="soft"
        disabled={!onOpenProfile}
        className="flex-1 flex-row items-center gap-3"
      >
        <Avatar name={name} />
        <View className="flex-1">
          <Text className="text-xs text-dracula-muted">{t("home.goodMorning")}</Text>
          <Text className="text-[17px] font-bold text-dracula-fg">{firstName}</Text>
        </View>
      </AnimatedPressable>
      <AnimatedPressable
        onPress={onToggleBalance}
        feedback="soft"
        className="rounded-lg bg-dracula-card px-2.5 py-1.5"
      >
        <Text className="text-xs font-semibold text-dracula-purple">
          {balanceVisible ? t("home.hideBalance") : t("home.showBalance")}
        </Text>
      </AnimatedPressable>
      <View>
        <IconButton icon={<Bell size={20} color={colors.muted} />} onPress={onOpenNotifications ?? (() => {})} />
        {hasNotifications ? (
          <View className="absolute right-1 top-1 min-h-4 min-w-4 items-center justify-center rounded-full bg-dracula-pink px-1">
            <Text className="text-[9px] font-extrabold text-dracula-fg">{notificationCount > 9 ? "9+" : notificationCount}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}
