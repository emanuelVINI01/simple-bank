import { ActivityIndicator, Text } from "react-native";
import { colors, type ThemeColor } from "@/theme/colors";
import { AnimatedPressable } from "@/components/ui/AnimatedPressable";

type PrimaryButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  className?: string;
  textClassName?: string;
  color?: ThemeColor;
};

const bgClasses: Record<ThemeColor, string> = {
  bg: "bg-dracula-bg",
  card: "bg-dracula-card",
  cyan: "bg-dracula-cyan",
  fg: "bg-dracula-fg",
  green: "bg-dracula-green",
  muted: "bg-dracula-muted",
  orange: "bg-dracula-orange",
  pink: "bg-dracula-pink",
  purple: "bg-dracula-purple",
  red: "bg-dracula-red",
  surface: "bg-dracula-surface",
  surfaceDeep: "bg-dracula-surface-deep",
  yellow: "bg-dracula-yellow",
};

export function PrimaryButton({ title, onPress, loading, disabled, leftIcon, className, textClassName, color = "purple" }: PrimaryButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={isDisabled}
      feedback="lift"
      className={`min-h-[54px] flex-row items-center justify-center gap-2 rounded-2xl border border-white/10 px-6 py-4 shadow-lg ${isDisabled ? "bg-dracula-card opacity-70" : bgClasses[color]} ${className ?? ""}`}
    >
      {loading ? (
        <ActivityIndicator color={colors.fg} size="small" />
      ) : (
        <>
          {leftIcon}
          <Text className={`text-center text-base font-extrabold text-dracula-fg ${textClassName ?? ""}`}>{title}</Text>
        </>
      )}
    </AnimatedPressable>
  );
}
