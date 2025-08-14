"use client";
import { useEffect, useState } from "react";

export default function AccessibilityToggle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("a11y-high-contrast") === "1";
    setEnabled(saved);
    document.documentElement.classList.toggle("a11y", saved);
  }, []);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    localStorage.setItem("a11y-high-contrast", next ? "1" : "0");
    document.documentElement.classList.toggle("a11y", next);
  };

  return (
    <button onClick={toggle} className="fixed bottom-4 right-4 z-50 px-4 py-2 rounded bg-black text-white shadow focus-visible:outline-dashed" aria-pressed={enabled} aria-label="Версия для слабовидящих">
      A11y
    </button>
  );
}


