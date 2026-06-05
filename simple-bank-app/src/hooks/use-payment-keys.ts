import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { createPaymentKeyRequest, deletePaymentKeyRequest, fetchPaymentKeys } from "@/api/banking";
import { queryKeys } from "@/hooks/query-keys";

export function usePaymentKeys(enabled = true) {
  return useQuery({
    queryKey: queryKeys.paymentKeys,
    queryFn: fetchPaymentKeys,
    enabled,
  });
}

export function useCreatePaymentKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPaymentKeyRequest,
    onSuccess: async () => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
      void queryClient.invalidateQueries({ queryKey: queryKeys.paymentKeys });
      void queryClient.invalidateQueries({ queryKey: queryKeys.me });
    },
  });
}

export function useDeletePaymentKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePaymentKeyRequest,
    onSuccess: async () => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
      void queryClient.invalidateQueries({ queryKey: queryKeys.paymentKeys });
    },
  });
}

export function useCopyPaymentKey() {
  return useMutation({
    mutationFn: async (key: string) => {
      await Clipboard.setStringAsync(key);
      await Haptics.selectionAsync().catch(() => undefined);
      return key;
    },
  });
}

