"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ApiError, type ApiUser } from "@/lib/api-types";
import { fetchCurrentUser } from "@/lib/services/banking-api";

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const session = useSession();
  const isAuthenticated = session.status === "authenticated";

  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: fetchCurrentUser,
    enabled: isAuthenticated,
  });

  const loginMutation = useMutation({
    mutationFn: async (input: { email: string; password: string }) => {
      const result = await signIn("credentials", {
        email: input.email,
        password: input.password,
        redirect: false,
      });

      if (!result || result.error) {
        throw new ApiError("Invalid email or password.", 401);
      }

      return fetchCurrentUser();
    },
    onSuccess: (user: ApiUser) => {
      queryClient.setQueryData(["me"], user);
    },
  });

  const logout = async () => {
    await signOut({ redirect: false });
    queryClient.clear();
    router.replace("/login");
  };

  return {
    isAuthenticated,
    isRestoringToken: session.status === "loading",
    isLoadingUser: session.status === "loading" || meQuery.isLoading,
    login: loginMutation.mutateAsync,
    loginError: loginMutation.error,
    loginPending: loginMutation.isPending,
    logout,
    token: isAuthenticated ? "authjs-jwt-session" : null,
    user: (meQuery.data ?? session.data?.user) as ApiUser | undefined,
  };
}

export function useRequireAuth() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth.isAuthenticated && !auth.isRestoringToken) {
      router.replace("/login");
    }
  }, [auth.isAuthenticated, auth.isRestoringToken, router]);

  return auth;
}
