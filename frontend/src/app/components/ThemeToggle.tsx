"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("passage-theme") as "light" | "dark" | null;
    if (stored === "dark" || stored === "light") {
      setTheme(stored);
      applyTheme(stored);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initial = prefersDark ? "dark" : "light";
      setTheme(initial);
      applyTheme(initial);
    }
  }, []);

  const applyTheme = (newTheme: "light" | "dark") => {
    const root = document.documentElement;
    if (newTheme === "dark") {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
    } else {
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("passage-theme", nextTheme);
    applyTheme(nextTheme);
  };

  if (!mounted) {
    return (
      <div className={`w-9 h-9 rounded-xl bg-surface-container-low border border-outline-variant ${className}`} />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`p-2 rounded-xl bg-surface-container border border-outline-variant text-on-surface hover:text-primary hover:bg-surface-container-high transition-all flex items-center justify-center cursor-pointer shadow-xs ${className}`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <span className="material-symbols-outlined text-[18px]">
        {theme === "dark" ? "light_mode" : "dark_mode"}
      </span>
    </button>
  );
}
