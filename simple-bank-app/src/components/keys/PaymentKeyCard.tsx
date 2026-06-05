import { useState } from "react";
import { Text, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { Copy, QrCode, Trash2 } from "lucide-react-native";
import type { ApiPaymentKey } from "@/api/types";
import { formatDateTime, formatShortReference } from "@/lib/format";
import { colors } from "@/theme/colors";
import { IconButton } from "@/components/ui/IconButton";
import { ConfirmSheet } from "@/components/ui/ConfirmSheet";
import { useI18n } from "@/i18n/provider";
import { PaymentQrSheet } from "@/components/keys/PaymentQrSheet";

type PaymentKeyCardProps = {
  paymentKey: ApiPaymentKey;
  onDelete: (id: string) => void;
  deleting?: boolean;
};

export function PaymentKeyCard({ paymentKey, onDelete, deleting }: PaymentKeyCardProps) {
  const { t } = useI18n();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showQr, setShowQr] = useState(false);

  async function copyKey() {
    await Clipboard.setStringAsync(paymentKey.key);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
  }

  return (
    <>
      <View className="gap-2.5 rounded-xl border border-dracula-card bg-dracula-surface p-4">
        <View className="flex-row items-start justify-between">
          <View className="flex-1 gap-1">
            <Text className="text-[11px] text-dracula-muted">{t("keys.panel.title")}</Text>
            <Text className="font-mono text-[13px] text-dracula-cyan" numberOfLines={1}>
              {paymentKey.key}
            </Text>
            <Text className="text-[11px] text-dracula-muted">
              Criada em {formatDateTime(paymentKey.createdAt)}
            </Text>
          </View>
          <View className="flex-row gap-1">
            <IconButton
              icon={<QrCode size={16} color={colors.green} />}
              onPress={() => setShowQr(true)}
            />
            <IconButton
              icon={<Copy size={16} color={colors.cyan} />}
              onPress={copyKey}
            />
            <IconButton
              icon={<Trash2 size={16} color={colors.red} />}
              onPress={() => setShowConfirm(true)}
              disabled={deleting}
            />
          </View>
        </View>
        <View className="rounded-md bg-dracula-surface-deep p-2">
          <Text className="text-[11px] text-dracula-muted">{t("transaction.shortRef")}</Text>
          <Text className="text-[11px] text-dracula-muted">{formatShortReference(paymentKey.id)}</Text>
        </View>
      </View>
      <PaymentQrSheet paymentKey={paymentKey.key} visible={showQr} onClose={() => setShowQr(false)} />
      <ConfirmSheet
        visible={showConfirm}
        title={t("keys.delete.confirm")}
        body={t("keys.delete.body")}
        confirmLabel={t("common.delete")}
        dangerous
        onConfirm={() => {
          setShowConfirm(false);
          onDelete(paymentKey.id);
        }}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
