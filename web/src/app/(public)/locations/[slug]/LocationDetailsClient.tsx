"use client";
import { MapPin } from "lucide-react";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { Location } from '@prisma/client';

type Props = {
  location: Location;
};

export default function LocationDetailsClient({ location }: Props) {
  const galleryUrls = location.galleryUrls as string[] | null;

  return (
    <main className="container mx-auto px-6 py-10 grid gap-6">
      <h1 className="text-2xl font-semibold">{location.name}</h1>
      
      {location.address && (
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin size={16} />
          {location.address}
        </div>
      )}

      {galleryUrls && galleryUrls.length > 0 && (
        <div className="grid gap-4">
          <div 
            className="aspect-video rounded bg-center bg-cover" 
            style={{ backgroundImage: `url(${galleryUrls[0]})` }} 
          />
          {galleryUrls.length > 1 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryUrls.slice(1).map((url, index) => (
                <div
                  key={index}
                  className="aspect-video rounded bg-cover bg-center"
                  style={{ backgroundImage: `url(${url})` }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {location.description && (
        <article className="prose max-w-none">
          {location.description}
        </article>
      )}

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Расположение на карте</h2>
        <div className="h-[400px] rounded overflow-hidden card-solid">
          <YMaps query={{ lang: "ru_RU" }}>
            <Map 
              defaultState={{ 
                center: [location.latitude, location.longitude], 
                zoom: 15 
              }} 
              width="100%" 
              height="100%"
            >
              <Placemark 
                geometry={[location.latitude, location.longitude]} 
                properties={{ 
                  iconCaption: location.name,
                  balloonContent: `
                    <div class="font-medium">${location.name}</div>
                    ${location.address ? `<div class="text-sm">${location.address}</div>` : ''}
                  `
                }} 
              />
            </Map>
          </YMaps>
        </div>
      </div>
    </main>
  );
}
