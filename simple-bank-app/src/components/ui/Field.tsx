import { Text, TextInput, View, type KeyboardTypeOptions } from "react-native";
import { colors } from "@/theme/colors";

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoComplete?: string;
  secureTextEntry?: boolean;
  editable?: boolean;
  className?: string;
  rightElement?: React.ReactNode;
  returnKeyType?: "done" | "go" | "next" | "search" | "send";
  onSubmitEditing?: () => void;
  multiline?: boolean;
};

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  keyboardType = "default",
  autoCapitalize = "none",
  secureTextEntry = false,
  editable = true,
  className,
  rightElement,
  returnKeyType,
  onSubmitEditing,
  multiline = false,
}: FieldProps) {
  return (
    <View className={`gap-1.5 ${className ?? ""}`}>
      <Text className="text-[13px] font-medium text-dracula-muted">{label}</Text>
      <View
        className={`flex-row items-center rounded-[10px] border bg-dracula-surface-deep ${error ? "border-dracula-red" : "border-dracula-card"}`}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          secureTextEntry={secureTextEntry}
          editable={editable}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          multiline={multiline}
          className="flex-1 px-3.5 py-3.5 text-base text-dracula-fg"
        />
        {rightElement}
      </View>
      {error ? <Text className="text-xs text-dracula-red">{error}</Text> : null}
    </View>
  );
}
