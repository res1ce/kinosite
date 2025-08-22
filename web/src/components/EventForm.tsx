"use client";
import { useEffect, useRef } from "react";
import SingleImageUploader from "./SingleImageUploader";
import ImagesUploader from "./ImagesUploader";

export default function EventForm({ 
  event, 
  onSubmit,
  onCancel
}: { 
  event?: {
    id: string;
    title: string;
    slug: string;
    shortDescription: string;
    content: string;
    coverImageUrl: string | null;
    galleryUrls: string[] | null;
    date: Date;
    location: string | null;
  };
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel?: () => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    await onSubmit(formData);
    if (!event) { // Только при создании новой новости
      formRef.current?.reset(); // Очищаем все поля формы
      // Очищаем значения загрузчиков изображений
      const coverInput = document.querySelector<HTMLInputElement>("input[name='coverImageUrl']");
      const galleryInput = document.querySelector<HTMLInputElement>("input[name='galleryUrls']");
      if (coverInput) {
        coverInput.value = "";
        const coverEvent = new Event('change', { bubbles: true });
        coverInput.dispatchEvent(coverEvent);
      }
      if (galleryInput) {
        galleryInput.value = "";
        const galleryEvent = new Event('change', { bubbles: true });
        galleryInput.dispatchEvent(galleryEvent);
      }
    }
  };

  return (
    <form ref={formRef} action={handleSubmit} className="grid gap-3 rounded p-4">
      <div className="grid gap-1">
        <label className="text-sm">Заголовок</label>
        <input 
          className="border rounded px-3 py-2" 
          name="title" 
          required 
          defaultValue={event?.title}
        />
      </div>
      <div className="grid gap-1">
        <label className="text-sm">Слаг (URL) - часть ссылки для показа в интернете (https://example.ru/СЛАГ)</label>
        <input 
          className="border rounded px-3 py-2" 
          name="slug" 
          pattern="[a-z0-9-]+" 
          required 
          defaultValue={event?.slug}
        />
      </div>
      <div className="grid gap-1">
        <label className="text-sm">Краткое описание</label>
        <textarea 
          className="border rounded px-3 py-2" 
          name="shortDescription" 
          rows={2} 
          required 
          defaultValue={event?.shortDescription}
        />
      </div>
      <div className="grid gap-1">
        <label className="text-sm">Полное описание (HTML разрешён)</label>
        <textarea 
          className="border rounded px-3 py-2" 
          name="content" 
          rows={6}
          defaultValue={event?.content}
        />
      </div>
      <div className="grid gap-1">
        <label className="text-sm">Обложка</label>
        <SingleImageUploader 
          name="coverImageUrl" 
          initialUrl={event?.coverImageUrl || ""}
        />
      </div>
      <div className="grid gap-1">
        <label className="text-sm">Галерея изображений</label>
        <ImagesUploader 
          initialUrls={event?.galleryUrls || []}
        />
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <div className="grid gap-1">
          <label className="text-sm">Дата</label>
          <input 
            className="border rounded px-3 py-2" 
            name="date" 
            type="datetime-local"
            defaultValue={event?.date ? new Date(event.date).toISOString().slice(0, 16) : undefined}
          />
        </div>
        <div className="grid gap-1">
          <label className="text-sm">Локация</label>
          <input 
            className="border rounded px-3 py-2" 
            name="location"
            defaultValue={event?.location || ""}
          />
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <button 
          type="submit" 
          className="inline-flex items-center gap-1 bg-[#6E0A6B] text-white px-4 py-2 rounded-md hover:bg-[#A10B9B] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {event ? (
              <>
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </>
            ) : (
              <path d="M12 5v14M5 12h14"/>
            )}
          </svg>
          {event ? "Сохранить" : "Добавить"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            Отмена
          </button>
        )}
      </div>
    </form>
  );
}
