"use client";
import { useRef } from "react";
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
    <form ref={formRef} action={handleSubmit} className="space-y-6">
      <Field label="Заголовок новости">
        <input 
          className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-900/50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500" 
          name="title" 
          required 
          defaultValue={event?.title}
          placeholder="Введите заголовок новости..."
        />
      </Field>
      
      <Field label="URL-адрес (слаг)">
        <input 
          className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-900/50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500" 
          name="slug" 
          pattern="[a-z0-9-]+" 
          required 
          defaultValue={event?.slug}
          placeholder="url-novosti-primer"
        />
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Часть ссылки для показа в интернете (только буквы, цифры и дефисы)</span>
        </div>
      </Field>
      
      <Field label="Краткое описание">
        <textarea 
          className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-900/50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 resize-none hover:border-gray-300 dark:hover:border-gray-500" 
          name="shortDescription" 
          rows={3} 
          required 
          defaultValue={event?.shortDescription}
          placeholder="Краткое описание новости для превью..."
        />
      </Field>
      
      <Field label="Полное содержание">
        <textarea 
          className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-900/50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 resize-none hover:border-gray-300 dark:hover:border-gray-500 font-mono text-sm" 
          name="content" 
          rows={8}
          defaultValue={event?.content}
          placeholder="Полный текст новости (HTML разрешён)..."
        />
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <span>HTML теги разрешены для форматирования</span>
        </div>
      </Field>
      
      <Field label="Обложка новости">
        <SingleImageUploader 
          name="coverImageUrl" 
          initialUrl={event?.coverImageUrl || ""} 
          variant="blue" 
        />
      </Field>
      
      <Field label="Галерея изображений">
        <ImagesUploader 
          initialUrls={event?.galleryUrls || []} 
          variant="blue" 
        />
      </Field>
      
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Дата и время">
          <input 
            className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-900/50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500" 
            name="date" 
            type="datetime-local"
            defaultValue={event?.date ? new Date(event.date).toISOString().slice(0, 16) : undefined}
          />
        </Field>
        
        <Field label="Место проведения">
          <input 
            className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-900/50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500" 
            name="location"
            defaultValue={event?.location || ""}
            placeholder="Москва, Красная площадь"
          />
        </Field>
      </div>
      
      <div className="space-y-3 pt-4">
        <button 
          type="submit" 
          className="w-full group relative px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          <div className="relative flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {event ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              )}
            </svg>
            <span>{event ? "Сохранить изменения" : "Добавить новость"}</span>
          </div>
        </button>
        
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-full px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Отмена</span>
            </div>
          </button>
        )}
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
        {label}
      </label>
      {children}
    </div>
  );
}