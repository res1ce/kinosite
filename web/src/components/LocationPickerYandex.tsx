"use client";

import { useState } from "react";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";

export default function LocationPickerYandex() {
  const [pos, setPos] = useState<[number, number]>([52.034, 113.499]);
  const [query, setQuery] = useState("");

  const updateCoordinateInputs = (lat: number, lng: number) => {
    const latInput = document.querySelector<HTMLInputElement>("input[name='latitude']");
    const lngInput = document.querySelector<HTMLInputElement>("input[name='longitude']");
    if (latInput && lngInput) {
      latInput.value = String(lat);
      lngInput.value = String(lng);
    }
  };

  const handleMapClick = (e: { get: (key: string) => [number, number] }) => {
    const coords = e.get("coords");
    setPos(coords);
    updateCoordinateInputs(coords[0], coords[1]);
  };

  return (
    <div className="grid gap-2">
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-500"></span>
          Карта для автоматической постанвки координат
      </label>
      <div className="h-80 rounded overflow-hidden">
        <YMaps>
          <Map
            defaultState={{ center: pos, zoom: 10 }}
            width="100%"
            height="100%"
            onClick={handleMapClick}
            modules={["geocode"]}
          >
            <Placemark geometry={pos} />
          </Map>
        </YMaps>
      </div>
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <p className="font-medium mb-1">Как использовать карту:</p>
            <ul className="text-xs space-y-1 text-blue-600 dark:text-blue-400">
              <li>• Кликните по карте, чтобы поставить метку, долгота и широта подставятся автоматически</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
