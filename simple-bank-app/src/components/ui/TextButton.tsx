import { Text } from "react-native";
import { AnimatedPressable } from "@/components/ui/AnimatedPressable";

type TextButtonProps = {
  title: string;
  onPress: () => void;
  className?: string;
  textClassName?: string;
};

export function TextButton({ title, onPress, className, textClassName }: TextButtonProps) {
  return (
    <AnimatedPressable onPress={onPress} feedback="soft" className={`min-h-11 items-center justify-center rounded-xl px-3 ${className ?? ""}`}>
      <Text className={`text-sm font-semibold text-dracula-cyan ${textClassName ?? ""}`}>{title}</Text>
    </AnimatedPressable>
  );
}
