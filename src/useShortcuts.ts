// Single-key keyboard shortcuts. useShortcuts binds KeyboardEvent.key values to handlers while enabled,
// and ignores a press made with a modifier held or typed into a text field, so "n" in the new-task box
// is just the letter n; checkboxes and buttons do not count as text fields. Handlers are read through a
// ref, so a caller passing a fresh object every render keeps one window listener.
import { useEffect, useRef } from "react";

const NON_TEXT_INPUTS = ["checkbox", "radio", "button", "submit", "reset"];

function typingInField(target: EventTarget | null): boolean {
  if (target instanceof HTMLInputElement) return !NON_TEXT_INPUTS.includes(target.type);
  return target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement;
}

export function useShortcuts(bindings: Record<string, () => void>, enabled = true): void {
  const latest = useRef(bindings);

  useEffect(() => {
    latest.current = bindings;
  });

  useEffect(() => {
    if (!enabled) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey || typingInField(event.target)) return;
      const handler = latest.current[event.key];
      if (!handler) return;
      event.preventDefault();
      handler();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enabled]);
}
