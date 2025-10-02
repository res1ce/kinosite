"use client";
import { useMemo, useState } from "react";
import Toolbar from "@/components/Toolbar";
import DeleteButton from "@/components/DeleteButton";
import { Target, Star, Users, CheckCircle2, Award, Sparkles } from "lucide-react";

interface PriceItem { 
  id: string; 
  name: string; 
  description: string | null;
  features: string | null; // JSON string
  iconType: string | null;
  order: number;
  updatedAt: string | Date; 
}

const ICON_OPTIONS = [
  { value: 'target', label: 'Цель', icon: <Target size={20} /> },
  { value: 'star', label: 'Звезда', icon: <Star size={20} /> },
  { value: 'users', label: 'Люди', icon: <Users size={20} /> },
  { value: 'checkCircle', label: 'Галочка', icon: <CheckCircle2 size={20} /> },
  { value: 'award', label: 'Награда', icon: <Award size={20} /> },
  { value: 'sparkles', label: 'Блеск', icon: <Sparkles size={20} /> },
];

function getIcon(iconType: string | null) {
  switch (iconType) {
    case 'target': return <Target size={24} />;
    case 'star': return <Star size={24} />;
    case 'users': return <Users size={24} />;
    case 'checkCircle': return <CheckCircle2 size={24} />;
    case 'award': return <Award size={24} />;
    case 'sparkles': return <Sparkles size={24} />;
    default: return <Star size={24} />;
  }
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
  const [featureInput, setFeatureInput] = useState("");
  const [features, setFeatures] = useState<string[]>([]);

  const sorted = useMemo(() => 
    [...priceItems].sort((a, b) => a.order - b.order),
    [priceItems]
  );

  const filtered = useMemo(() => 
    sorted.filter(i => 
      [i.name, i.description].join(" ").toLowerCase().includes(q.toLowerCase())
    ), 
    [sorted, q]
  );

  const handleEdit = (item: PriceItem) => {
    setEditId(item.id);
    setEditItem(item);
    try {
      const parsed = item.features ? JSON.parse(item.features) : [];
      setFeatures(Array.isArray(parsed) ? parsed : []);
    } catch {
      setFeatures([]);
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setEditItem(null);
    setFeatures([]);
    setFeatureInput("");
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

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
              {filtered.map((item) => {
                let parsedFeatures: string[] = [];
                try {
                  parsedFeatures = item.features ? JSON.parse(item.features) : [];
                } catch {}

                return (
                  <div key={item.id} className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0 text-white">
                          {getIcon(item.iconType)}
                        </div>
                        <h3 className="font-bold text-lg text-gray-800 dark:text-white group-hover:text-emerald-600 transition-colors">
                          {item.name}
                        </h3>
                      </div>
                      
                      <div className="flex gap-2 flex-shrink-0">
                        <button 
                          onClick={() => handleEdit(item)} 
                          className="px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all duration-200 text-sm font-medium"
                        >
                          Изм.
                        </button>
                        <DeleteButton onDelete={() => deletePriceItem(item.id)} />
                      </div>
                    </div>
                    
                    {item.description && (
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                        {item.description}
                      </p>
                    )}

                    {parsedFeatures.length > 0 && (
                      <div className="space-y-2 mb-4">
                        {parsedFeatures.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{new Date(item.updatedAt).toLocaleDateString("ru-RU")}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Порядок: {item.order}
                      </div>
                    </div>
                  </div>
                );
              })}
              
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
                </div>
              )}
            </div>
          </div>

          {/* Edit Panel */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={editId ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {editId ? "Редактировать" : "Добавить услугу"}
              </h2>
            </div>
            
            <form
              action={async (fd: FormData) => {
                fd.append('features', JSON.stringify(features));
                if (editId) { 
                  await updatePriceItem(editId, fd); 
                  handleCancel();
                } else { 
                  await createPriceItem(fd);
                  setFeatures([]);
                }
              }}
              className="space-y-6"
            >
              <Field label="Название">
                <input 
                  name="name" 
                  defaultValue={editItem?.name} 
                  required
                  className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-900/50 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all" 
                />
              </Field>

              <Field label="Иконка">
                <select
                  name="iconType"
                  defaultValue={editItem?.iconType || 'star'}
                  className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-900/50 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all"
                >
                  {ICON_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </Field>

              <Field label="Порядок отображения">
                <input 
                  name="order" 
                  type="number"
                  defaultValue={editItem?.order || 0} 
                  className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-900/50 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all" 
                />
              </Field>
              
              <Field label="Описание">
                <textarea 
                  name="description" 
                  rows={4} 
                  defaultValue={editItem?.description || ""}
                  className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-900/50 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all resize-none" 
                />
              </Field>

              <Field label="Особенности услуги">
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                      placeholder="Добавить особенность..."
                      className="flex-1 rounded-xl border-2 border-gray-200 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-900/50 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all text-sm" 
                    />
                    <button
                      type="button"
                      onClick={addFeature}
                      className="px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  
                  {features.length > 0 && (
                    <div className="space-y-2">
                      {features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2">
                          <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                          <span className="text-sm flex-1">{feature}</span>
                          <button
                            type="button"
                            onClick={() => removeFeature(idx)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Field>
              
              <div className="space-y-3">
                <button 
                  type="submit"
                  className="w-full group relative px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  <span>{editId ? "Сохранить" : "Добавить"}</span>
                </button>
                
                {editId && (
                  <button 
                    type="button" 
                    onClick={handleCancel}
                    className="w-full px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
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
        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        {label}
      </label>
      {children}
    </div>
  );
}