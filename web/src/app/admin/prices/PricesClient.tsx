// prices PricesClient.tsx
"use client";
import { useMemo, useState } from "react";
import Toolbar from "@/components/Toolbar";
import Panel from "@/components/Panel";
import DeleteButton from "@/components/DeleteButton";

interface PriceItem { 
  id: string; 
  name: string; 
  description: string | null; 
  updatedAt: string | Date; 
}

export default function PricesClient({
  priceItems, createPriceItem, updatePriceItem, deletePriceItem,
}: {
  priceItems: PriceItem[];
  createPriceItem: (fd: FormData) => Promise<void>;
  updatePriceItem: (id: string, fd: FormData) => Promise<void>;
  deletePriceItem: (id: string) => Promise<void>;
}) {
  const [q, setQ] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<PriceItem | null>(null);
  const filtered = useMemo(() => 
    priceItems.filter(i => 
      [i.name, i.description].join(" ").toLowerCase().includes(q.toLowerCase())
    ), 
    [priceItems, q]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900/20 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Services List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <Toolbar onSearch={setQ} />
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {filtered.map((item) => (
                <div key={item.id} className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0-8h6a2 2 0 012 2v6a2 2 0 01-2 2h-6m0-8v8" />
                          </svg>
                        </div>
                        <h3 className="font-bold text-lg text-gray-800 dark:text-white group-hover:text-emerald-600 transition-colors">
                          {item.name}
                        </h3>
                      </div>
                      
                      {item.description && (
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3 line-clamp-3">
                          {item.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>обновлено {new Date(item.updatedAt).toLocaleDateString("ru-RU")}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 flex-shrink-0">
                      <button 
                        onClick={() => { setEditId(item.id); setEditItem(item); }} 
                        className="px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all duration-200 text-sm font-medium"
                      >
                        Изм.
                      </button>
                      <DeleteButton onDelete={() => deletePriceItem(item.id)} />
                    </div>
                  </div>
                </div>
              ))}
              
              {filtered.length === 0 && (
                <div className="col-span-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0-8h6a2 2 0 012 2v6a2 2 0 01-2 2h-6m0-8v8" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-2">
                    Услуги не найдены
                  </h3>
                  <p className="text-gray-400 dark:text-gray-500 text-sm">
                    Попробуйте изменить поисковый запрос или добавьте новую услугу
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Edit Panel */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 sticky top-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={editId ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {editId ? "Редактировать услугу" : "Добавить услугу"}
              </h2>
            </div>
            
            <form
              action={async (fd: FormData) => {
                if (editId) { 
                  await updatePriceItem(editId, fd); 
                  setEditId(null); 
                  setEditItem(null); 
                } else { 
                  await createPriceItem(fd); 
                }
              }}
              className="space-y-6"
            >
              <Field label="Название услуги">
                <input 
                  name="name" 
                  defaultValue={editItem?.name} 
                  required
                  placeholder="Введите название услуги..."
                  className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-900/50 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500" 
                />
              </Field>
              
              <Field label="Описание услуги">
                <textarea 
                  name="description" 
                  rows={5} 
                  defaultValue={editItem?.description || ""}
                  placeholder="Подробное описание услуги (необязательно)..."
                  className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-900/50 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 resize-none hover:border-gray-300 dark:hover:border-gray-500" 
                />
              </Field>
              
              <div className="space-y-3">
                <button 
                  type="submit"
                  className="w-full group relative px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  <div className="relative flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={editId ? "M5 13l4 4L19 7" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} />
                    </svg>
                    <span>{editId ? "Сохранить изменения" : "Добавить услугу"}</span>
                  </div>
                </button>
                
                {editId && (
                  <button 
                    type="button" 
                    onClick={() => { setEditId(null); setEditItem(null); }}
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
        <span className="w-2 h-2 rounded-full bg-purple-500"></span>
        {label}
      </label>
      {children}
    </div>
  );
}