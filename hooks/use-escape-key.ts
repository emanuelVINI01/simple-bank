"use client";

import { useEffect } from "react";

/**
 * Custom hook to handle Escape key presses, enabling closing or navigating back in modals.
 * @param onEscape Callback to trigger when the Escape key is pressed.
 * @param enabled Whether the key listener is active (defaults to true).
 */
export function useEscapeKey(onEscape: () => void, enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onEscape();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onEscape, enabled]);
}
