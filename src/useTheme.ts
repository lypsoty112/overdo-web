// The colour theme. An inline script in index.html picks the first theme before the stylesheet applies
// (a saved choice, else the OS preference) and writes it to <html data-theme>, so a dark page never
// flashes light. useTheme starts from that attribute, and toggleTheme flips it and saves the choice in
// localStorage under the same key the script reads.
import { useState } from "react";

type Theme = "light" | "dark";

export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.dataset.theme === "dark" ? "dark" : "light",
  );

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("overdo:theme", next);
    setTheme(next);
  };

  return [theme, toggleTheme];
}
