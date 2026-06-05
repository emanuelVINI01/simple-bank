import { QueryClient } from "@tanstack/react-query";

export function createBankQueryClient() {
  return new QueryClient({
    defaultOptions: {
      mutations: {
        retry: false,
      },
      queries: {
        refetchOnReconnect: true,
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 15000,
      },
    },
  });
}

