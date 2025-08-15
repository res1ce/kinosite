import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import LocationPickerYandex from "@/components/LocationPickerYandex";
import ImagesUploader from "@/components/ImagesUploader";

async function createLocation(formData: FormData) {
  "use server";
  const name = String(formData.get("name") || "").trim();
  const latitude = Number(formData.get("latitude"));
  const longitude = Number(formData.get("longitude"));
  const address = String(formData.get("address") || "").trim() || null;
  const description = String(formData.get("description") || "").trim();
  const coverImageUrl = String(formData.get("coverImageUrl") || "").trim() || null;
  const galleryUrls = String(formData.get("galleryUrls") || "").trim();
  
  if (!name || Number.isNaN(latitude) || Number.isNaN(longitude)) return;
  
  await prisma.location.create({ 
    data: { 
      name,  
      latitude, 
      longitude, 
      address,
      description,
      galleryUrls: galleryUrls ? JSON.parse(galleryUrls) : undefined,
    } 
  });
  revalidatePath("/locations");
  revalidatePath("/admin/locations");
}

async function deleteLocation(id: string) {
  "use server";
  await prisma.location.delete({ where: { id } });
  revalidatePath("/locations");
  revalidatePath("/admin/locations");
}

export default async function AdminLocationsPage() {
  const locations = await prisma.location.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <main className="grid gap-8">
      <h1 className="text-xl font-semibold">Локации</h1>
      <form action={createLocation} className="grid gap-3 border rounded p-4">
        <div className="grid md:grid-cols-2 gap-3">
          <label className="grid gap-1">
            <span className="text-sm">Название локации</span>
            <input className="border rounded px-3 py-2" name="name" required />
          </label>
          <label className="grid gap-1">
            <span className="text-sm">Широта</span>
            <input className="border rounded px-3 py-2" name="latitude" type="number" step="any" required />
          </label>
          <label className="grid gap-1">
            <span className="text-sm">Долгота</span>
            <input className="border rounded px-3 py-2" name="longitude" type="number" step="any" required />
          </label>
        </div>
        <label className="grid gap-1">
          <span className="text-sm">Адрес</span>
          <input className="border rounded px-3 py-2" name="address" />
        </label>
        <div className="grid gap-1">
          <label className="text-sm">Описание локации</label>
          <textarea className="border rounded px-3 py-2" name="description" rows={4} required />
        </div>
        <div className="grid gap-1">
          <label className="text-sm">Галерея изображений</label>
        </div>
        <ImagesUploader />
        <LocationPickerYandex />
        <div>
          <button className="bg-black text-white px-4 py-2 rounded">Добавить</button>
        </div>
      </form>
      <ul className="grid gap-3">
        {locations.map((loc) => (
          <li key={loc.id} className="border rounded p-4 flex items-center justify-between">
            <div className="grid gap-1">
              <div className="font-medium">{loc.name}</div>
              <div className="text-sm text-gray-600 line-clamp-2">{loc.description}</div>
            </div>
            <form action={deleteLocation.bind(null, loc.id)}>
              <button className="text-sm text-red-600">Удалить</button>
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}




