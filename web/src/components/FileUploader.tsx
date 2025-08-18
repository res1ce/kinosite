"use client";
import { useState } from "react";
import { Upload } from "lucide-react";

export default function FileUploader({ name, accept }: { name: string; accept?: string }) {
  const [isUploading, setIsUploading] = useState(false);
  const [url, setUrl] = useState<string>("");

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
    <div className="grid gap-2">
      <div className="relative">
        <input
          type="file"
          onChange={onChange}
          accept={accept}
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
            <div className="animate-spin">
              <Upload className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        )}
      </div>
      {url && (
        <div className="flex gap-2 items-center">
          <a 
            href={url} 
            target="_blank" 
            rel="noreferrer" 
            className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
          >
            Просмотреть файл
          </a>
          <button 
            type="button" 
            className="text-red-600 text-sm" 
            onClick={() => {
              setUrl("");
              const hidden = document.querySelector<HTMLInputElement>(`input[name='${name}']`);
              if (hidden) hidden.value = "";
            }}
          >
            Удалить
          </button>
        </div>
      )}
      <input type="hidden" name={name} defaultValue={url} />
    </div>
  );
}
