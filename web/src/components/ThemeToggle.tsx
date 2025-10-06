'use client';

import { Moon, Sun } from "lucide-react";
import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "./ThemeProvider";

interface ThemeToggleProps {
  variant?: 'desktop' | 'mobile' | 'admin';
  showLabel?: boolean;
}

export default function ThemeToggle({ variant = 'desktop', showLabel = false }: ThemeToggleProps) {
  const context = useContext(ThemeContext);
  const [localTheme, setLocalTheme] = useState<'light' | 'dark'>('light');
  
  // Initialize local theme if context is not available
  useEffect(() => {
    if (!context) {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
      setLocalTheme(initialTheme);
      // Set both data-theme attribute and dark class for Tailwind v4
      document.documentElement.setAttribute('data-theme', initialTheme);
      if (initialTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [context]);
  
  const theme = context?.theme || localTheme;
  const toggleTheme = context?.toggleTheme || (() => {
    const newTheme = localTheme === 'light' ? 'dark' : 'light';
    setLocalTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    // Set both data-theme attribute and dark class for Tailwind v4
    document.documentElement.setAttribute('data-theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  });

  const baseClasses = "transition-all duration-300";
  
  const variantClasses = {
    desktop: "p-2.5 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 hover:bg-purple-500/20 group",
    mobile: "p-2 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 hover:bg-purple-500/20",
    admin: "group relative px-4 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/20",
  };

  const iconClasses = {
    desktop: "group-hover:rotate-12 transition-transform duration-300",
    mobile: "",
    admin: "opacity-60 group-hover:opacity-100 transition-opacity",
  };

  return (
    <button
      onClick={toggleTheme}
      className={`${baseClasses} ${variantClasses[variant]}`}
      aria-label="Переключить тему"
    >
      <div className="flex items-center gap-2">
        {theme === 'light' ? (
          <>
            <Moon size={variant === 'admin' ? 16 : 20} className={`text-purple-600 ${iconClasses[variant]}`} />
            {showLabel && <span>Тема</span>}
          </>
        ) : (
          <>
            <Sun size={variant === 'admin' ? 16 : 20} className={`text-yellow-400 ${iconClasses[variant]}`} />
            {showLabel && <span>Тема</span>}
          </>
        )}
      </div>
    </button>
  );
}

