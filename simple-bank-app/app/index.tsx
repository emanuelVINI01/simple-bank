import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useRouter } from "expo-router";
import { useAuth, hasStoredAuthSession } from "@/hooks/use-auth";
import { colors } from "@/theme/colors";

export default function Index() {
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    async function check() {
      if (auth.isLoadingUser) return;

      if (auth.isAuthenticated) {
        router.replace("/(tabs)/home");
        return;
      }

      const hasCookie = await hasStoredAuthSession();
      if (!hasCookie) {
        router.replace("/(auth)/login");
      }
      // If has cookie but user query still pending, wait for next render
    }
    void check();
  }, [auth.isAuthenticated, auth.isLoadingUser, router]);

  return (
    <View className="flex-1 items-center justify-center bg-dracula-bg">
      <ActivityIndicator color={colors.purple} size="large" />
    </View>
  );
}
