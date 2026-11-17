"use client";

import { Moon, Sun } from "lucide-react";
import { setTheme, useTheme } from "@/lib/theme";

export function ThemeToggle() {
  const theme = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  const label = theme === "dark" ? "Modo claro" : "Modo noturno";

  return (
    <button type="button" className="btn-ghost" onClick={() => setTheme(next)} title={label} aria-label={label}>
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      <span className="theme-label">{label}</span>
    </button>
  );
}
