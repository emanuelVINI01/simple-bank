import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/use-auth";
import { useCreditNotifications } from "@/hooks/use-credit-notifications";

type AuthenticatedShellProps = {
  children: React.ReactNode;
  notificationsEnabled: boolean;
};

export function AuthenticatedShell({ children, notificationsEnabled }: AuthenticatedShellProps) {
  const auth = useAuth();
  const router = useRouter();

  useCreditNotifications({
    enabled: notificationsEnabled && Boolean(auth.user),
    user: auth.user,
    onOpenTransaction: (transactionId: string) => router.push(`/transaction/${transactionId}`),
  });

  useEffect(() => {
    if (!auth.isLoadingUser && !auth.isAuthenticated) {
      router.replace("/(auth)/login");
    }
  }, [auth.isAuthenticated, auth.isLoadingUser, router]);

  return <>{children}</>;
}
