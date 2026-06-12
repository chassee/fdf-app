import { createContext, useContext, useEffect, useState } from "react";

export type ThemeId = "blue" | "purple" | "neon-green" | "orange" | "pink" | "dark";

export interface ThemeOption {
  id: ThemeId;
  label: string;
  emoji: string;
  primary: string;
  bg: string;
}

export const THEMES: ThemeOption[] = [
  { id: "blue",       label: "Ocean",  emoji: "🌊", primary: "#5b8cff", bg: "#e8efff" },
  { id: "purple",     label: "Galaxy", emoji: "🔮", primary: "#9333ea", bg: "#f3e8ff" },
  { id: "neon-green", label: "Forest", emoji: "🌿", primary: "#16a34a", bg: "#dcfce7" },
  { id: "orange",     label: "Blaze",  emoji: "🔥", primary: "#ea580c", bg: "#ffedd5" },
  { id: "pink",       label: "Sakura", emoji: "🌸", primary: "#db2777", bg: "#fce7f3" },
  { id: "dark",       label: "Night",  emoji: "🌙", primary: "#818cf8", bg: "#1a1a2e" },
];

interface ThemeContextValue {
  theme: ThemeId;
  setTheme: (id: ThemeId) => void;
  themeOption: ThemeOption;
  // Legacy compat
  toggleTheme?: () => void;
  switchable: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "blue",
  setTheme: () => {},
  themeOption: THEMES[0],
  switchable: true,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(() => {
    try {
      const saved = localStorage.getItem("fdf-theme");
      if (saved && THEMES.find(t => t.id === saved)) return saved as ThemeId;
    } catch {}
    return "blue";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    // Remove old dark class if present
    document.documentElement.classList.remove("dark");
    if (theme === "dark") document.documentElement.classList.add("dark");
    try { localStorage.setItem("fdf-theme", theme); } catch {}
  }, [theme]);

  function setTheme(id: ThemeId) {
    setThemeState(id);
  }

  const themeOption = THEMES.find(t => t.id === theme) ?? THEMES[0];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themeOption, switchable: true }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
