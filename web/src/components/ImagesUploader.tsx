"use client";
import { useState, useEffect } from "react";
import { ImagePlus, Loader } from "lucide-react";

export default function ImagesUploader({ initialUrls = [] }: { initialUrls?: string[] }) {
  const [isUploading, setIsUploading] = useState(false);
  const [urls, setUrls] = useState<string[]>(initialUrls);

  useEffect(() => {
    setUrls(initialUrls);
  }, [initialUrls]);

  // Separate effect for updating the hidden input
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
  };

  return (
    <div className="grid gap-3">
      <div className="relative">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={onChange}
          className="block w-full text-sm text-gray-500
            file:me-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-[#6E0A6B] file:text-white
            hover:file:bg-[#A10B9B]
            file:disabled:opacity-50 file:disabled:pointer-events-none"
          disabled={isUploading}
        />
        {isUploading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
            <Loader className="w-5 h-5 text-blue-600 animate-spin" />
          </div>
        )}
      </div>
      {urls.length > 0 && (
        <div className="grid gap-2">
          <div className="text-sm font-medium text-gray-700">Загруженные изображения:</div>
          <div className="flex gap-3 flex-wrap">
            {urls.map((url) => (
              <div key={url} className="relative group">
                <img src={url} alt="" className="h-20 w-20 object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
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


