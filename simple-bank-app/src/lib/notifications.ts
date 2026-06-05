import * as Notifications from "expo-notifications";
import type { ApiTransaction } from "@/api/types";
import { formatMoney } from "@/lib/format";

export async function ensureNotificationPermission() {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;

  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

export async function notifyCreditReceived(transaction: ApiTransaction) {
  const allowed = await ensureNotificationPermission();
  if (!allowed) return null;

  const payerName = transaction.payer?.name ?? "alguem";

  return Notifications.scheduleNotificationAsync({
    content: {
      title: "Transferencia recebida",
      body: `Voce recebeu ${formatMoney(transaction.amount)} de ${payerName}.`,
      data: {
        transactionId: transaction.id,
      },
    },
    trigger: null,
  });
}

export function configureForegroundNotifications() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

