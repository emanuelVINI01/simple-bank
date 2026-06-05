import { useCallback, useEffect, useRef } from "react";
import { AppState, type AppStateStatus } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { fetchTransactions } from "@/api/banking";
import type { ApiTransaction, ApiUser } from "@/api/types";
import { queryKeys } from "@/hooks/query-keys";
import { clearNotificationCursor, getNotificationCursor, setNotificationCursor } from "@/lib/notification-cursor";
import { configureForegroundNotifications, notifyCreditReceived } from "@/lib/notifications";

type CreditNotificationOptions = {
  enabled: boolean;
  intervalMs?: number;
  onOpenTransaction?: (transactionId: string) => void;
  user?: ApiUser | null;
};

export function useCreditNotifications(options: CreditNotificationOptions) {
  const queryClient = useQueryClient();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const runningRef = useRef(false);
  const intervalMs = options.intervalMs ?? 25000;
  const userId = options.user?.id;

  const checkForCredits = useCallback(async () => {
    if (!options.enabled || !userId || runningRef.current) return;
    runningRef.current = true;

    try {
      const transactions = await fetchTransactions(25);
      const cursor = await getNotificationCursor(userId);
      const newest = transactions[0];

      if (!newest) {
        await setNotificationCursor({
          initialized: true,
          lastSeenCreatedAt: null,
          lastSeenTransactionId: null,
          userId,
        });
        return;
      }

      if (!cursor?.initialized) {
        await setNotificationCursor({
          initialized: true,
          lastSeenCreatedAt: newest.createdAt,
          lastSeenTransactionId: newest.id,
          userId,
        });
        return;
      }

      const newCredits = getNewCredits(transactions, cursor.lastSeenCreatedAt, cursor.lastSeenTransactionId);

      for (const transaction of newCredits.reverse()) {
        await notifyCreditReceived(transaction);
      }

      if (newCredits.length > 0) {
        void queryClient.invalidateQueries({ queryKey: queryKeys.me });
        void queryClient.invalidateQueries({ queryKey: ["transactions"] });
      }

      await setNotificationCursor({
        initialized: true,
        lastSeenCreatedAt: newest.createdAt,
        lastSeenTransactionId: newest.id,
        userId,
      });
    } finally {
      runningRef.current = false;
    }
  }, [options.enabled, queryClient, userId]);

  useEffect(() => {
    configureForegroundNotifications();
  }, []);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response: Notifications.NotificationResponse) => {
      const transactionId = response.notification.request.content.data?.transactionId;

      if (typeof transactionId === "string") {
        options.onOpenTransaction?.(transactionId);
      }
    });

    return () => subscription.remove();
  }, [options]);

  useEffect(() => {
    if (!options.enabled || !userId) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      return;
    }

    void checkForCredits();
    intervalRef.current = setInterval(() => void checkForCredits(), intervalMs);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [checkForCredits, intervalMs, options.enabled, userId]);

  useEffect(() => {
    function handleAppStateChange(state: AppStateStatus) {
      if (state === "active") {
        void checkForCredits();
      }
    }

    const subscription = AppState.addEventListener("change", handleAppStateChange);
    return () => subscription.remove();
  }, [checkForCredits]);

  return {
    checkForCredits,
    clearCursor: userId ? () => clearNotificationCursor(userId) : undefined,
  };
}

function getNewCredits(transactions: ApiTransaction[], lastSeenCreatedAt: string | null, lastSeenTransactionId: string | null) {
  if (!lastSeenCreatedAt && !lastSeenTransactionId) return [];

  return transactions.filter((transaction) => {
    if (transaction.type !== "CREDIT") return false;
    if (transaction.id === lastSeenTransactionId) return false;
    if (!lastSeenCreatedAt) return true;
    return new Date(transaction.createdAt).getTime() > new Date(lastSeenCreatedAt).getTime();
  });
}
