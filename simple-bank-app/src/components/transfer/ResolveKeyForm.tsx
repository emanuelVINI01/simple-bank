import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Text, View } from "react-native";
import { resolveKeySchema, type ResolveKeyForm } from "@/validation/transfer";
import { Field } from "@/components/ui/Field";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { StateView } from "@/components/ui/StateView";
import { useI18n } from "@/i18n/provider";
import { TextButton } from "@/components/ui/TextButton";

type ResolveKeyFormProps = {
  onSubmit: (key: string) => Promise<void>;
  onScanQr?: () => void;
  loading?: boolean;
  error?: Error | null;
};

export function ResolveKeyForm({ onSubmit, onScanQr, loading, error }: ResolveKeyFormProps) {
  const { t } = useI18n();
  const { control, handleSubmit } = useForm<ResolveKeyForm>({
    resolver: zodResolver(resolveKeySchema),
    defaultValues: { paymentKey: "" },
  });

  const submit = handleSubmit(async ({ paymentKey }) => {
    await onSubmit(paymentKey);
  });

  const apiError = error?.message;

  return (
    <View className="gap-6 p-5">
      <View className="gap-2">
        <Text className="text-[28px] font-extrabold text-dracula-fg">{t("transfer.title")}</Text>
        <Text className="text-base leading-6 text-dracula-muted">Cole a chave Simple Bank de quem vai receber.</Text>
      </View>
      <Controller
        control={control}
        name="paymentKey"
        render={({ field, fieldState }) => (
          <Field
            label={t("transfer.key")}
            value={field.value}
            onChangeText={field.onChange}
            placeholder={t("transfer.keyPlaceholder")}
            error={fieldState.error?.message}
            returnKeyType="done"
            onSubmitEditing={submit}
          />
        )}
      />
      <View className="rounded-2xl border border-dracula-card bg-dracula-surface px-4 py-3">
        <Text className="text-[13px] leading-5 text-dracula-muted">
          A chave e um codigo unico de recebimento. Voce pode copiar uma chave na tela Chaves.
        </Text>
      </View>
      {apiError ? <StateView state="error" message={apiError} /> : null}
      <View className="gap-2">
        <PrimaryButton title={t("transfer.resolve")} onPress={submit} loading={loading} disabled={loading} className="mt-1 bg-dracula-purple" />
        {onScanQr ? (
          <TextButton
            title="Escanear QR para pagar"
            onPress={onScanQr}
            className="bg-dracula-surface"
            textClassName="text-dracula-cyan"
          />
        ) : null}
      </View>
    </View>
  );
}
