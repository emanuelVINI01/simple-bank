import { useQuery } from "@tanstack/react-query";
import { fetchWalletProfile } from "@/api/banking";
import { queryKeys } from "@/hooks/query-keys";

export function useWallet(enabled = true) {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: fetchWalletProfile,
    enabled,
  });
}

