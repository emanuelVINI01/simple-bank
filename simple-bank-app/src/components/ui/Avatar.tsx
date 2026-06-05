import { Text, View } from "react-native";
import { getInitials } from "@/lib/mask";

type AvatarProps = {
  name?: string | null;
  size?: "sm" | "md" | "lg";
};

function nameToColor(name: string) {
  const palette = ["purple", "cyan", "pink", "green", "orange"] as const;
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return palette[Math.abs(hash) % palette.length] ?? "purple";
}

const avatarClasses = {
  cyan: "border-dracula-cyan bg-dracula-cyan/20",
  green: "border-dracula-green bg-dracula-green/20",
  orange: "border-dracula-orange bg-dracula-orange/20",
  pink: "border-dracula-pink bg-dracula-pink/20",
  purple: "border-dracula-purple bg-dracula-purple/20",
};

const textClasses = {
  cyan: "text-dracula-cyan",
  green: "text-dracula-green",
  orange: "text-dracula-orange",
  pink: "text-dracula-pink",
  purple: "text-dracula-purple",
};

const sizeClasses = {
  sm: { box: "h-8 w-8", text: "text-xs" },
  md: { box: "h-10 w-10", text: "text-sm" },
  lg: { box: "h-16 w-16", text: "text-xl" },
};

export function Avatar({ name, size = "md" }: AvatarProps) {
  const initials = getInitials(name);
  const tone = nameToColor(name ?? "SB");

  return (
    <View className={`items-center justify-center rounded-full border ${avatarClasses[tone]} ${sizeClasses[size].box}`}>
      <Text className={`font-bold ${textClasses[tone]} ${sizeClasses[size].text}`}>{initials}</Text>
    </View>
  );
}
