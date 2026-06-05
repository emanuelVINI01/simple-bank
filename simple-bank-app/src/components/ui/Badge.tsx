import { Text, View } from "react-native";

type BadgeProps = {
  label: string;
  variant?: "credit" | "debit" | "neutral";
};

const variantStyles = {
  credit: "bg-dracula-green/15 text-dracula-green",
  debit: "bg-dracula-pink/15 text-dracula-pink",
  neutral: "bg-dracula-card text-dracula-muted",
};

export function Badge({ label, variant = "neutral" }: BadgeProps) {
  const [bgClass, textClass] = variantStyles[variant].split(" ");
  return (
    <View className={`self-start rounded-md px-2 py-0.5 ${bgClass}`}>
      <Text className={`text-xs font-semibold ${textClass}`}>{label}</Text>
    </View>
  );
}
