// The list filter lives in the URL hash (#/, #/active, #/completed), the way every TodoMVC keeps it, so a
// filter survives a reload and the back button. useHashFilter re-renders its caller on every hashchange.
import { useSyncExternalStore } from "react";

export type Filter = "all" | "active" | "completed";

function readFilter(): Filter {
  const hash = window.location.hash.replace("#/", "");
  return hash === "active" || hash === "completed" ? hash : "all";
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

export function useHashFilter(): Filter {
  return useSyncExternalStore(subscribe, readFilter);
}
