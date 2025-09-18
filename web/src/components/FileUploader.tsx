"use client";
import React, { useState } from "react";

type ColorVariant = "blue" | "teal" | "amber" | "purple";

const colorSchemes = {
  blue: {
    button: "from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-600",
    accent: "bg-blue-500",
    ring: "focus:ring-blue-500/20 focus:border-blue-500",
    text: "text-blue-600",
    bg: "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
    border: "border-blue-200 dark:border-blue-800"
  },
  teal: {
    button: "from-teal-500 to-emerald-500 hover:from-emerald-500 hover:to-teal-600", 
    accent: "bg-teal-500",
    ring: "focus:ring-teal-500/20 focus:border-teal-500",
    text: "text-teal-600",
    bg: "from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20",
    border: "border-teal-200 dark:border-teal-800"
  },
  amber: {
    button: "from-amber-500 to-orange-500 hover:from-orange-500 hover:to-amber-600",
    accent: "bg-amber-500", 
    ring: "focus:ring-amber-500/20 focus:border-amber-500",
    text: "text-amber-600",
    bg: "from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20",
    border: "border-amber-200 dark:border-amber-800"
  },
  purple: {
    button: "from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-600",
    accent: "bg-purple-500",
    ring: "focus:ring-purple-500/20 focus:border-purple-500", 
    text: "text-purple-600",
    bg: "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20",
    border: "border-purple-200 dark:border-purple-800"
  }
};

export default function FileUploader({ 
  name, 
  accept,
  variant = "amber" 
}: { 
  name: string; 
  accept?: string;
  variant?: ColorVariant;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [url, setUrl] = useState<string>("");
  const colors = colorSchemes[variant];
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setIsUploading(true);
    try {
      const form = new FormData();
      form.append("files", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (data.urls?.[0]) {
        setUrl(data.urls[0]);
        const hidden = document.querySelector<HTMLInputElement>(`input[name='${name}']`);
        if (hidden) hidden.value = data.urls[0];
      }
    } finally {
      setIsUploading(false);
    }
  };

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await upload(file);
    }
  };

  const getFileIcon = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return "M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z";
      case 'doc':
      case 'docx': return "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z";
      default: return "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z";
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative group">
        <input
          ref={fileInputRef}
          type="file"
          onChange={onChange}
          accept={accept}
          disabled={isUploading}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className={`w-full px-6 py-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 bg-gradient-to-r ${colors.button} text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <div className="flex items-center justify-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span>Выбрать файл</span>
          </div>
        </button>
        {isUploading && (
          <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 border-2 border-t-transparent rounded-full animate-spin ${colors.accent} border-opacity-30`}></div>
              <span className={`text-sm font-medium ${colors.text}`}>Загружаем файл...</span>
            </div>
          </div>
        )}
      </div>
      
      {url && (
        <div className={`bg-gradient-to-r ${colors.bg} border ${colors.border} rounded-xl p-4`}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${colors.accent} flex items-center justify-center`}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getFileIcon(url)} />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Файл загружен</span>
                </div>
                <a 
                  href={url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className={`${colors.text} dark:text-${variant}-400 hover:underline font-medium text-sm`}
                >
                  Открыть файл
                </a>
              </div>
            </div>
            <button 
              type="button" 
              className="px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors text-sm font-medium" 
              onClick={() => {
                setUrl("");
                const hidden = document.querySelector<HTMLInputElement>(`input[name='${name}']`);
                if (hidden) hidden.value = "";
              }}
            >
              Удалить
            </button>
          </div>
        </div>
      )}
      <input type="hidden" name={name} defaultValue={url} />
    </div>
  );
}