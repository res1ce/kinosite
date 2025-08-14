"use client";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState<boolean>(() => typeof document !== "undefined" && document.documentElement.dataset.theme === "dark");

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.dataset.theme = dark ? "dark" : "";
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setDark(saved === "dark");
  }, []);

  return (
    <button onClick={() => setDark((v) => !v)} className="p-2 rounded border border-black/10 hover:bg-black/5 transition-colors" aria-label="Переключить тему">
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}


