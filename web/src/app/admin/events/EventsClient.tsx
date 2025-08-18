"use client";
import { useState } from "react";
import EventForm from "@/components/EventForm";

interface Event {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  content: string;
  coverImageUrl: string | null;
  galleryUrls: any;
  date: Date;
  location: string | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function EventsClient({
  events,
  createEvent,
  updateEvent,
  deleteEvent,
}: {
  events: Event[];
  createEvent: (formData: FormData) => Promise<void>;
  updateEvent: (id: string, formData: FormData) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
}) {
  const [editId, setEditId] = useState<string | null>(null);
  const [editEvent, setEditEvent] = useState<Event | null>(null);

  const handleEdit = (event: Event) => {
    setEditId(event.id);
    setEditEvent(event);
  };

  const handleCancel = () => {
    setEditId(null);
    setEditEvent(null);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white border rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">
          {editId ? "Редактировать новость" : "Добавить новость"}
        </h2>
        {!editId ? (
          <EventForm onSubmit={createEvent} />
        ) : (
          <EventForm 
            event={editEvent ?? undefined} 
            onSubmit={async (formData) => {
              await updateEvent(editId, formData);
              handleCancel();
            }} 
            onCancel={handleCancel} 
          />
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Список новостей</h2>
        <div className="grid gap-4">
          {events.map((event) => (
            <div key={event.id} className="bg-white border rounded-lg shadow-sm overflow-hidden">
              <div className="p-4">
                <div className="flex gap-4">
                  {event.coverImageUrl && (
                    <img 
                      src={event.coverImageUrl} 
                      alt="" 
                      className="h-32 w-48 object-cover rounded-md flex-shrink-0" 
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                        <p className="text-base text-gray-600 mt-2 line-clamp-3">
                          {event.shortDescription}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleEdit(event)}
                          className="inline-flex items-center gap-1.5 text-sm px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                          Изменить
                        </button>
                        <form action={() => deleteEvent(event.id)}>
                          <button 
                            type="submit"
                            className="inline-flex items-center gap-1.5 text-sm px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"/>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                            Удалить
                          </button>
                        </form>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                      <div className="inline-flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                          <line x1="16" y1="2" x2="16" y2="6"/>
                          <line x1="8" y1="2" x2="8" y2="6"/>
                          <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        {new Date(event.date).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>
                      {event.location && (
                        <div className="inline-flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                            <circle cx="12" cy="10" r="3"/>
                          </svg>
                          {event.location}
                        </div>
                      )}
                      <div className="inline-flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                        </svg>
                        /{event.slug}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {event.galleryUrls && Array.isArray(event.galleryUrls) && event.galleryUrls.length > 0 && (
                <div className="bg-gray-50 px-4 py-3">
                  <div className="flex gap-2 overflow-auto">
                    {event.galleryUrls.map((url: string, index: number) => (
                      <img 
                        key={index}
                        src={url}
                        alt=""
                        className="h-16 w-16 object-cover rounded-md flex-shrink-0"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
