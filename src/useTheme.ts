import { useCallback, useState } from "react";

export type Theme = "light" | "dark";

/** index.html sets the `dark` class before the first paint; read it from there. */
function readTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readTheme);

  const toggleTheme = useCallback(() => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage can be blocked. The theme still works until the page closes.
    }
    setTheme(next);
  }, [theme]);

  return { theme, toggleTheme };
}
