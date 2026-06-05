import { Text, View } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { colors } from "@/theme/colors";
import { AnimatedPressable } from "@/components/ui/AnimatedPressable";

export type ServiceTileItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  onPress: () => void;
  iconColor?: string;
};

export function ServiceTile({ item }: { item: ServiceTileItem }) {
  const Icon = item.icon;
  const iconColor = item.iconColor ?? colors.cyan;

  return (
    <AnimatedPressable
      onPress={item.onPress}
      feedback="lift"
      className="min-h-[92px] flex-1 items-start gap-2.5 rounded-2xl bg-dracula-surface p-4"
    >
      <View
        className="h-10 w-10 items-center justify-center rounded-xl bg-dracula-cyan/15"
      >
        <Icon size={20} color={iconColor} />
      </View>
      <Text className="text-[13px] font-semibold text-dracula-fg" numberOfLines={2}>
        {item.label}
      </Text>
    </AnimatedPressable>
  );
}

export function ServiceGrid({ items }: { items: ServiceTileItem[] }) {
  const rows: ServiceTileItem[][] = [];
  for (let i = 0; i < items.length; i += 3) rows.push(items.slice(i, i + 3));

  return (
    <View className="mx-5 mb-7 gap-2.5">
      {rows.map((row, ri) => (
        <View key={ri} className="flex-row gap-2.5">
          {row.map((item) => (
            <ServiceTile key={item.id} item={item} />
          ))}
          {row.length < 3
            ? Array.from({ length: 3 - row.length }).map((_, i) => <View key={`empty-${i}`} className="flex-1" />)
            : null}
        </View>
      ))}
    </View>
  );
}
