import { Text, View } from "react-native";

type PaymentKeyLimitMeterProps = { count: number; max?: number };

export function PaymentKeyLimitMeter({ count, max = 10 }: PaymentKeyLimitMeterProps) {
  const pct = Math.min(count / max, 1);
  const tone = pct >= 1 ? "red" : pct >= 0.7 ? "orange" : "purple";
  const textClass = tone === "red" ? "text-dracula-red" : tone === "orange" ? "text-dracula-orange" : "text-dracula-purple";
  const barClass = tone === "red" ? "bg-dracula-red" : tone === "orange" ? "bg-dracula-orange" : "bg-dracula-purple";
  const widthClass = pct >= 1 ? "w-full" : pct >= 0.9 ? "w-11/12" : pct >= 0.8 ? "w-4/5" : pct >= 0.7 ? "w-3/4" : pct >= 0.6 ? "w-3/5" : pct >= 0.5 ? "w-1/2" : pct >= 0.4 ? "w-2/5" : pct >= 0.3 ? "w-1/3" : pct >= 0.2 ? "w-1/4" : pct > 0 ? "w-1/12" : "w-0";

  return (
    <View className="mx-5 mb-4 gap-1.5">
      <View className="flex-row justify-between">
        <Text className="text-[13px] text-dracula-muted">Chaves criadas</Text>
        <Text className={`text-[13px] font-bold ${textClass}`}>
          {count}/{max}
        </Text>
      </View>
      <View className="h-1.5 overflow-hidden rounded-[3px] bg-dracula-card">
        <View className={`h-1.5 rounded-[3px] ${barClass} ${widthClass}`} />
      </View>
    </View>
  );
}
