// page.tsx "Локации"
"use client";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { Location } from '@prisma/client';

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    fetch('/api/locations')
      .then(res => res.json())
      .then(data => setLocations(data))
      .catch(console.error);
  }, []);

  return (
    <main className="container mx-auto px-6 py-20 grid gap-8">
      <header className="section-hero">
        <h1 className="section-title">Локации</h1>
        <p className="section-subtitle">Интерактивная карта и список площадок</p>
      </header>

     <div className="grid lg:grid-cols-3 gap-10 items-start">
  {/* Карта */}
  <div className="lg:col-span-2 h-[75vh] rounded-2xl overflow-hidden shadow-lg">
    <YMaps query={{ lang: "ru_RU" }}>
      <Map
        defaultState={{ center: [52.034, 113.499], zoom: 6 }}
        width="100%"
        height="100%"
      >
        {locations.map((l) => (
          <Placemark
            key={l.id}
            geometry={[l.latitude, l.longitude]}
            properties={{
              iconCaption: l.name,
              balloonContent: `
                <div class="font-semibold">${l.name}</div>
                ${l.description ? `<div class="text-sm text-gray-600">${l.description}</div>` : ""}
                ${l.address ? `<div class="text-xs text-gray-500 mt-1">${l.address}</div>` : ""}
              `,
            }}
            options={{
              preset: "islands#violetIcon", // багульный акцент на карте
            }}
          />
        ))}
      </Map>
    </YMaps>
  </div>

  {/* Список локаций */}
  <ul className="flex flex-col gap-4 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
    {locations.map((l, i) => (
      <li
        key={l.id}
        className="group animate-fadeUp"
        style={{ animationDelay: `${i * 0.05}s` }}
      >
        <Link
          href={`/locations/${l.id}`}
          className="block p-4 rounded-xl bg-white dark:bg-[#111] shadow-md hover:shadow-xl hover:border-[#6E0A6B] border border-transparent transition"
        >
          <div className="flex items-start gap-3">
            {/* Иконка */}
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-[#6E0A6B]/10 text-[#6E0A6B]">
              <MapPin size={18} />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-[#6E0A6B] transition">
                {l.name}
              </h3>
              {l.description && (
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">
                  {l.description}
                </p>
              )}
              {l.address && (
                <p className="text-xs text-gray-500 mt-1">{l.address}</p>
              )}
            </div>
          </div>
        </Link>
      </li>
    ))}

    {locations.length === 0 && (
      <li className="text-center text-gray-500 py-16">
        Локации загружаются…
      </li>
    )}
  </ul>
</div>
    </main>
  );
}
