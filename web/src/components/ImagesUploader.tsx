"use client";
import { useState } from "react";
import { ImagePlus } from "lucide-react";

export default function ImagesUploader() {
  const [files, setFiles] = useState<File[]>([]);
  const [urls, setUrls] = useState<string[]>([]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = Array.from(e.target.files || []);
    setFiles(f);
  };

  const upload = async () => {
    const form = new FormData();
    files.forEach((f) => form.append("files", f));
    const res = await fetch("/api/upload", { method: "POST", body: form });
    const data = await res.json();
    setUrls(data.urls || []);
    const hidden = document.querySelector<HTMLInputElement>("input[name='galleryUrls']");
    if (hidden) hidden.value = JSON.stringify(data.urls || []);
  };

  return (
    <div className="grid gap-2">
      <input type="file" multiple accept="image/*" onChange={onChange} />
      <div className="flex gap-2 flex-wrap">
        {urls.map((u) => (
          <img key={u} src={u} alt="" className="h-16 w-16 object-cover rounded" />
        ))}
      </div>
      <input type="hidden" name="galleryUrls" />
      <button type="button" onClick={upload} className="justify-self-start bg-black text-white px-3 py-1 rounded flex items-center gap-2"><ImagePlus size={16} /> Загрузить</button>
    </div>
  );
}


