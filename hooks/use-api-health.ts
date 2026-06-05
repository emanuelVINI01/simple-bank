"use client";

import { useCallback } from "react";

export function useApiHealth() {
  const check = useCallback(async () => {}, []);

  return {
    attempt: 0,
    check,
    isReady: true,
    message: "Ready",
    status: "ready" as const,
  };
}
