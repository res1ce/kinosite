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
      <label className="text-sm">Поиск адреса</label>
      <div className="flex gap-2">
        <input 
          className="border rounded px-3 py-2 w-full" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Введите адрес" 
        />
      </div>
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
      <p className="text-xs text-gray-600">
        Нажмите на карту, чтобы поставить метку. Координаты подставятся автоматически.
      </p>
    </div>
  );
}
