"use client";
import { useState, useEffect } from "react";
import { Loader } from "lucide-react";

export default function SingleImageUploader({ name, initialUrl = "" }: { name: string; initialUrl?: string }) {
  const [isUploading, setIsUploading] = useState(false);
  const [url, setUrl] = useState<string>(initialUrl);

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

  return (
    <div className="grid gap-3">
      <div className="relative">
        <input 
          type="file" 
          accept="image/*" 
          onChange={onChange}
          className="block w-full text-sm text-gray-500
            file:me-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-600 file:text-white
            hover:file:bg-blue-700
            file:disabled:opacity-50 file:disabled:pointer-events-none"
          disabled={isUploading}
        />
        {isUploading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
            <Loader className="w-5 h-5 text-blue-600 animate-spin" />
          </div>
        )}
      </div>
      {url && (
        <div className="flex gap-3 items-center">
          <div className="relative group">
            <img src={url} alt="" className="h-20 w-20 object-cover rounded-lg" />
            <button 
              type="button"
              onClick={() => {
                setUrl("");
                const hidden = document.querySelector<HTMLInputElement>(`input[name='${name}']`);
                if (hidden) hidden.value = "";
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
      )}
      <input type="hidden" name={name} defaultValue={url} />
    </div>
  );
}
