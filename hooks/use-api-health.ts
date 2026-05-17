"use client";

import { useCallback, useEffect, useState } from "react";
import { probeApiHealth } from "@/lib/services/health-api";

type HealthState = "checking" | "connecting" | "ready" | "error";

const statusCopy = ["Checking local API", "Loading Auth.js session", "Connecting to ledger routes", "Ready"];

export function useApiHealth(enabled = true) {
  const [status, setStatus] = useState<HealthState>("checking");
  const [attempt, setAttempt] = useState(0);
  const [message, setMessage] = useState(statusCopy[0]);

  const check = useCallback(async () => {
    if (!enabled) return;

    setStatus((current) => current === "ready" ? "checking" : current);
    for (let nextAttempt = 1; nextAttempt <= 8; nextAttempt += 1) {
      setAttempt(nextAttempt);
      setMessage(statusCopy[Math.min(nextAttempt - 1, statusCopy.length - 2)]);
      setStatus(nextAttempt > 1 ? "connecting" : "checking");

      try {
        if (await probeApiHealth()) {
          setStatus("ready");
          setMessage("Ready");
          return;
        }
      } catch {
        await new Promise((resolve) => window.setTimeout(resolve, nextAttempt < 3 ? 2500 : 4500));
      }
    }

    setStatus("error");
    setMessage("Local API did not respond");
  }, [enabled]);

  useEffect(() => {
    const timer = window.setTimeout(() => void check(), 0);
    return () => window.clearTimeout(timer);
  }, [check]);

  return {
    attempt,
    check,
    isReady: status === "ready",
    message,
    status,
  };
}
