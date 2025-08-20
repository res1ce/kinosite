// LocationDetailsClient.tsx "Основной Локации компонент"
"use client";
import { MapPin } from "lucide-react";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { Location } from '@prisma/client';

type Props = { location: Location };

export default function LocationDetailsClient({ location }: Props) {
  const galleryUrls = location.galleryUrls as string[] | null;

  return (
    <main className="grid">
      {/* Banner */}
      {galleryUrls?.[0] ? (
        <div className="relative h-[40vh] min-h-[280px] overflow-hidden">
          <div className="absolute inset-0 bg-center bg-cover" style={{ backgroundImage: `url(${galleryUrls[0]})` }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="container mx-auto px-6 h-full flex items-end pb-8 relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white">{location.name}</h1>
          </div>
        </div>
      ) : (
        <section className="py-12 container mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold">{location.name}</h1>
        </section>
      )}

      <section className="container mx-auto px-6 py-10 grid gap-8">
        {location.address && (
          <div className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-300 chip chip-neutral">
            <MapPin size={16} />
            {location.address}
          </div>
        )}

        {galleryUrls && galleryUrls.length > 0 && (
          <div className="grid gap-4">
            {galleryUrls.length > 1 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryUrls.map((url, index) => (
                  <div key={index} className="aspect-video rounded-lg bg-cover bg-center shadow-sm" style={{ backgroundImage: `url(${url})` }} />
                ))}
              </div>
            )}
          </div>
        )}

        {location.description && (
          <article className="prose max-w-none prose-slate dark:prose-invert">
            {location.description}
          </article>
        )}

        <div>
          <h2 className="text-xl font-semibold mb-4">Расположение на карте</h2>
          <div className="h-[420px] rounded-2xl overflow-hidden card-solid">
            <YMaps query={{ lang: "ru_RU" }}>
              <Map defaultState={{ center: [location.latitude, location.longitude], zoom: 15 }} width="100%" height="100%">
                <Placemark
                  geometry={[location.latitude, location.longitude]}
                  properties={{
                    iconCaption: location.name,
                    balloonContent: `
                      <div class="font-medium">${location.name}</div>
                      ${location.address ? `<div class="text-sm">${location.address}</div>` : ''}
                    `
                  }}
                  options={{
                  preset: "islands#violetIcon", // багульный акцент на карте
                  }}
                />
              </Map>
            </YMaps>
          </div>
        </div>
      </section>
    </main>
  );
}
