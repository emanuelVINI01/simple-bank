import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("Escape key handling logic", () => {
  let listeners: Record<string, ((e: KeyboardEvent) => void)[]> = {};

  beforeEach(() => {
    listeners = {};
    (globalThis as unknown as { window: unknown }).window = {
      addEventListener: (event: string, handler: (e: KeyboardEvent) => void) => {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(handler);
      },
      removeEventListener: (event: string, handler: (e: KeyboardEvent) => void) => {
        if (listeners[event]) {
          listeners[event] = listeners[event].filter((h) => h !== handler);
        }
      },
    };
  });

  afterEach(() => {
    delete (globalThis as unknown as { window?: unknown }).window;
  });

  it("handles Escape key press correctly", () => {
    const onEscape = vi.fn();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onEscape();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    const preventDefault = vi.fn();
    const escapeEvent = { key: "Escape", preventDefault } as unknown as KeyboardEvent;
    listeners["keydown"]?.forEach((handler) => handler(escapeEvent));

    expect(preventDefault).toHaveBeenCalled();
    expect(onEscape).toHaveBeenCalledTimes(1);
  });

  it("ignores non-Escape keys", () => {
    const onEscape = vi.fn();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onEscape();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    const preventDefault = vi.fn();
    const enterEvent = { key: "Enter", preventDefault } as unknown as KeyboardEvent;
    listeners["keydown"]?.forEach((handler) => handler(enterEvent));

    expect(preventDefault).not.toHaveBeenCalled();
    expect(onEscape).not.toHaveBeenCalled();
  });
});
