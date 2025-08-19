"use client";
import { useState } from "react";
import DeleteButton from "@/components/DeleteButton";

interface PriceItem {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export default function PricesClient({
  priceItems,
  createPriceItem,
  updatePriceItem,
  deletePriceItem,
}: {
  priceItems: PriceItem[];
  createPriceItem: (formData: FormData) => Promise<void>;
  updatePriceItem: (id: string, formData: FormData) => Promise<void>;
  deletePriceItem: (id: string) => Promise<void>;
}) {
  const [editId, setEditId] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<PriceItem | null>(null);

  const handleEdit = (item: PriceItem) => {
    setEditId(item.id);
    setEditItem(item);
  };

  const handleCancel = () => {
    setEditId(null);
    setEditItem(null);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white border rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">
          {editId ? "Редактировать услугу" : "Добавить услугу"}
        </h2>
        <form 
          action={async (formData: FormData) => {
            if (editId) {
              await updatePriceItem(editId, formData);
              handleCancel();
            } else {
              await createPriceItem(formData);
            }
          }} 
          className="space-y-4"
        >
          <div className="grid gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Название услуги
            </label>
            <input
              name="name"
              required
              defaultValue={editItem?.name}
              className="w-full border rounded-md px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Описание
            </label>
            <textarea
              name="description"
              rows={4}
              defaultValue={editItem?.description || ''}
              className="w-full border rounded-md px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="inline-flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {editId ? (
                  <>
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                    <polyline points="17 21 17 13 7 13 7 21"/>
                    <polyline points="7 3 7 8 15 8"/>
                  </>
                ) : (
                  <path d="M12 5v14M5 12h14"/>
                )}
              </svg>
              {editId ? "Сохранить" : "Добавить"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={handleCancel}
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
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Список услуг</h2>
        <div className="grid gap-4">
          {priceItems.map((item) => (
            <div key={item.id} className="bg-white border rounded-lg shadow-sm overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                    </div>
                    {item.description && (
                      <p className="mt-2 text-sm text-gray-600">{item.description}</p>
                    )}
                    <p className="mt-2 text-xs text-gray-500">
                      Последнее обновление: {new Date(item.updatedAt).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(item)}
                      className="inline-flex items-center gap-1 text-sm px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      Изменить
                    </button>
                    <DeleteButton onDelete={() => deletePriceItem(item.id)} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
