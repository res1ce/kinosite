import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function createCinema(formData: FormData) {
  "use server";
  const name = String(formData.get("name") || "").trim();
  const website = String(formData.get("website") || "").trim() || null;
  const latitude = Number(formData.get("latitude"));
  const longitude = Number(formData.get("longitude"));
  const address = String(formData.get("address") || "").trim() || null;
  if (!name || Number.isNaN(latitude) || Number.isNaN(longitude)) return;
  await prisma.cinema.create({ data: { name, website, latitude, longitude, address } });
  revalidatePath("/cinemas");
  revalidatePath("/admin/cinemas");
}

async function deleteCinema(id: string) {
  "use server";
  await prisma.cinema.delete({ where: { id } });
  revalidatePath("/cinemas");
  revalidatePath("/admin/cinemas");
}

export default async function AdminCinemasPage() {
  const cinemas = await prisma.cinema.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <main className="grid gap-8">
      <h1 className="text-xl font-semibold">Кинотеатры</h1>
      <form action={createCinema} className="grid gap-3 border rounded p-4">
        <div className="grid md:grid-cols-2 gap-3">
          <label className="grid gap-1">
            <span className="text-sm">Название</span>
            <input className="border rounded px-3 py-2" name="name" required />
          </label>
          <label className="grid gap-1">
            <span className="text-sm">Сайт</span>
            <input className="border rounded px-3 py-2" name="website" />
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
        <div>
          <button className="bg-black text-white px-4 py-2 rounded">Добавить</button>
        </div>
      </form>
      <ul className="grid gap-3">
        {cinemas.map((c) => (
          <li key={c.id} className="border rounded p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{c.name}</div>
              {c.website && (
                <a className="text-xs underline" href={c.website} target="_blank" rel="noreferrer">{c.website}</a>
              )}
            </div>
            <form action={deleteCinema.bind(null, c.id)}>
              <button className="text-sm text-red-600">Удалить</button>
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}


