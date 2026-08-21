import { useState } from "react";
import { ActivityIndicator, Text, TextInput, View } from "react-native";
import { Sparkles } from "lucide-react-native";
import { useParseTransfer } from "@/hooks/use-ai";
import { useI18n } from "@/i18n/provider";
import { colors } from "@/theme/colors";
import { AnimatedPressable } from "@/components/ui/AnimatedPressable";
import type { ParsedTransfer } from "@/api/types";

type AiTransferInputProps = {
  onParsed: (data: ParsedTransfer) => void;
};

export function AiTransferInput({ onParsed }: AiTransferInputProps) {
  const { t } = useI18n();
  const [prompt, setPrompt] = useState("");
  const parseMutation = useParseTransfer();

  const handleParse = async () => {
    if (!prompt.trim() || parseMutation.isPending) return;

    try {
      const response = await parseMutation.mutateAsync(prompt.trim());
      if (response.result) {
        onParsed(response.result);
        setPrompt("");
      }
    } catch {
      // Error handled by mutation state
    }
  };

  return (
    <View className="gap-2.5 rounded-2xl border border-dracula-purple/30 bg-dracula-surface/90 p-4">
      <View className="flex-row items-center gap-2">
        <Sparkles size={16} color={colors.purple} />
        <Text className="text-xs font-bold uppercase tracking-wider text-dracula-purple">
          {t("transfer.ai.title")}
        </Text>
      </View>

      <TextInput
        value={prompt}
        onChangeText={setPrompt}
        placeholder={t("transfer.ai.placeholder")}
        placeholderTextColor={colors.muted}
        className="rounded-xl border border-white/10 bg-dracula-surface-deep/80 px-3.5 py-2.5 text-xs text-dracula-fg"
        multiline
        numberOfLines={2}
        returnKeyType="done"
      />

      {parseMutation.error ? (
        <Text className="text-[11px] text-dracula-red">
          {parseMutation.error.message}
        </Text>
      ) : null}

      <AnimatedPressable
        onPress={handleParse}
        disabled={!prompt.trim() || parseMutation.isPending}
        feedback="lift"
        className="flex-row items-center justify-center gap-2 rounded-xl bg-dracula-purple/20 border border-dracula-purple/40 py-2.5 disabled:opacity-50"
      >
        {parseMutation.isPending ? (
          <ActivityIndicator size="small" color={colors.purple} />
        ) : (
          <Sparkles size={14} color={colors.purple} />
        )}
        <Text className="text-xs font-bold text-dracula-purple">
          {parseMutation.isPending
            ? t("transfer.ai.interpreting")
            : t("transfer.ai.action")}
        </Text>
      </AnimatedPressable>
    </View>
  );
}
