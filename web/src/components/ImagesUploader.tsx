"use client";
import React, { useState, useEffect } from "react";
import { ImagePlus, Loader } from "lucide-react";

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

export default function ImagesUploader({ 
  initialUrls = [],
  variant = "teal" 
}: { 
  initialUrls?: string[];
  variant?: ColorVariant;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [urls, setUrls] = useState<string[]>(initialUrls);
  const colors = colorSchemes[variant];
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUrls(initialUrls);
  }, [initialUrls]);

  useEffect(() => {
    const hidden = document.querySelector<HTMLInputElement>("input[name='galleryUrls']");
    if (hidden) hidden.value = JSON.stringify(urls);
  }, [urls]);

  const upload = async (files: File[]) => {
    setIsUploading(true);
    try {
      const form = new FormData();
      files.forEach((f) => form.append("files", f));
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (data.urls) {
        setUrls(prevUrls => [...prevUrls, ...data.urls]);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      await upload(files);
    }
  };

  const removeImage = (urlToRemove: string) => {
    setUrls(prevUrls => prevUrls.filter(url => url !== urlToRemove));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative group">
        <input
          ref={fileInputRef}
          type="file"
          multiple
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Выбрать изображения</span>
          </div>
        </button>
        {isUploading && (
          <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 border-2 border-t-transparent rounded-full animate-spin ${colors.accent} border-opacity-30`}></div>
              <span className={`text-sm font-medium ${colors.text}`}>Загружаем изображения...</span>
            </div>
          </div>
        )}
      </div>
      
      {urls.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-8 h-8 rounded-lg ${colors.accent} flex items-center justify-center`}>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Загруженные изображения ({urls.length})
            </h3>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {urls.map((url, index) => (
              <div key={url} className="group relative aspect-square">
                <img 
                  src={url} 
                  alt={`Изображение ${index + 1}`} 
                  className="w-full h-full object-cover rounded-xl border border-gray-200 dark:border-gray-600 group-hover:scale-105 transition-transform duration-200" 
                />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 hover:scale-110"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <input type="hidden" name="galleryUrls" />
    </div>
  );
}