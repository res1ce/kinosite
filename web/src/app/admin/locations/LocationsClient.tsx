"use client";
import { useMemo, useState } from "react";
import Toolbar from "@/components/Toolbar";
import Panel from "@/components/Panel";
import LocationPickerYandex from "@/components/LocationPickerYandex";
import ImagesUploader from "@/components/ImagesUploader";
import DeleteButton from "@/components/DeleteButton";

interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string | null;
  description: string | null;
  galleryUrls: string[] | null;   // Json? → string[] | null
  isPartner: boolean;
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

  const filtered = useMemo(
    () => locations.filter(l => [l.name, l.address, l.description].join(" ").toLowerCase().includes(query.toLowerCase())),
    [locations, query]
  );

  return (
    <div className="grid lg:grid-cols-3 gap-6 items-start">
      <div className="lg:col-span-2 grid gap-4">
        <Toolbar onSearch={setQuery} />
        <div className="grid md:grid-cols-2 gap-5">
          {filtered.map((l) => (
            <div key={l.id} className="group rounded-2xl border bg-white dark:bg-[#111] overflow-hidden shadow-sm hover:shadow-xl transition">
              {/* Галерея превью */}
              <div className="relative h-40 overflow-hidden">
                <div className="absolute inset-0 grid grid-cols-2">
                  {[0,1,2,3].map(i => (
                    <div key={i} className="border border-white/10">
                      <div className="w-full h-full bg-center bg-cover"
                           style={{ backgroundImage: `url(${l.galleryUrls?.[i] || "/window.svg"})` }} />
                    </div>
                  ))}
                </div>
                <span className="absolute top-3 left-3 px-2 py-1 rounded-md text-[11px] bg-[#6E0A6B] text-white shadow">Локация</span>
              </div>
              <div className="p-4 grid gap-2">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold leading-snug hover:text-[#6E0A6B] transition">{l.name}</h3>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => { setEditId(l.id); setEditLocation(l); }}
                      className="px-3 py-1.5 rounded-md bg-[#6E0A6B]/10 text-[#6E0A6B] hover:bg-[#6E0A6B]/15 transition"
                    >
                      Изм.
                    </button>
                    <DeleteButton onDelete={() => deleteLocation(l.id)} />
                  </div>
                </div>
                {l.address && <p className="text-sm text-gray-600">{l.address}</p>}
                {l.description && <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{l.description}</p>}
                <div className="text-xs text-gray-500">обновлено {new Date(l.updatedAt).toLocaleDateString("ru-RU")}</div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full rounded-xl border bg-white dark:bg-[#111] p-10 text-center text-gray-500">
              Ничего не найдено
            </div>
          )}
        </div>
      </div>

      {/* Правая панель */}
      <Panel title={editId ? "Редактировать локацию" : "Добавить локацию"}>
        <form
          action={async (fd: FormData) => {
            if (editId) { await updateLocation(editId, fd); setEditId(null); setEditLocation(null); }
            else { await createLocation(fd); }
          }}
          className="grid gap-4"
        >
          <Field label="Название">
            <input name="name" defaultValue={editLocation?.name}
                   className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-[#6E0A6B]/60" required />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Широта">
              <input name="latitude" type="number" step="any" defaultValue={editLocation?.latitude}
                     className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-[#6E0A6B]/60" required />
            </Field>
            <Field label="Долгота">
              <input name="longitude" type="number" step="any" defaultValue={editLocation?.longitude}
                     className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-[#6E0A6B]/60" required />
            </Field>
          </div>
          <Field label="Адрес">
            <input name="address" defaultValue={editLocation?.address || ""}
                   className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-[#6E0A6B]/60" />
          </Field>
          <Field label="Описание">
            <textarea name="description" rows={4} defaultValue={editLocation?.description || ""}
                      className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-[#6E0A6B]/60" />
          </Field>
          <Field label="Галерея">
            <ImagesUploader initialUrls={editLocation?.galleryUrls || []} />
          </Field>
          <LocationPickerYandex />
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg bg-[#6E0A6B] text-white hover:brightness-110 active:scale-95 transition">
              {editId ? "Сохранить" : "Добавить"}
            </button>
            {editId && (
              <button type="button" onClick={() => { setEditId(null); setEditLocation(null); }}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-black/30 hover:bg-gray-200 transition">
                Отмена
              </button>
            )}
          </div>
        </form>
      </Panel>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
