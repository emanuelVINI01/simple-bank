import { Text, View } from "react-native";
import { AlertCircle, Inbox } from "lucide-react-native";
import { colors } from "@/theme/colors";
import { SkeletonBlock } from "@/components/ui/SkeletonBlock";
import { AnimatedPressable } from "@/components/ui/AnimatedPressable";

type StateViewProps =
  | { state: "loading"; skeletonCount?: number }
  | { state: "error"; message?: string; onRetry?: () => void; retryLabel?: string }
  | { state: "empty"; message?: string; icon?: React.ReactNode };

export function StateView(props: StateViewProps) {
  if (props.state === "loading") {
    const count = props.skeletonCount ?? 3;
    return (
      <View className="gap-3 p-5">
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonBlock key={i} height={56} className="rounded-[10px]" />
        ))}
      </View>
    );
  }

  if (props.state === "error") {
    return (
      <View className="items-center gap-3 p-8">
        <AlertCircle size={40} color={colors.red} />
        <Text className="text-center text-[15px] text-dracula-fg">{props.message ?? "Algo deu errado."}</Text>
        {props.onRetry ? (
          <AnimatedPressable
            onPress={props.onRetry}
            feedback="soft"
            className="rounded-[10px] bg-dracula-card px-5 py-2.5"
          >
            <Text className="font-semibold text-dracula-purple">{props.retryLabel ?? "Tentar novamente"}</Text>
          </AnimatedPressable>
        ) : null}
      </View>
    );
  }

  return (
    <View className="items-center gap-3 p-8">
      {props.icon ?? <Inbox size={40} color={colors.muted} />}
      <Text className="text-center text-[15px] text-dracula-muted">{props.message ?? "Nenhum item encontrado."}</Text>
    </View>
  );
}
