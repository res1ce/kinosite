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
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300">
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); onSearch?.(e.target.value); }}
            placeholder="Поиск..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900/50 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
          />
        </div>
        {right && (
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            {right}
          </div>
        )}
      </div>
    </div>
  );
}