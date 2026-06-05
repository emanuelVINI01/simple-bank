import { useMemo, useState } from "react";
import { Modal, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { X } from "lucide-react-native";
import { buildPaymentQrPayload } from "@/lib/payment-qr";
import { parseMoneyToCents } from "@/lib/format";
import { colors } from "@/theme/colors";
import { Field } from "@/components/ui/Field";
import { IconButton } from "@/components/ui/IconButton";
import { MoneyInput } from "@/components/ui/MoneyInput";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

type PaymentQrSheetProps = {
  paymentKey: string;
  visible: boolean;
  onClose: () => void;
};

export function PaymentQrSheet({ paymentKey, visible, onClose }: PaymentQrSheetProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const payload = useMemo(() => {
    const cents = amount.trim() ? parseMoneyToCents(amount) : undefined;
    return buildPaymentQrPayload({
      amount: cents && cents > 0 ? cents : undefined,
      description,
      key: paymentKey,
    });
  }, [amount, description, paymentKey]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-dracula-bg px-5 py-5">
        <View className="mb-5 flex-row items-center gap-2">
          <View className="flex-1">
            <Text className="text-xl font-extrabold text-dracula-fg">QR para receber</Text>
            <Text className="mt-1 text-sm text-dracula-muted">Defina valor e descricao se quiser.</Text>
          </View>
          <IconButton icon={<X size={22} color={colors.fg} />} onPress={onClose} />
        </View>

        <View className="gap-4 rounded-[24px] bg-dracula-surface p-4">
          <MoneyInput label="Valor opcional" value={amount} onChangeText={setAmount} />
          <Field
            label="Descricao opcional"
            value={description}
            onChangeText={setDescription}
            placeholder="Ex: reembolso, aluguel..."
            returnKeyType="done"
          />
          <View className="items-center rounded-[20px] bg-white p-4">
            <QRCode value={payload} size={230} backgroundColor="#ffffff" color="#111111" />
          </View>
          <Text className="text-center text-xs leading-5 text-dracula-muted">
            Quem escanear este QR no Simple Bank tera a chave preenchida automaticamente.
          </Text>
        </View>

        <PrimaryButton title="Concluir" onPress={onClose} className="mt-5 bg-dracula-purple" />
      </View>
    </Modal>
  );
}
