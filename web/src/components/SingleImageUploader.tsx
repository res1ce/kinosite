"use client";
import { useState } from "react";
import { ImagePlus } from "lucide-react";

export default function SingleImageUploader({ name }: { name: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string>("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const upload = async () => {
    if (!file) return;
    const form = new FormData();
    form.append("files", file);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    const data = await res.json();
    if (data.urls?.[0]) {
      setUrl(data.urls[0]);
      const hidden = document.querySelector<HTMLInputElement>(`input[name='${name}']`);
      if (hidden) hidden.value = data.urls[0];
    }
  };

  return (
    <div className="grid gap-2">
      <div className="flex gap-4 items-center">
        <input type="file" accept="image/*" onChange={onChange} />
        <button 
          type="button" 
          onClick={upload} 
          className="bg-black text-white px-3 py-1 rounded flex items-center gap-2"
          disabled={!file}
        >
          <ImagePlus size={16} /> Загрузить
        </button>
      </div>
      {url && (
        <div className="flex gap-2 items-center">
          <img src={url} alt="" className="h-16 w-16 object-cover rounded" />
          <button 
            type="button" 
            className="text-red-600 text-sm" 
            onClick={() => {
              setUrl("");
              setFile(null);
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
