"use client";

import { useState } from "react";
import { ApiError } from "@/lib/api-types";
import { downloadReceiptPdf } from "@/lib/receipt";

export function useReceiptDownload() {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function downloadReceipt(transactionId: string) {
    try {
      setError(null);
      setDownloadingId(transactionId);
      await downloadReceiptPdf(transactionId);
    } catch (downloadError) {
      setError(downloadError instanceof ApiError ? downloadError.message : "Could not download receipt.");
    } finally {
      setDownloadingId(null);
    }
  }

  return {
    downloadReceipt,
    downloadingId,
    error,
  };
}
