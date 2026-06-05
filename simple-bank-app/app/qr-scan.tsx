import { useState } from "react";
import { useRouter } from "expo-router";
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from "expo-camera";
import { ArrowLeft, QrCode } from "lucide-react-native";
import { Text, View } from "react-native";
import { parsePaymentQrPayload } from "@/lib/payment-qr";
import { colors } from "@/theme/colors";
import { IconButton } from "@/components/ui/IconButton";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Screen } from "@/components/ui/Screen";

export default function QrScanScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleScanned(result: BarcodeScanningResult) {
    if (scanned) return;
    const payload = parsePaymentQrPayload(result.data);

    if (!payload) {
      setError("QR invalido para o Simple Bank.");
      setScanned(true);
      return;
    }

    setScanned(true);
    router.replace({
      pathname: "/(tabs)/transfer",
      params: {
        amount: payload.amount ? String(payload.amount) : undefined,
        description: payload.description,
        key: payload.key,
      },
    });
  }

  if (!permission) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center px-5">
          <Text className="text-center text-dracula-muted">Carregando camera...</Text>
        </View>
      </Screen>
    );
  }

  if (!permission.granted) {
    return (
      <Screen>
        <View className="flex-1 justify-center gap-4 px-5">
          <View className="items-center gap-2 rounded-[24px] bg-dracula-surface p-6">
            <QrCode size={44} color={colors.purple} />
            <Text className="text-center text-lg font-extrabold text-dracula-fg">Permitir camera</Text>
            <Text className="text-center text-sm leading-5 text-dracula-muted">
              Use a camera para escanear QR de pagamento Simple Bank.
            </Text>
          </View>
          <PrimaryButton title="Permitir acesso" onPress={() => void requestPermission()} className="bg-dracula-purple" />
          <PrimaryButton title="Voltar" onPress={() => router.back()} color="card" />
        </View>
      </Screen>
    );
  }

  return (
    <View className="flex-1 bg-dracula-bg">
      <CameraView
        className="flex-1"
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={scanned ? undefined : handleScanned}
      >
        <View className="flex-1 justify-between bg-black/30 px-5 py-12">
          <View className="flex-row items-center gap-2">
            <IconButton icon={<ArrowLeft size={22} color={colors.fg} />} onPress={() => router.back()} className="bg-black/35" />
            <Text className="text-lg font-extrabold text-dracula-fg">Escanear QR</Text>
          </View>

          <View className="items-center gap-4">
            <View className="h-64 w-64 rounded-[32px] border-4 border-dracula-cyan/80 bg-transparent" />
            <Text className="text-center text-sm leading-5 text-dracula-fg">
              Aponte para um QR Simple Bank para preencher a transferencia.
            </Text>
            {error ? (
              <View className="rounded-2xl bg-dracula-red px-4 py-3">
                <Text className="text-center text-sm font-bold text-dracula-fg">{error}</Text>
              </View>
            ) : null}
          </View>

          <PrimaryButton
            title={scanned ? "Escanear novamente" : "Cancelar"}
            onPress={() => {
              if (scanned) {
                setError(null);
                setScanned(false);
                return;
              }
              router.back();
            }}
            color="card"
          />
        </View>
      </CameraView>
    </View>
  );
}
