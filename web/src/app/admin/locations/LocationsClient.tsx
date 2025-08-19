"use client";
import { useState } from "react";
import LocationPickerYandex from "@/components/LocationPickerYandex";
import ImagesUploader from "@/components/ImagesUploader";

interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string | null;
  description: string | null;
  galleryUrls: any;
  isPartner: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function LocationsClient({
  locations,
  createLocation,
  updateLocation,
  deleteLocation,
}: {
  locations: Location[];
  createLocation: (formData: FormData) => Promise<void>;
  updateLocation: (id: string, formData: FormData) => Promise<void>;
  deleteLocation: (id: string) => Promise<void>;
}) {
  const [editId, setEditId] = useState<string | null>(null);
  const [editLocation, setEditLocation] = useState<Location | null>(null);

  const handleEdit = (location: Location) => {
    setEditId(location.id);
    setEditLocation(location);
  };

  const handleCancel = () => {
    setEditId(null);
    setEditLocation(null);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white border rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">
          {editId ? "Редактировать локацию" : "Добавить локацию"}
        </h2>
        <form 
          action={async (formData: FormData) => {
            if (editId) {
              await updateLocation(editId, formData);
              handleCancel();
            } else {
              await createLocation(formData);
            }
          }} 
          className="space-y-4"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Название локации
              </label>
              <input
                name="name"
                required
                defaultValue={editLocation?.name}
                className="w-full border rounded-md px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Широта
              </label>
              <input
                name="latitude"
                type="number"
                step="any"
                required
                defaultValue={editLocation?.latitude}
                className="w-full border rounded-md px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Долгота
              </label>
              <input
                name="longitude"
                type="number"
                step="any"
                required
                defaultValue={editLocation?.longitude}
                className="w-full border rounded-md px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Адрес
            </label>
            <input
              name="address"
              defaultValue={editLocation?.address || ''}
              className="w-full border rounded-md px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Описание локации
            </label>
            <textarea
              name="description"
              rows={4}
              required
              defaultValue={editLocation?.description || ''}
              className="w-full border rounded-md px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Галерея изображений
            </label>
            <ImagesUploader />
          </div>

          <LocationPickerYandex />

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
        <h2 className="text-lg font-semibold">Список локаций</h2>
        <div className="grid gap-4">
          {locations.map((location) => (
            <div key={location.id} className="bg-white border rounded-lg shadow-sm overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{location.name}</h3>
                    </div>
                    {location.address && (
                      <p className="mt-1 text-sm text-gray-600">{location.address}</p>
                    )}
                    {location.description && (
                      <p className="mt-2 text-sm text-gray-600">{location.description}</p>
                    )}
                    <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                      <span>Широта: {location.latitude}</span>
                      <span>Долгота: {location.longitude}</span>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      Последнее обновление: {new Date(location.updatedAt).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(location)}
                      className="inline-flex items-center gap-1 text-sm px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      Изменить
                    </button>
                    <form action={() => deleteLocation(location.id)}>
                      <button 
                        type="submit"
                        className="inline-flex items-center gap-1 text-sm px-3 py-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                        Удалить
                      </button>
                    </form>
                  </div>
                </div>
              </div>
              {location.galleryUrls && location.galleryUrls.length > 0 && (
                <div className="bg-gray-50 px-4 py-3">
                  <div className="flex gap-2 overflow-auto">
                    {location.galleryUrls.map((url: string, index: number) => (
                      <img 
                        key={index}
                        src={url}
                        alt=""
                        className="h-20 w-20 object-cover rounded-md flex-shrink-0"
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
