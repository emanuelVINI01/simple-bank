import { useState } from "react";
import { Text, View } from "react-native";
import { Plus } from "lucide-react-native";
import { usePaymentKeys, useCreatePaymentKey, useDeletePaymentKey } from "@/hooks/use-payment-keys";
import { colors } from "@/theme/colors";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { StateView } from "@/components/ui/StateView";
import { PaymentKeyLimitMeter } from "@/components/keys/PaymentKeyLimitMeter";
import { PaymentKeyList } from "@/components/keys/PaymentKeyList";
import { Screen } from "@/components/ui/Screen";
import { useI18n } from "@/i18n/provider";

export default function KeysScreen() {
  const keysQuery = usePaymentKeys();
  const createKey = useCreatePaymentKey();
  const deleteKey = useDeletePaymentKey();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { t } = useI18n();

  async function handleDelete(id: string) {
    setDeletingId(id);
    await deleteKey.mutateAsync(id).finally(() => setDeletingId(null));
  }

  const keys = keysQuery.data ?? [];
  const atLimit = keys.length >= 10;

  return (
    <Screen scroll contentContainerClassName="pb-8">
      <View className="px-5 pb-4 pt-5">
        <Text className="text-xl font-extrabold text-dracula-fg">{t("keys.title")}</Text>
        <Text className="mt-1 text-sm text-dracula-muted">{t("keys.panel.subtitle") ?? "Use suas chaves para receber transferencias."}</Text>
      </View>
      <PaymentKeyLimitMeter count={keys.length} />
      <View className="mb-4 px-5">
        <PrimaryButton
          title={t("keys.create")}
          onPress={() => createKey.mutate()}
          loading={createKey.isPending}
          disabled={atLimit || createKey.isPending}
          leftIcon={<Plus size={18} color={colors.fg} />}
        />
        {atLimit ? (
          <Text className="mt-1.5 text-center text-xs text-dracula-orange">
            {t("keys.atLimit")}
          </Text>
        ) : null}
        {createKey.isError ? (
          <Text className="mt-1.5 text-center text-xs text-dracula-red">
            {createKey.error instanceof Error ? createKey.error.message : t("common.error")}
          </Text>
        ) : null}
      </View>
      <View className="px-5">
        {keysQuery.isLoading ? (
          <StateView state="loading" skeletonCount={3} />
        ) : keysQuery.isError ? (
          <StateView state="error" message={t("common.error")} onRetry={() => void keysQuery.refetch()} />
        ) : keys.length === 0 ? (
          <StateView state="empty" message={t("keys.empty")} />
        ) : (
          <PaymentKeyList keys={keys} onDelete={handleDelete} deletingId={deletingId ?? undefined} />
        )}
      </View>
    </Screen>
  );
}
