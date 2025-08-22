import { getLocations, createLocation, updateLocation, deleteLocation } from "@/app/api/locations/actions";
import { prisma } from "@/lib/prisma";
import SectionTopbar from "@/components/SectionTopbar";
import LocationsClient from "./LocationsClient";

export default async function AdminLocationsPage() {
  const [rawLocations, counters] = await Promise.all([
    getLocations(),
    Promise.all([
      (async () => ({ label: "Всего локаций", value: await prisma.location.count() }))(),
      (async () => ({ label: "Всего новостей", value: await prisma.event.count() }))(),
      (async () => ({ label: "Документов", value: await prisma.document.count() }))(),
      (async () => ({
        label: "Обновлено за 7 дней",
        value: await prisma.location.count({
          where: { updatedAt: { gte: new Date(Date.now() - 7 * 864e5) } },
        }),
      }))(),
    ]),
  ]);

  // 🔧 нормализация данных
  const locations = rawLocations.map(l => ({
    ...l,
    galleryUrls: Array.isArray(l.galleryUrls) ? (l.galleryUrls as string[]) : null,
    createdAt: l.createdAt instanceof Date ? l.createdAt : new Date(l.createdAt),
    updatedAt: l.updatedAt instanceof Date ? l.updatedAt : new Date(l.updatedAt),
  }));

  return (
    <main className="grid gap-6">
      <SectionTopbar title="Локации" counters={counters} />
      <LocationsClient
        locations={locations}
        createLocation={createLocation}
        updateLocation={updateLocation}
        deleteLocation={deleteLocation}
      />
    </main>
  );
}
