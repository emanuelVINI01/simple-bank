import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function useRefreshApp(onRefresh?: () => Promise<void> | void) {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      if (onRefresh) {
        await onRefresh();
        return;
      }

      await queryClient.invalidateQueries();
      await queryClient.refetchQueries({ type: "active" });
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh, queryClient]);

  return { refresh, refreshing };
}
