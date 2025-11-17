//SingleImageUploader.tsx
"use client";
import React, { useState, useEffect } from "react";

type ColorVariant = "blue" | "teal" | "amber" | "purple";

const colorSchemes = {
  blue: {
    button: "from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-600",
    accent: "bg-blue-500",
    ring: "focus:ring-blue-500/20 focus:border-blue-500",
    text: "text-blue-600"
  },
  teal: {
    button: "from-teal-500 to-emerald-500 hover:from-emerald-500 hover:to-teal-600", 
    accent: "bg-teal-500",
    ring: "focus:ring-teal-500/20 focus:border-teal-500",
    text: "text-teal-600"
  },
  amber: {
    button: "from-amber-500 to-orange-500 hover:from-orange-500 hover:to-amber-600",
    accent: "bg-amber-500", 
    ring: "focus:ring-amber-500/20 focus:border-amber-500",
    text: "text-amber-600"
  },
  purple: {
    button: "from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-600",
    accent: "bg-purple-500",
    ring: "focus:ring-purple-500/20 focus:border-purple-500", 
    text: "text-purple-600"
  }
};

export default function SingleImageUploader({ 
  name, 
  initialUrl = "",
  variant = "blue",
  value,
  onChange: onChangeCallback
}: { 
  name: string; 
  initialUrl?: string;
  variant?: ColorVariant;
  value?: string;
  onChange?: (url: string) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [url, setUrl] = useState<string>(value ?? initialUrl);
  const colors = colorSchemes[variant];
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Controlled component: sync with external value prop
  useEffect(() => {
    if (value !== undefined) {
      setUrl(value);
    }
  }, [value]);

  // Uncontrolled component: sync with initialUrl
  useEffect(() => {
    if (value === undefined) {
      setUrl(initialUrl);
      const hidden = document.querySelector<HTMLInputElement>(`input[name='${name}']`);
      if (hidden) hidden.value = initialUrl;
    }
  }, [initialUrl, name, value]);

  const upload = async (file: File) => {
    setIsUploading(true);
    try {
      const form = new FormData();
      form.append("files", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (data.urls?.[0]) {
        const newUrl = data.urls[0];
        
        // If controlled, notify parent
        if (onChangeCallback) {
          onChangeCallback(newUrl);
        } else {
          // If uncontrolled, update internal state
          setUrl(newUrl);
          const hidden = document.querySelector<HTMLInputElement>(`input[name='${name}']`);
          if (hidden) hidden.value = newUrl;
        }
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

  const handleRemove = () => {
    if (onChangeCallback) {
      onChangeCallback("");
    } else {
      setUrl("");
      const hidden = document.querySelector<HTMLInputElement>(`input[name='${name}']`);
      if (hidden) hidden.value = "";
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative group">
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          onChange={onChange}
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Выберите изображение</span>
          </div>
        </button>
        {isUploading && (
          <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 border-2 border-t-transparent rounded-full animate-spin ${colors.accent} border-opacity-30`}></div>
              <span className={`text-sm font-medium ${colors.text}`}>Загружаем...</span>
            </div>
          </div>
        )}
      </div>
      
      {url && (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-6 h-6 rounded-lg ${colors.accent} flex items-center justify-center`}>
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Изображение загружено</span>
          </div>
          
          <div className="relative group inline-block">
            <div 
              className="h-24 w-24 bg-cover bg-center rounded-xl border-2 border-gray-200 dark:border-gray-600 group-hover:scale-105 transition-transform duration-200"
              style={{ backgroundImage: `url(${url})` }}
            />
            <button 
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 hover:scale-110"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      <input type="hidden" name={name} defaultValue={url} />
    </div>
  );
}