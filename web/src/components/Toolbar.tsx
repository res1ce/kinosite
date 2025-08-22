// components/admin/Toolbar.tsx
"use client";
import { useState } from "react";
export default function Toolbar({
  onSearch, right,
}: {
  onSearch?: (q: string) => void;
  right?: React.ReactNode;
}) {
  const [q, setQ] = useState("");
  return (
    <div className="rounded-2xl border bg-white dark:bg-[#111] p-3 md:p-4 shadow-sm flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
      <div className="flex-1">
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); onSearch?.(e.target.value); }}
          placeholder="Поиск…"
          className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-[#6E0A6B]/60"
        />
      </div>
      <div className="flex items-center gap-2">{right}</div>
    </div>
  );
}
