import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import LocationPicker from "@/components/LocationPicker";

async function createCinema(formData: FormData) {
  "use server";
  const name = String(formData.get("name") || "").trim();
  const website = String(formData.get("website") || "").trim() || null;
  const latitude = Number(formData.get("latitude"));
  const longitude = Number(formData.get("longitude"));
  const address = String(formData.get("address") || "").trim() || null;
  if (!name || Number.isNaN(latitude) || Number.isNaN(longitude)) return;
  await prisma.cinema.create({ data: { name, website, latitude, longitude, address } });
  revalidatePath("/cinemas");
  revalidatePath("/admin/cinemas");
}

async function deleteCinema(id: string) {
  "use server";
  await prisma.cinema.delete({ where: { id } });
  revalidatePath("/cinemas");
  revalidatePath("/admin/cinemas");
}

export default async function AdminCinemasPage() {
  const cinemas = await prisma.cinema.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <main className="grid gap-8">
      <h1 className="text-xl font-semibold">Локации</h1>
      <form action={createCinema} className="grid gap-3 border rounded p-4">
        <div className="grid md:grid-cols-2 gap-3">
          <label className="grid gap-1">
            <span className="text-sm">Название локации</span>
            <input className="border rounded px-3 py-2" name="name" required />
          </label>
          <label className="grid gap-1">
            <span className="text-sm">Сайт (если есть)</span>
            <input className="border rounded px-3 py-2" name="website" />
          </label>
          <label className="grid gap-1">
            <span className="text-sm">Широта</span>
            <input className="border rounded px-3 py-2" name="latitude" type="number" step="any" required />
          </label>
          <label className="grid gap-1">
            <span className="text-sm">Долгота</span>
            <input className="border rounded px-3 py-2" name="longitude" type="number" step="any" required />
          </label>
        </div>
        <label className="grid gap-1">
          <span className="text-sm">Адрес</span>
          <input className="border rounded px-3 py-2" name="address" />
        </label>
        <LocationPicker />
        <div>
          <button className="bg-black text-white px-4 py-2 rounded">Добавить</button>
        </div>
      </form>
      <ul className="grid gap-3">
        {cinemas.map((c) => (
          <li key={c.id} className="border rounded p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{c.name}</div>
              {c.website && (
                <a className="text-xs underline" href={c.website} target="_blank" rel="noreferrer">{c.website}</a>
              )}
            </div>
            <form action={deleteCinema.bind(null, c.id)}>
              <button className="text-sm text-red-600">Удалить</button>
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}

function LocationPicker() {
  "use client";
  const { MapContainer, TileLayer, Marker, useMapEvents } = require("react-leaflet");
  const React = require("react");
  const [pos, setPos] = (React.useState as typeof import("react").useState<[number, number] | null>)([
    52.034, 113.499,
  ]);
  const [query, setQuery] = (React.useState as typeof import("react").useState<string>)("");

  function ClickHandler() {
    useMapEvents({
      click(e: any) {
        setPos([e.latlng.lat, e.latlng.lng]);
        const lat = document.querySelector<HTMLInputElement>("input[name='latitude']");
        const lng = document.querySelector<HTMLInputElement>("input[name='longitude']");
        if (lat && lng) {
          lat.value = String(e.latlng.lat);
          lng.value = String(e.latlng.lng);
        }
      },
    });
    return null;
  }

  const search = async () => {
    if (!query) return;
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&accept-language=ru`);
    const data = await res.json();
    if (data && data[0]) {
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);
      setPos([lat, lon]);
      const latI = document.querySelector<HTMLInputElement>("input[name='latitude']");
      const lngI = document.querySelector<HTMLInputElement>("input[name='longitude']");
      if (latI && lngI) {
        latI.value = String(lat);
        lngI.value = String(lon);
      }
    }
  };

  return (
    <div className="grid gap-2">
      <label className="text-sm">Поиск адреса</label>
      <div className="flex gap-2">
        <input className="border rounded px-3 py-2 w-full" value={query} onChange={(e: any) => setQuery(e.target.value)} placeholder="Введите адрес" />
        <button className="px-4 py-2 rounded bg-gray-800 text-white" type="button" onClick={search}>Найти</button>
      </div>
      <div className="h-80 rounded overflow-hidden">
        <MapContainer center={pos || [52.034, 113.499]} zoom={10} className="h-full w-full" attributionControl={false}>
          <TileLayer url={process.env.NEXT_PUBLIC_MAP_TILE_URL || "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"} />
          <ClickHandler />
          {pos && <Marker position={pos} />}
        </MapContainer>
      </div>
      <p className="text-xs text-gray-600">Нажмите на карту, чтобы поставить метку. Координаты подставятся автоматически.</p>
    </div>
  );
}


