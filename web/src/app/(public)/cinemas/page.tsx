"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

type Cinema = {
  id: string;
  name: string;
  website: string | null;
  latitude: number;
  longitude: number;
  address: string | null;
};

export default function CinemasPage() {
  const [cinemas, setCinemas] = useState<Cinema[]>([]);

  useEffect(() => {
    fetch("/api/cinemas").then((r) => r.json()).then(setCinemas).catch(() => setCinemas([]));
  }, []);

  return (
    <main className="container mx-auto px-6 py-10 grid gap-6">
      <h1 className="text-2xl font-semibold">Кинотеатры-партнёры</h1>
      <div className="h-[70vh] rounded overflow-hidden">
        <MapContainer center={[55.751244, 37.618423]} zoom={5} className="h-full w-full">
          <TileLayer url={process.env.NEXT_PUBLIC_MAP_TILE_URL || "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"} />
          {cinemas.map((c) => (
            <Marker key={c.id} position={[c.latitude, c.longitude]}>
              <Popup>
                <div className="grid gap-1">
                  <div className="font-medium">{c.name}</div>
                  {c.address && <div className="text-xs text-gray-600">{c.address}</div>}
                  {c.website && (
                    <a href={c.website} target="_blank" rel="noreferrer" className="text-sm underline">Перейти на сайт</a>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </main>
  );
}


