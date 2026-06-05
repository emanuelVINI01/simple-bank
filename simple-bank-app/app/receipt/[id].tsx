import { useEffect, useRef } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Linking, Text, View } from "react-native";
import { ArrowLeft, Download, FileText, Share2 } from "lucide-react-native";
import { useDownloadReceipt, useShareReceipt } from "@/hooks/use-receipt";
import { useTransactions, findTransactionById } from "@/hooks/use-transactions";
import { colors } from "@/theme/colors";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { IconButton } from "@/components/ui/IconButton";
import { StateView } from "@/components/ui/StateView";
import { Screen } from "@/components/ui/Screen";

export default function ReceiptScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const txQuery = useTransactions({ limit: 100 });
  const download = useDownloadReceipt();
  const share = useShareReceipt();

  const transaction = findTransactionById(txQuery.data, id ?? "");
  const transactionId = transaction?.id;
  const generatedUri = download.data?.uri;
  const openedUriRef = useRef<string | null>(null);

  function generateReceipt() {
    if (!transactionId) return;
    openedUriRef.current = null;
    download.mutate(transactionId);
  }

  useEffect(() => {
    if (!transactionId || download.isPending || download.data || download.isError) return;
    download.mutate(transactionId);
  }, [download, transactionId]);

  useEffect(() => {
    if (!generatedUri || openedUriRef.current === generatedUri) return;
    openedUriRef.current = generatedUri;
    void Linking.openURL(generatedUri).catch(() => undefined);
  }, [generatedUri]);

  return (
    <Screen contentContainerClassName="flex-grow">
      <View className="flex-row items-center gap-2 px-5 py-3">
        <IconButton icon={<ArrowLeft size={20} color={colors.fg} />} onPress={() => router.back()} />
        <Text className="flex-1 text-[17px] font-bold text-dracula-fg">Comprovante</Text>
        {transaction ? (
            <IconButton
              icon={<Share2 size={20} color={colors.cyan} />}
            onPress={() => share.mutate(transaction.id)}
            disabled={share.isPending}
          />
        ) : null}
      </View>

      {!transaction ? (
        <View className="flex-1 justify-center">
          <StateView state="empty" message="Transacao nao encontrada." />
        </View>
      ) : (
        <View className="flex-1 justify-center gap-4 px-5">
          <View className="items-center gap-2 rounded-[24px] border border-dracula-purple/25 bg-dracula-surface p-6">
            <FileText size={48} color={colors.purple} />
            <Text className="text-center text-base font-bold text-dracula-fg">
              {download.isPending ? "Gerando comprovante" : generatedUri ? "Comprovante aberto" : "Gerar comprovante"}
            </Text>
            <Text className="text-center text-[13px] text-dracula-muted">
              {generatedUri
                ? "O PDF foi emitido pela API. Use o botao no topo para compartilhar."
                : "O PDF e emitido automaticamente pela API do banco ao abrir esta tela."}
            </Text>
          </View>

          <PrimaryButton
            title={generatedUri ? "Gerar novamente" : "Gerar PDF"}
            onPress={generateReceipt}
            loading={download.isPending}
            leftIcon={<Download size={18} color={colors.fg} />}
          />

          {download.isError ? (
            <Text className="text-center text-[13px] text-dracula-red">
              {download.error instanceof Error ? download.error.message : "Nao foi possivel gerar este comprovante."}
            </Text>
          ) : null}

          {share.isError ? (
            <Text className="text-center text-[13px] text-dracula-red">
              {share.error instanceof Error ? share.error.message : "Nao foi possivel compartilhar este comprovante."}
            </Text>
          ) : null}
        </View>
      )}
    </Screen>
  );
}
