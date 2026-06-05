import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/use-auth";
import { registerSchema, type RegisterForm } from "@/validation/auth";
import { formatTaxId } from "@/lib/mask";
import { AuthShell } from "@/components/auth/AuthShell";
import { Field } from "@/components/ui/Field";
import { PasswordField } from "@/components/ui/PasswordField";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { TextButton } from "@/components/ui/TextButton";

export default function RegisterScreen() {
  const router = useRouter();
  const auth = useAuth();

  const { control, handleSubmit } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", taxId: "", password: "" },
  });

  const submit = handleSubmit(async (data) => {
    try {
      await auth.register(data);
      router.replace("/(tabs)/home");
    } catch {
      // error displayed via auth.registerError
    }
  });

  return (
    <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView
        contentContainerClassName="grow px-5 py-8"
        keyboardShouldPersistTaps="handled"
        className="bg-dracula-surface-deep"
      >
        <AuthShell
          eyebrow="Comece agora"
          title="Abra sua conta Simple Bank"
          subtitle="Crie uma conta digital de teste para receber chaves, fazer transferencias e gerar comprovantes."
        >
          <View className="gap-1">
            <Text className="text-xl font-extrabold text-dracula-fg">Dados da conta</Text>
            <Text className="text-sm leading-5 text-dracula-muted">Leva menos de um minuto. Seus dados ficam protegidos no app.</Text>
          </View>

          <Controller
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <Field
                label="Nome completo"
                value={field.value}
                onChangeText={field.onChange}
                placeholder="Maria Silva"
                autoCapitalize="words"
                error={fieldState.error?.message}
                returnKeyType="next"
              />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field, fieldState }) => (
              <Field
                label="Email"
                value={field.value}
                onChangeText={field.onChange}
                placeholder="seu@email.com"
                keyboardType="email-address"
                error={fieldState.error?.message}
                returnKeyType="next"
              />
            )}
          />
          <Controller
            control={control}
            name="taxId"
            render={({ field, fieldState }) => (
              <Field
                label="Documento"
                value={formatTaxId(field.value)}
                onChangeText={(value) => field.onChange(formatTaxId(value))}
                placeholder="12.345-678"
                keyboardType="number-pad"
                error={fieldState.error?.message}
                returnKeyType="next"
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field, fieldState }) => (
              <PasswordField
                label="Senha"
                value={field.value}
                onChangeText={field.onChange}
                placeholder="••••••••"
                error={fieldState.error?.message}
                returnKeyType="done"
                onSubmitEditing={submit}
              />
            )}
          />

          {auth.registerError ? (
            <Text className="text-center text-[13px] text-dracula-red">
              {auth.registerError instanceof Error ? auth.registerError.message : "Erro ao criar conta."}
            </Text>
          ) : null}

          <PrimaryButton
            title="Criar minha conta"
            onPress={submit}
            loading={auth.registerPending}
            disabled={auth.registerPending}
            className="mt-1 bg-dracula-purple"
          />
          <View className="items-center rounded-2xl bg-dracula-surface-deep px-3 py-4">
            <Text className="text-center text-sm text-dracula-muted">Ja tem uma conta?</Text>
            <TextButton title="Entrar no Simple Bank" onPress={() => router.back()} textClassName="text-dracula-cyan" />
          </View>
        </AuthShell>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
