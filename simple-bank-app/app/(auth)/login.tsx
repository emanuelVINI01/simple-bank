import { useEffect } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/use-auth";
import { loginSchema, type LoginForm } from "@/validation/auth";
import { AuthShell } from "@/components/auth/AuthShell";
import { Field } from "@/components/ui/Field";
import { PasswordField } from "@/components/ui/PasswordField";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { TextButton } from "@/components/ui/TextButton";

export default function LoginScreen() {
  const router = useRouter();
  const auth = useAuth();

  const { control, handleSubmit } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (auth.isAuthenticated) router.replace("/(tabs)/home");
  }, [auth.isAuthenticated, router]);

  const submit = handleSubmit(async (data) => {
    try {
      await auth.login(data);
      router.replace("/(tabs)/home");
    } catch {
      // error displayed via auth.loginError
    }
  });

  return (
    <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView
        contentContainerClassName="grow justify-center px-5 py-8"
        keyboardShouldPersistTaps="handled"
        className="bg-dracula-surface-deep"
      >
        <AuthShell
          eyebrow="Banco digital"
          title="Simple Bank"
          subtitle="Acesse sua conta para transferir, acompanhar o extrato e guardar seus comprovantes em um só lugar."
        >
          <View className="gap-1">
            <Text className="text-xl font-extrabold text-dracula-fg">Entrar na conta</Text>
            <Text className="text-sm leading-5 text-dracula-muted">Use seu email cadastrado para continuar.</Text>
          </View>

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

          {auth.loginError ? (
            <Text className="text-center text-[13px] text-dracula-red">
              {auth.loginError instanceof Error ? auth.loginError.message : "Email ou senha invalidos."}
            </Text>
          ) : null}

          <PrimaryButton
            title="Acessar minha conta"
            onPress={submit}
            loading={auth.loginPending}
            disabled={auth.loginPending}
            className="mt-1 bg-dracula-purple"
          />
          <View className="items-center rounded-2xl bg-dracula-surface-deep px-3 py-4">
            <Text className="text-center text-sm text-dracula-muted">Ainda nao tem conta?</Text>
            <TextButton title="Criar conta gratis" onPress={() => router.push("/(auth)/register")} textClassName="text-dracula-cyan" />
          </View>
        </AuthShell>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
