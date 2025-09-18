//LocationsClient.tsx - ПОЛНАЯ ФУНКЦИОНАЛЬНОСТЬ СОХРАНЕНА
"use client";
import { useMemo, useState, useEffect } from "react";
import Toolbar from "@/components/Toolbar";
import LocationPickerYandex from "@/components/LocationPickerYandex";
import ImagesUploader from "@/components/ImagesUploader";
import DeleteButton from "@/components/DeleteButton";

interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  slug: string;
  address: string | null;
  description: string | null;
  galleryUrls: string[] | null;
  isPartner: boolean;
  category: "ARCHITECTURE" | "NATURE" | "STUDIO";
  createdAt: Date | string;
  updatedAt: Date | string;
}

export default function LocationsClient({
  locations, createLocation, updateLocation, deleteLocation,
}: {
  locations: Location[];
  createLocation: (fd: FormData) => Promise<void>;
  updateLocation: (id: string, fd: FormData) => Promise<void>;
  deleteLocation: (id: string) => Promise<void>;
}) {
  const [query, setQuery] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editLocation, setEditLocation] = useState<Location | null>(null);
  const [category, setCategory] = useState<"ARCHITECTURE" | "NATURE" | "STUDIO">("ARCHITECTURE");

  useEffect(() => {
    if (editLocation) {
      setCategory(editLocation.category);
    } else {
      setCategory("ARCHITECTURE");
    }
  }, [editLocation]);
  const filtered = useMemo(
    () => locations.filter(l => [l.name, l.address, l.description].join(" ").toLowerCase().includes(query.toLowerCase())),
    [locations, query]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-teal-900/20 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Locations Grid */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <Toolbar onSearch={setQuery} />
            </div>
            
            {/* Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {filtered.map((l) => (
                <div key={l.id} className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300">
                  {/* Gallery Preview - СОХРАНЕНА ОРИГИНАЛЬНАЯ ЛОГИКА */}
                  <div className="relative h-48 overflow-hidden">
                    <div className="absolute inset-0 grid grid-cols-2">
                      {[0,1,2,3].map(i => (
                        <div key={i} className="border border-white/10 overflow-hidden">
                          <div 
                            className="w-full h-full bg-center bg-cover transition-transform duration-500 group-hover:scale-110"
                            style={{ backgroundImage: `url(${l.galleryUrls?.[i] || "/window.svg"})` }} 
                          />
                        </div>
                      ))}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <span className="absolute top-4 left-4 px-3 py-1.5 rounded-xl text-xs bg-teal-500 text-white shadow-lg font-medium">
                      {l.category === "ARCHITECTURE" && "Архитектура"}
                      {l.category === "NATURE" && "Природа"}
                      {l.category === "STUDIO" && "Студия"}
                    </span>
                    {l.isPartner && (
                      <span className="absolute top-4 right-4 px-3 py-1.5 rounded-xl text-xs bg-amber-500 text-white shadow-lg font-medium">
                        Партнер
                      </span>
                    )}
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-xl text-gray-800 dark:text-white group-hover:text-teal-600 transition-colors line-clamp-2 mb-2">
                          {l.name}
                        </h3>
                        
                        {l.address && (
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                            <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <p className="text-sm line-clamp-1">{l.address}</p>
                          </div>
                        )}
                        
                        {l.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-3">
                            {l.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>обновлено {new Date(l.updatedAt).toLocaleDateString("ru-RU")}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => { setEditId(l.id); setEditLocation(l); }}
                          className="px-3 py-2 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 hover:bg-teal-500/20 transition-all duration-200 text-sm font-medium"
                        >
                          Изм.
                        </button>
                        <DeleteButton onDelete={() => deleteLocation(l.id)} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {filtered.length === 0 && (
                <div className="col-span-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
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

          {/* Right Panel - ВСЕ ПОЛЯ СОХРАНЕНЫ */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 sticky top-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={editId ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {editId ? "Редактировать локацию" : "Добавить локацию"}
              </h2>
            </div>
            
            <form
              action={async (fd: FormData) => {
                if (editId) { await updateLocation(editId, fd); setEditId(null); setEditLocation(null); }
                else { await createLocation(fd); }
              }}
              className="space-y-6"
            >
              <Field label="Название">
                <input 
                  name="name" 
                  defaultValue={editLocation?.name}
                  required
                  className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-900/50 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500" 
                />
              </Field>
              
              <Field label="Категория">
                <select
                  name="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as typeof category)}
                  className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 px-4 py-3 
                            bg-white dark:bg-gray-900/50 focus:outline-none focus:border-teal-500 
                            focus:ring-4 focus:ring-teal-500/20 transition-all duration-200"
                >
                  <option value="ARCHITECTURE">Архитектура</option>
                  <option value="NATURE">Природа</option>
                  <option value="STUDIO">Студия</option>
                </select>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Широта">
                  <input 
                    name="latitude" 
                    type="number" 
                    step="any" 
                    defaultValue={editLocation?.latitude}
                    required
                    className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-900/50 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500" 
                  />
                </Field>
                <Field label="Долгота">
                  <input 
                    name="longitude" 
                    type="number" 
                    step="any" 
                    defaultValue={editLocation?.longitude}
                    required
                    className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-900/50 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500" 
                  />
                </Field>
              </div>

              <Field label="URL-адрес (слаг)">
                <input 
                  className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-900/50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500" 
                  name="slug" 
                  pattern="[a-z0-9-]+" 
                  required 
                  defaultValue={editLocation?.slug}
                  placeholder="url-location-primer"
                />
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Часть ссылки для показа в интернете (только буквы, цифры и дефисы)</span>
                </div>
              </Field>

              <Field label="Адрес">
                <input 
                  name="address" 
                  defaultValue={editLocation?.address || ""}
                  className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-900/50 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500" 
                />
              </Field>
              
              <Field label="Описание">
                <textarea 
                  name="description" 
                  rows={4} 
                  defaultValue={editLocation?.description || ""}
                  className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-900/50 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 transition-all duration-200 resize-none hover:border-gray-300 dark:hover:border-gray-500" 
                />
              </Field>
              
              <Field label="Галерея">
                <ImagesUploader 
                  initialUrls={editLocation?.galleryUrls || []} 
                  variant="teal" 
                />
              </Field>
              
              {/* ВАЖНО: Сохраняем LocationPickerYandex */}
              <LocationPickerYandex />
              
              <div className="space-y-3">
                <button 
                  type="submit"
                  className="w-full group relative px-6 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  <div className="relative flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={editId ? "M5 13l4 4L19 7" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} />
                    </svg>
                    <span>{editId ? "Сохранить" : "Добавить"}</span>
                  </div>
                </button>
                
                {editId && (
                  <button 
                    type="button" 
                    onClick={() => { setEditId(null); setEditLocation(null); }}
                    className="w-full px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                  >
                    Отмена
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-teal-500"></span>
        {label}
      </label>
      {children}
    </div>
  );
}