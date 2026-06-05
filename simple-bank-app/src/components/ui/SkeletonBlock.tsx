import { View } from "react-native";

type SkeletonBlockProps = {
  height?: 16 | 56 | 80 | 120;
  className?: string;
};

const heightClasses = {
  16: "h-4",
  56: "h-14",
  80: "h-20",
  120: "h-[120px]",
};

export function SkeletonBlock({ height = 16, className }: SkeletonBlockProps) {
  return <View className={`w-full animate-pulse rounded-lg bg-dracula-card opacity-60 ${heightClasses[height]} ${className ?? ""}`} />;
}
