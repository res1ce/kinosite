"use client";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { useEffect, useState } from "react";
import { placeholderCinemas } from "@/lib/placeholders";

type Cinema = {
  id: string;
  name: string;
  website: string | null;
  latitude: number;
  longitude: number;
  address: string | null;
  logoUrl?: string | null;
};

export default function CinemasPage() {
  const [cinemas, setCinemas] = useState<Cinema[]>([]);

  useEffect(() => {
    setCinemas(placeholderCinemas as any);
  }, []);

  return (
    <main className="container mx-auto px-6 py-10 grid gap-6">
      <h1 className="text-2xl font-semibold">Кинотеатры-партнёры</h1>
      <div className="h-[70vh] rounded overflow-hidden bg-grid reveal card-solid">
        <YMaps query={{ lang: "ru_RU" }}>
          <Map defaultState={{ center: [52.034, 113.499], zoom: 6 }} width="100%" height="100%">
            {cinemas.map((c) => (
              <Placemark key={c.id} geometry={[c.latitude, c.longitude]} properties={{ iconCaption: c.name }} />
            ))}
          </Map>
        </YMaps>
      </div>

      <div className="grid md:grid-cols-3 gap-4 reveal">
        {cinemas.map((c) => (
          <a key={c.id} href={c.website || "#"} className="rounded p-4 card-solid flex items-center gap-3 hover-tilt">
            {c.logoUrl && <img src={c.logoUrl} alt="" className="h-10 w-10 object-contain" />}
            <div>
              <div className="font-medium">{c.name}</div>
              {c.address && <div className="text-xs text-gray-600">{c.address}</div>}
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}


