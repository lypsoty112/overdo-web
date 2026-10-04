// The list filter lives in the URL hash (#/, #/active, #/completed), the way every TodoMVC keeps it, so a
// filter survives a reload and the back button. #/board rides along as a fourth "filter" that swaps the
// list for the kanban board. useHashFilter re-renders its caller on every hashchange.
import { useSyncExternalStore } from "react";

const FILTERS = ["active", "completed", "board"] as const;

export type Filter = "all" | (typeof FILTERS)[number];

function readFilter(): Filter {
  const hash = window.location.hash.replace("#/", "");
  return FILTERS.find((filter) => filter === hash) ?? "all";
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

export function useHashFilter(): Filter {
  return useSyncExternalStore(subscribe, readFilter);
}
