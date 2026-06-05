import { useState } from "react";
import { Switch, Text, View } from "react-native";
import { LogOut } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/use-auth";
import { useWallet } from "@/hooks/use-wallet";
import { useNotificationPreference } from "@/hooks/use-notification-preference";
import { formatMoney } from "@/lib/format";
import { maskEmail, maskTaxId } from "@/lib/mask";
import { colors } from "@/theme/colors";
import { Avatar } from "@/components/ui/Avatar";
import { Divider } from "@/components/ui/Divider";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Screen } from "@/components/ui/Screen";
import { useI18n } from "@/i18n/provider";
import type { Locale } from "@/i18n/dictionaries";

export default function ProfileScreen() {
  const router = useRouter();
  const auth = useAuth();
  const wallet = useWallet();
  const notifications = useNotificationPreference();
  const { t, locale, setLocale } = useI18n();
  const [balanceVisible, setBalanceVisible] = useState(true);

  async function handleLogout() {
    await auth.logout();
    router.replace("/(auth)/login");
  }

  const user = auth.user;
  const isEn = locale === "en";

  return (
    <Screen scroll contentContainerClassName="gap-6 px-5 py-6">
        <View>
          <Text className="text-xl font-extrabold text-dracula-fg">{t("profile.title")}</Text>
          <Text className="mt-1 text-sm text-dracula-muted">{t("profile.subtitle")}</Text>
        </View>

        <View className="items-center gap-3">
          <Avatar name={user?.name} size="lg" />
          <Text className="text-xl font-bold text-dracula-fg">{user?.name ?? "—"}</Text>
        </View>

        <View className="gap-3.5 rounded-xl bg-dracula-surface p-4">
          <View className="gap-1">
            <Text className="text-xs text-dracula-muted">{t("profile.email")}</Text>
            <Text className="text-sm text-dracula-fg">{user?.email ? maskEmail(user.email) : "—"}</Text>
          </View>
          <Divider />
          <View className="gap-1">
            <Text className="text-xs text-dracula-muted">{t("profile.taxId")}</Text>
            <Text className="text-sm text-dracula-fg">{user?.taxId ? maskTaxId(user.taxId) : "—"}</Text>
          </View>
          <Divider />
          <View className="gap-1">
            <Text className="text-xs text-dracula-muted">{t("profile.balance")}</Text>
            <Text className="text-lg font-bold text-dracula-green">
              {balanceVisible ? formatMoney(wallet.data?.balance) : t("home.hiddenBalance")}
            </Text>
          </View>
        </View>

        <View className="gap-3.5 rounded-xl bg-dracula-surface p-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-dracula-fg">{t("profile.showBalance")}</Text>
            <Switch
              value={balanceVisible}
              onValueChange={setBalanceVisible}
              trackColor={{ false: colors.card, true: colors.purple }}
              thumbColor={colors.fg}
            />
          </View>
          <Divider />
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-dracula-fg">{t("profile.notifications")}</Text>
            <Switch
              value={notifications.enabled}
              onValueChange={notifications.setEnabled}
              trackColor={{ false: colors.card, true: colors.purple }}
              thumbColor={colors.fg}
            />
          </View>
          <Divider />
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-dracula-fg">{t("profile.language")}</Text>
            <View className="flex-row items-center gap-2">
              <Text className={`text-xs ${!isEn ? "text-dracula-purple font-bold" : "text-dracula-muted"}`}>PT</Text>
              <Switch
                value={isEn}
                onValueChange={(val) => setLocale(val ? "en" : "pt-BR")}
                trackColor={{ false: colors.card, true: colors.card }}
                thumbColor={colors.purple}
              />
              <Text className={`text-xs ${isEn ? "text-dracula-purple font-bold" : "text-dracula-muted"}`}>EN</Text>
            </View>
          </View>
        </View>

        <PrimaryButton
          title={t("profile.logout")}
          onPress={handleLogout}
          loading={auth.logoutPending}
          color="red"
          leftIcon={<LogOut size={18} color={colors.fg} />}
        />
    </Screen>
  );
}
