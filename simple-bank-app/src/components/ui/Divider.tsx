import { View } from "react-native";

type DividerProps = { className?: string };

export function Divider({ className }: DividerProps) {
  return <View className={`my-1 h-px bg-dracula-card ${className ?? ""}`} />;
}
