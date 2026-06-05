import { useMutation } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { downloadReceiptPdf, shareReceiptPdf } from "@/lib/receipt";

export function useDownloadReceipt() {
  return useMutation({
    mutationFn: downloadReceiptPdf,
    onSuccess: async () => {
      await Haptics.selectionAsync().catch(() => undefined);
    },
  });
}

export function useShareReceipt() {
  return useMutation({
    mutationFn: shareReceiptPdf,
    onSuccess: async () => {
      await Haptics.selectionAsync().catch(() => undefined);
    },
  });
}

