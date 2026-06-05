import { useEffect, useState } from "react";
import { getSecureItem, setSecureItem } from "@/lib/storage";

const NOTIFICATIONS_ENABLED_KEY = "simple-bank.preferences.notifications-enabled";
let currentPreference = true;
const listeners = new Set<(value: boolean) => void>();

export function useNotificationPreference() {
  const [enabled, setEnabledState] = useState(currentPreference);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadPreference() {
      const stored = await getSecureItem(NOTIFICATIONS_ENABLED_KEY);
      if (!active) return;

      currentPreference = stored == null ? true : stored === "true";
      setEnabledState(currentPreference);
      setReady(true);
    }

    void loadPreference();

    return () => {
      active = false;
    };
  }, []);

  async function setEnabled(value: boolean) {
    currentPreference = value;
    setEnabledState(value);
    listeners.forEach((listener) => listener(value));
    await setSecureItem(NOTIFICATIONS_ENABLED_KEY, String(value));
  }

  useEffect(() => {
    listeners.add(setEnabledState);
    return () => {
      listeners.delete(setEnabledState);
    };
  }, []);

  return {
    enabled,
    ready,
    setEnabled,
  };
}
