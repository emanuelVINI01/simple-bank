import { Text, View } from "react-native";
import { formatShortReference } from "@/lib/format";

type AccountCardPreviewProps = {
  name?: string | null;
  id?: string | null;
};

export function AccountCardPreview({ name, id }: AccountCardPreviewProps) {
  return (
    <View className="mx-5 mb-5 rounded-3xl border border-dracula-purple/25 bg-dracula-card p-[18px]">
      <Text className="mb-1.5 text-[11px] text-dracula-muted">Conta Simple Bank</Text>
      <Text className="text-[15px] font-bold text-dracula-fg" numberOfLines={1}>
        {name ?? "—"}
      </Text>
      <Text className="mt-1 text-xs text-dracula-muted">
        ID: {id ? formatShortReference(id) : "—"}
      </Text>
    </View>
  );
}
