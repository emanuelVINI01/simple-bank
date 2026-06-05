import { Field } from "@/components/ui/Field";

type MoneyInputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  placeholder?: string;
  returnKeyType?: "done" | "go" | "next" | "search" | "send";
  onSubmitEditing?: () => void;
};

export function MoneyInput({ label, value, onChangeText, error, placeholder = "0,00", returnKeyType, onSubmitEditing }: MoneyInputProps) {
  return (
    <Field
      label={label}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      error={error}
      keyboardType="decimal-pad"
      returnKeyType={returnKeyType}
      onSubmitEditing={onSubmitEditing}
    />
  );
}
