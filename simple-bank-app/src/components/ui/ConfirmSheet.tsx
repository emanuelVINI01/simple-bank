import { Modal, Pressable, Text, View } from "react-native";
import { colors } from "@/theme/colors";
import { AnimatedPressable } from "@/components/ui/AnimatedPressable";

type ConfirmSheetProps = {
  visible: boolean;
  title: string;
  body?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  dangerous?: boolean;
};

export function ConfirmSheet({ visible, title, body, confirmLabel = "Confirmar", cancelLabel = "Cancelar", onConfirm, onCancel, dangerous }: ConfirmSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable className="flex-1 justify-end bg-black/60" onPress={onCancel}>
        <Pressable
          className="gap-4 rounded-t-[20px] bg-dracula-surface p-6"
        >
          <Text className="text-center text-[17px] font-bold text-dracula-fg">{title}</Text>
          {body ? <Text className="text-center text-sm text-dracula-muted">{body}</Text> : null}
          <View className="mt-1 gap-2.5">
            <AnimatedPressable
              onPress={onConfirm}
              feedback="lift"
              className={`items-center rounded-xl py-3.5 ${dangerous ? "bg-dracula-red" : "bg-dracula-purple"}`}
            >
              <Text className="text-base font-bold text-dracula-fg">{confirmLabel}</Text>
            </AnimatedPressable>
            <AnimatedPressable
              onPress={onCancel}
              feedback="soft"
              className="items-center rounded-xl bg-dracula-card py-3.5"
            >
              <Text className="text-base font-semibold text-dracula-muted">{cancelLabel}</Text>
            </AnimatedPressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
