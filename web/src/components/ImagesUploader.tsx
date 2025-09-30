"use client";
import React, { useState, useEffect, useCallback } from "react";
import { X, Upload, Image as ImageIcon, Grid3x3, List } from "lucide-react";

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

const MAX_IMAGES = 130;

export default function ImagesUploader({ 
  initialUrls = [],
  variant = "teal" 
}: { 
  initialUrls?: string[];
  variant?: ColorVariant;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [urls, setUrls] = useState<string[]>(initialUrls);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [uploadProgress, setUploadProgress] = useState(0);
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
    const remainingSlots = MAX_IMAGES - urls.length;
    const filesToUpload = files.slice(0, remainingSlots);
    
    if (filesToUpload.length === 0) {
      alert(`Достигнут лимит изображений: ${MAX_IMAGES}`);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Загрузка батчами по 10 файлов для стабильности
      const batchSize = 10;
      const batches = [];
      
      for (let i = 0; i < filesToUpload.length; i += batchSize) {
        batches.push(filesToUpload.slice(i, i + batchSize));
      }

      const allUrls: string[] = [];
      
      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        const form = new FormData();
        batch.forEach((f) => form.append("files", f));
        
        const res = await fetch("/api/upload", { method: "POST", body: form });
        const data = await res.json();
        
        if (data.urls) {
          allUrls.push(...data.urls);
        }
        
        setUploadProgress(Math.round(((i + 1) / batches.length) * 100));
      }

      setUrls(prevUrls => [...prevUrls, ...allUrls]);
      
      if (filesToUpload.length < files.length) {
        alert(`Загружено ${filesToUpload.length} из ${files.length} файлов. Достигнут лимит в ${MAX_IMAGES} изображений.`);
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      await upload(files);
    }
  };

  const removeImage = useCallback((urlToRemove: string) => {
    setUrls(prevUrls => prevUrls.filter(url => url !== urlToRemove));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const clearAll = () => {
    if (confirm(`Удалить все ${urls.length} изображений?`)) {
      setUrls([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const canUploadMore = urls.length < MAX_IMAGES;

  return (
    <div className="space-y-6">
      {/* Upload Button */}
      <div className="relative group">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={onChange}
          disabled={isUploading || !canUploadMore}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || !canUploadMore}
          className={`w-full px-6 py-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 bg-gradient-to-r ${colors.button} text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex items-center gap-3">
              <Upload className="w-5 h-5" />
              <span>Выбрать изображения</span>
            </div>
            <span className="text-xs opacity-90">
              {urls.length} / {MAX_IMAGES} изображений
            </span>
          </div>
        </button>
        
        {isUploading && (
          <div className="absolute inset-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center gap-3">
            <div className={`w-6 h-6 border-2 border-t-transparent rounded-full animate-spin ${colors.accent} border-opacity-30`}></div>
            <span className={`text-sm font-medium ${colors.text}`}>
              Загружаем... {uploadProgress}%
            </span>
            <div className="w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full ${colors.accent} transition-all duration-300`}
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Gallery */}
      {urls.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg ${colors.accent} flex items-center justify-center`}>
                <ImageIcon className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Загруженные изображения ({urls.length}/{MAX_IMAGES})
              </h3>
            </div>
            
            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex gap-1 bg-white dark:bg-gray-700 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded transition-colors ${
                    viewMode === 'grid' 
                      ? `${colors.accent} text-white` 
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded transition-colors ${
                    viewMode === 'list' 
                      ? `${colors.accent} text-white` 
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              
              {/* Clear All Button */}
              <button
                type="button"
                onClick={clearAll}
                className="px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 bg-white dark:bg-gray-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                Очистить все
              </button>
            </div>
          </div>
          
          {/* Images Grid/List */}
          <div className={`
            ${viewMode === 'grid' 
              ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3' 
              : 'flex flex-col gap-2'
            }
          `}>
            {urls.map((url, index) => (
              <div 
                key={`${url}-${index}`} 
                className={`group relative ${
                  viewMode === 'grid' ? 'aspect-square' : 'flex items-center gap-3 p-2 bg-white dark:bg-gray-700 rounded-lg'
                }`}
              >
                <div 
                  className={`
                    bg-cover bg-center rounded-lg border border-gray-200 dark:border-gray-600 
                    ${viewMode === 'grid' 
                      ? 'w-full h-full group-hover:scale-105 transition-transform duration-200' 
                      : 'w-16 h-16 flex-shrink-0'
                    }
                  `}
                  style={{ backgroundImage: `url(${url})` }}
                />
                
                {viewMode === 'list' && (
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      Изображение {index + 1}
                    </p>
                  </div>
                )}
                
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className={`
                    ${viewMode === 'grid' 
                      ? 'absolute -top-2 -right-2 w-6 h-6 opacity-0 group-hover:opacity-100' 
                      : 'w-8 h-8'
                    }
                    bg-red-500 text-white rounded-full flex items-center justify-center 
                    transition-all duration-200 hover:bg-red-600 hover:scale-110
                  `}
                >
                  <X className="w-3 h-3" />
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