import { create } from "zustand";

type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

function getSystemTheme(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const resolved = theme === "system" ? getSystemTheme() : theme;
  root.classList.remove("light", "dark");
  root.classList.add(resolved);
}

export const useThemeStore = create<ThemeState>()((set) => {
  // Initialize from localStorage
  const stored = localStorage.getItem("healthcare-theme") as Theme | null;
  const initial = stored || "light";
  applyTheme(initial);

  return {
    theme: initial,
    setTheme: (theme) => {
      localStorage.setItem("healthcare-theme", theme);
      applyTheme(theme);
      set({ theme });
    },
  };
});
