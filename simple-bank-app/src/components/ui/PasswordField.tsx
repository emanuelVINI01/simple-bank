import { useState } from "react";
import { Eye, EyeOff } from "lucide-react-native";
import { Field } from "@/components/ui/Field";
import { IconButton } from "@/components/ui/IconButton";
import { colors } from "@/theme/colors";

type PasswordFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  returnKeyType?: "done" | "go" | "next" | "search" | "send";
  onSubmitEditing?: () => void;
};

export function PasswordField({ label, value, onChangeText, placeholder, error, returnKeyType, onSubmitEditing }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <Field
      label={label}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      error={error}
      secureTextEntry={!visible}
      returnKeyType={returnKeyType}
      onSubmitEditing={onSubmitEditing}
      rightElement={
        <IconButton
          icon={visible ? <EyeOff size={18} color={colors.muted} /> : <Eye size={18} color={colors.muted} />}
          onPress={() => setVisible((v) => !v)}
          className="pr-2.5"
        />
      }
    />
  );
}
