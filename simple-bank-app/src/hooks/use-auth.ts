import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCurrentUser, loginRequest, logoutRequest, registerAndLoginRequest } from "@/api/auth";
import type { ApiUser, LoginInput, RegisterInput } from "@/api/types";
import { hasSessionCookie } from "@/lib/cookies";
import { queryKeys } from "@/hooks/query-keys";

export function useAuth() {
  const queryClient = useQueryClient();

  const userQuery = useQuery({
    queryKey: queryKeys.me,
    queryFn: fetchCurrentUser,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: (input: LoginInput) => loginRequest(input),
    onSuccess: (user: ApiUser) => {
      queryClient.setQueryData(queryKeys.me, user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (input: RegisterInput) => registerAndLoginRequest(input),
    onSuccess: (user: ApiUser) => {
      queryClient.setQueryData(queryKeys.me, user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => {
      queryClient.clear();
    },
  });

  return {
    isAuthenticated: Boolean(userQuery.data),
    isLoadingUser: userQuery.isLoading,
    login: loginMutation.mutateAsync,
    loginError: loginMutation.error,
    loginPending: loginMutation.isPending,
    logout: logoutMutation.mutateAsync,
    logoutError: logoutMutation.error,
    logoutPending: logoutMutation.isPending,
    refreshUser: userQuery.refetch,
    register: registerMutation.mutateAsync,
    registerError: registerMutation.error,
    registerPending: registerMutation.isPending,
    user: userQuery.data,
    userError: userQuery.error,
  };
}

export async function hasStoredAuthSession() {
  return hasSessionCookie();
}

