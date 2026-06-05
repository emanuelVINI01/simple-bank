import { ScrollView, Text, View } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { colors } from "@/theme/colors";
import { AnimatedPressable } from "@/components/ui/AnimatedPressable";

export type QuickActionItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  onPress: () => void;
  iconColor?: string;
};

type QuickActionRailProps = { items: QuickActionItem[] };

export function QuickAction({ item }: { item: QuickActionItem }) {
  const Icon = item.icon;
  const iconColor = item.iconColor ?? colors.purple;

  return (
    <AnimatedPressable onPress={item.onPress} feedback="lift" className="w-[76px] items-center gap-2">
      <View
        className="h-14 w-14 items-center justify-center rounded-2xl border border-dracula-purple/25 bg-dracula-card"
      >
        <Icon size={22} color={iconColor} />
      </View>
      <Text className="text-center text-xs font-semibold text-dracula-fg" numberOfLines={2}>
        {item.label}
      </Text>
    </AnimatedPressable>
  );
}

export function QuickActionRail({ items }: QuickActionRailProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-4 px-5 py-1"
      className="mb-7"
    >
      {items.map((item) => (
        <QuickAction key={item.id} item={item} />
      ))}
    </ScrollView>
  );
}
