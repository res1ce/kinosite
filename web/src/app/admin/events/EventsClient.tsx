"use client";
import { useMemo, useState } from "react";
import Toolbar from "@/components/Toolbar";
import Panel from "@/components/Panel";
import EventForm from "@/components/EventForm";
import DeleteButton from "@/components/DeleteButton";

interface Event {
  id: string; 
  title: string; 
  slug: string;
  shortDescription: string; 
  content: string;
  coverImageUrl: string | null; 
  galleryUrls: string[] | null;
  date: Date; 
  location: string | null;
  createdAt: string | Date; 
  updatedAt: string | Date;
}

export default function EventsClient({
  events, createEvent, updateEvent, deleteEvent,
}: {
  events: Event[];
  createEvent: (fd: FormData) => Promise<void>;
  updateEvent: (id: string, fd: FormData) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
}) {
  const [query, setQuery] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editEvent, setEditEvent] = useState<Event | null>(null);
  
  const filtered = useMemo(
    () => events.filter(e => [e.title, e.shortDescription, e.location, e.slug].join(" ").toLowerCase().includes(query.toLowerCase())),
    [events, query]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Events Grid */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search - СОХРАНЕНА ОРИГИНАЛЬНАЯ ЛОГИКА */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <Toolbar onSearch={setQuery} right={
                <span className="text-sm text-gray-500">Найдено: {filtered.length}</span>
              } />
            </div>
            
            {/* Events Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {filtered.map((e) => (
                <div key={e.id} className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300">
                  {/* Cover - СОХРАНЕНА ОРИГИНАЛЬНАЯ ЛОГИКА */}
                  <div className="relative h-48 overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-center bg-cover transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundImage: `url(${e.coverImageUrl || "/window.svg"})` }} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <span className="absolute top-4 left-4 px-3 py-1.5 rounded-xl text-xs bg-blue-500 text-white shadow-lg font-medium">
                      {new Date(e.date).toLocaleDateString("ru-RU")}
                    </span>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-xl text-gray-800 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                          {e.title}
                        </h3>
                        
                        {e.shortDescription && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-3">
                            {e.shortDescription}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
                          {e.location && <span>📍 {e.location}</span>}
                          <span className="truncate">/{e.slug}</span>
                          <span className="opacity-70">обновлено {new Date(e.updatedAt).toLocaleDateString("ru-RU")}</span>
                        </div>
                        
                        {/* Gallery Preview - СОХРАНЕНА ОРИГИНАЛЬНАЯ ЛОГИКА */}
                        {Array.isArray(e.galleryUrls) && e.galleryUrls.length > 0 && (
                          <div className="flex gap-2 overflow-auto pb-2">
                            {e.galleryUrls.slice(0, 6).map((u, i) => (
                              <img key={i} src={u} alt="" className="h-12 w-12 rounded-lg object-cover ring-2 ring-white/20 flex-shrink-0" />
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2 flex-shrink-0">
                        <button 
                          onClick={() => { setEditId(e.id); setEditEvent(e); }}
                          className="px-3 py-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-all duration-200 text-sm font-medium"
                        >
                          Изм.
                        </button>
                        <DeleteButton onDelete={() => deleteEvent(e.id)} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="col-span-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-2">
                    Ничего не найдено
                  </h3>
                  <p className="text-gray-400 dark:text-gray-500 text-sm">
                    Попробуйте изменить поисковый запрос
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - ИСПОЛЬЗУЕТСЯ ОРИГИНАЛЬНЫЙ EventForm */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 sticky top-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={editId ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {editId ? "Редактировать новость" : "Добавить новость"}
              </h2>
            </div>
            
            {/* ВАЖНО: Используем оригинальный EventForm без изменений */}
            <EventForm
              event={editEvent ?? undefined}
              onSubmit={async (fd) => {
                if (editId) { await updateEvent(editId, fd); setEditId(null); setEditEvent(null); }
                else { await createEvent(fd); }
              }}
              onCancel={editId ? () => { setEditId(null); setEditEvent(null); } : undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
}