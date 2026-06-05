import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Text, View } from "react-native";
import { paymentSchema, type PaymentForm, type ParsedPaymentForm } from "@/validation/transfer";
import { formatMoney } from "@/lib/format";
import { MoneyInput } from "@/components/ui/MoneyInput";
import { Field } from "@/components/ui/Field";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { TextButton } from "@/components/ui/TextButton";

type PaymentAmountFormProps = {
  balance?: number;
  initialAmount?: string;
  initialDescription?: string;
  onSubmit: (data: ParsedPaymentForm) => void;
  onBack: () => void;
};

export function PaymentAmountForm({ balance, initialAmount = "", initialDescription = "", onSubmit, onBack }: PaymentAmountFormProps) {
  const { control, handleSubmit, reset } = useForm<PaymentForm, unknown, ParsedPaymentForm>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { amount: initialAmount, description: initialDescription },
  });

  const submit = handleSubmit(onSubmit);

  useEffect(() => {
    reset({ amount: initialAmount, description: initialDescription });
  }, [initialAmount, initialDescription, reset]);

  return (
    <View className="gap-6 p-5">
      <View className="rounded-2xl bg-dracula-surface p-4">
        <Text className="text-[13px] text-dracula-muted">Saldo disponivel</Text>
        <Text className="mt-1 text-2xl font-extrabold text-dracula-green">{formatMoney(balance)}</Text>
      </View>
      <Controller
        control={control}
        name="amount"
        render={({ field, fieldState }) => (
          <MoneyInput
            label="Quanto voce quer transferir?"
            value={field.value}
            onChangeText={field.onChange}
            error={fieldState.error?.message}
            returnKeyType="next"
          />
        )}
      />
      <Controller
        control={control}
        name="description"
        render={({ field, fieldState }) => (
          <Field
            label="Descricao (opcional)"
            value={field.value ?? ""}
            onChangeText={field.onChange}
            placeholder="Ex: aluguel, reembolso..."
            error={fieldState.error?.message}
            returnKeyType="done"
            onSubmitEditing={submit}
          />
        )}
      />
      <View className="gap-2">
        <PrimaryButton title="Revisar transferencia" onPress={submit} className="bg-dracula-purple" />
        <TextButton title="Voltar para chave" onPress={onBack} textClassName="text-center" />
      </View>
    </View>
  );
}
