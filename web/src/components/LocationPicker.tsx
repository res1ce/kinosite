"use client";
import { MapContainer, TileLayer, Marker, useMapEvents, AttributionControl } from "react-leaflet";
import { useState } from "react";

type Props = {
  latName?: string;
  lonName?: string;
  defaultCenter?: [number, number];
};

export default function LocationPicker({ latName = "latitude", lonName = "longitude", defaultCenter = [52.034, 113.499] }: Props) {
  const [pos, setPos] = useState<[number, number] | null>(defaultCenter);
  const [query, setQuery] = useState("");

  function ClickHandler() {
    useMapEvents({
      click(e) {
        const next: [number, number] = [e.latlng.lat, e.latlng.lng];
        setPos(next);
        const lat = document.querySelector<HTMLInputElement>(`input[name='${latName}']`);
        const lng = document.querySelector<HTMLInputElement>(`input[name='${lonName}']`);
        if (lat && lng) {
          lat.value = String(next[0]);
          lng.value = String(next[1]);
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
      const latI = document.querySelector<HTMLInputElement>(`input[name='${latName}']`);
      const lngI = document.querySelector<HTMLInputElement>(`input[name='${lonName}']`);
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
        <input className="border rounded px-3 py-2 w-full" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Введите адрес" />
        <button className="px-4 py-2 rounded bg-gray-800 text-white" type="button" onClick={search}>Найти</button>
      </div>
      <div className="h-80 rounded overflow-hidden">
        <MapContainer center={pos || defaultCenter} zoom={10} className="h-full w-full" attributionControl={false}>
          <TileLayer url={process.env.NEXT_PUBLIC_MAP_TILE_URL || "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"} />
          <AttributionControl position="bottomright" prefix="" />
          <ClickHandler />
          {pos && <Marker position={pos} />}
        </MapContainer>
      </div>
      <p className="text-xs text-gray-600">Нажмите на карту, чтобы поставить метку. Координаты подставятся автоматически.</p>
    </div>
  );
}


