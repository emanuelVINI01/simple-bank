import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { buildApiUrl } from "@/lib/config";
import { getCookieHeader } from "@/lib/cookies";

export type ReceiptFile = {
  transactionId: string;
  uri: string;
};

export async function downloadReceiptPdf(transactionId: string): Promise<ReceiptFile> {
  const cookieHeader = await getCookieHeader();
  const uri = `${FileSystem.documentDirectory ?? FileSystem.cacheDirectory}simple-bank-receipt-${transactionId}.pdf`;

  const result = await FileSystem.downloadAsync(buildApiUrl(`/api/transactions/${transactionId}/receipt`), uri, {
    headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
  });

  if (result.status !== 200) {
    throw new Error(result.status === 404 ? "Comprovante nao encontrado para esta transacao." : "Nao foi possivel baixar o comprovante.");
  }

  return { transactionId, uri: result.uri };
}

export async function shareReceiptPdf(transactionId: string) {
  const receipt = await downloadReceiptPdf(transactionId);
  const canShare = await Sharing.isAvailableAsync();

  if (!canShare) {
    return receipt;
  }

  await Sharing.shareAsync(receipt.uri, {
    dialogTitle: "Compartilhar comprovante",
    mimeType: "application/pdf",
    UTI: "com.adobe.pdf",
  });

  return receipt;
}
