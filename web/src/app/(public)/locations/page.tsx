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
    <main className="container mx-auto px-6 py-10 grid gap-6">
      <h1 className="text-2xl font-semibold">Локации</h1>
      <div className="grid md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2 h-[70vh] rounded overflow-hidden card-solid reveal">
          <YMaps query={{ lang: "ru_RU" }}>
            <Map defaultState={{ center: [52.034, 113.499], zoom: 7 }} width="100%" height="100%">
              {locations.map((l) => (
                <Placemark 
                  key={l.id} 
                  geometry={[l.latitude, l.longitude]} 
                  properties={{ 
                    iconCaption: l.name,
                    balloonContent: `
                      <div class="font-medium">${l.name}</div>
                      ${l.description ? `<div class="text-sm">${l.description}</div>` : ''}
                    `
                  }} 
                />
              ))}
            </Map>
          </YMaps>
        </div>
        <ul className="grid gap-3 max-h-[70vh] overflow-auto pr-2">
          {locations.map((l) => (
            <li key={l.id} className="card-solid rounded p-3 reveal">
              <Link 
                className="font-medium underline flex items-center gap-2" 
                href={`/locations/${l.id}`}
              >
                <MapPin size={16} /> {l.name}
              </Link>
              {l.description && (
                <div className="text-xs text-gray-600 mt-1">{l.description}</div>
              )}
              {l.address && (
                <div className="text-xs text-gray-500 mt-1">{l.address}</div>
              )}
            </li>
          ))}
          {locations.length === 0 && (
            <li className="text-center text-gray-500 py-8">
              Локации загружаются...
            </li>
          )}
        </ul>
      </div>
    </main>
  );
}


