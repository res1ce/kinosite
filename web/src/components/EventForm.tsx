"use client";
import { useState } from "react";
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
  return (
    <form action={onSubmit} className="grid gap-3 border rounded p-4">
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
        <label className="text-sm">Слаг (URL)</label>
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
        <SingleImageUploader name="coverImageUrl" />
      </div>
      <div className="grid gap-1">
        <label className="text-sm">Галерея изображений</label>
        <ImagesUploader />
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
      <div className="flex gap-2">
        <button type="submit" className="bg-black text-white px-4 py-2 rounded">
          {event ? "Сохранить" : "Добавить"}
        </button>
        {onCancel && (
          <button 
            type="button" 
            onClick={onCancel}
            className="border border-gray-300 px-4 py-2 rounded"
          >
            Отмена
          </button>
        )}
      </div>
    </form>
  );
}
