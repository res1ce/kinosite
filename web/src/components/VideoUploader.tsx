"use client";
import React, { useState, useEffect } from "react";

type ColorVariant = "blue" | "purple" | "indigo" | "teal";

const colorSchemes = {
  blue: {
    button: "from-blue-500 to-cyan-500",
    bg: "from-blue-50/50 to-cyan-50/50 dark:from-blue-900/20 dark:to-cyan-900/20",
    text: "text-blue-600 dark:text-blue-400",
    accent: "border-blue-500"
  },
  purple: {
    button: "from-purple-500 to-pink-500",
    bg: "from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20",
    text: "text-purple-600 dark:text-purple-400",
    accent: "border-purple-500"
  },
  indigo: {
    button: "from-indigo-500 to-purple-500",
    bg: "from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/20",
    text: "text-indigo-600 dark:text-indigo-400",
    accent: "border-indigo-500"
  },
  teal: {
    button: "from-teal-500 to-emerald-500",
    bg: "from-teal-50/50 to-emerald-50/50 dark:from-teal-900/20 dark:to-emerald-900/20",
    text: "text-teal-600 dark:text-teal-400",
    accent: "border-teal-500"
  }
};

export default function VideoUploader({ 
  name, 
  initialUrl = "",
  variant = "indigo" 
}: { 
  name: string; 
  initialUrl?: string;
  variant?: ColorVariant;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [url, setUrl] = useState<string>(initialUrl);
  const colors = colorSchemes[variant];
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUrl(initialUrl);
    const hidden = document.querySelector<HTMLInputElement>(`input[name='${name}']`);
    if (hidden) hidden.value = initialUrl;
  }, [initialUrl, name]);

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

  const handleRemove = () => {
    setUrl("");
    const hidden = document.querySelector<HTMLInputElement>(`input[name='${name}']`);
    if (hidden) hidden.value = "";
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFileName = (url: string) => {
    return url.split('/').pop() || url;
  };

  return (
    <div className="space-y-4">
      <input type="hidden" name={name} />
      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          onChange={onChange}
          accept="video/mp4,video/webm,video/ogg,video/quicktime"
          disabled={isUploading}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className={`w-full px-6 py-4 rounded-xl border-2 border-dashed transition-all duration-200 bg-gradient-to-r ${colors.button} text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <div className="flex items-center justify-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>{url ? 'Изменить видео' : 'Выбрать видео файл'}</span>
          </div>
        </button>
        {isUploading && (
          <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 border-2 border-t-transparent rounded-full animate-spin ${colors.accent} border-opacity-30`}></div>
              <span className={`text-sm font-medium ${colors.text}`}>Загружаем видео...</span>
            </div>
          </div>
        )}
      </div>
      
      {url && (
        <div className={`bg-gradient-to-r ${colors.bg} border ${colors.accent} rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-200`}>
          <div className="flex items-start gap-4">
            {/* Video Preview */}
            <div className="flex-shrink-0">
              <div className="w-32 h-20 rounded-lg overflow-hidden bg-gray-900 shadow-lg">
                <video 
                  src={url} 
                  className="w-full h-full object-cover"
                  muted
                />
              </div>
            </div>
            
            {/* Video Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${colors.text} truncate mb-1`}>
                    {getFileName(url)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Видео успешно загружено
                  </p>
                </div>
                
                <button
                  type="button"
                  onClick={handleRemove}
                  className="flex-shrink-0 p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors group"
                  title="Удалить видео"
                >
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              
              {/* Video Controls Preview */}
              <div className="mt-2">
                <a 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1 text-xs ${colors.text} hover:underline`}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Просмотреть в новой вкладке
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Поддерживаемые форматы: MP4, WebM, OGG, MOV. Рекомендуемый размер: до 100MB
      </div>
    </div>
  );
}

