import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import ImagesUploader from "@/components/ImagesUploader";

async function createEvent(formData: FormData) {
  "use server";
  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const shortDescription = String(formData.get("shortDescription") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const coverImageUrl = String(formData.get("coverImageUrl") || "").trim() || null;
  const galleryUrls = String(formData.get("galleryUrls") || "").trim();
  const date = new Date(String(formData.get("date") || new Date().toISOString()));
  const location = String(formData.get("location") || "").trim() || null;
  if (!title || !slug) return;
  await prisma.event.create({
    data: {
      title,
      slug,
      shortDescription,
      content,
      coverImageUrl,
      galleryUrls: galleryUrls ? JSON.parse(galleryUrls) : undefined,
      date,
      location: location || undefined,
    },
  });
  revalidatePath("/events");
  revalidatePath(`/events/${slug}`);
  revalidatePath("/admin/events");
}

async function deleteEvent(id: string) {
  "use server";
  const e = await prisma.event.delete({ where: { id } });
  revalidatePath("/events");
  revalidatePath(`/events/${e.slug}`);
  revalidatePath("/admin/events");
}

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <main className="grid gap-8">
      <h1 className="text-xl font-semibold">Новости</h1>
      <form action={createEvent} className="grid gap-3 border rounded p-4">
        <div className="grid gap-1">
          <label className="text-sm">Заголовок</label>
          <input className="border rounded px-3 py-2" name="title" required />
        </div>
        <div className="grid gap-1">
          <label className="text-sm">Слаг (URL)</label>
          <input className="border rounded px-3 py-2" name="slug" pattern="[a-z0-9-]+" required />
        </div>
        <div className="grid gap-1">
          <label className="text-sm">Краткое описание</label>
          <textarea className="border rounded px-3 py-2" name="shortDescription" rows={2} required />
        </div>
        <div className="grid gap-1">
          <label className="text-sm">Полное описание (HTML разрешён)</label>
          <textarea className="border rounded px-3 py-2" name="content" rows={6} />
        </div>
        <div className="grid gap-1">
          <label className="text-sm">Обложка (URL)</label>
          <input className="border rounded px-3 py-2" name="coverImageUrl" />
        </div>
        <ImagesUploader />
        <div className="grid md:grid-cols-2 gap-3">
          <div className="grid gap-1">
            <label className="text-sm">Дата</label>
            <input className="border rounded px-3 py-2" name="date" type="datetime-local" />
          </div>
          <div className="grid gap-1">
            <label className="text-sm">Локация</label>
            <input className="border rounded px-3 py-2" name="location" />
          </div>
        </div>
        <div>
          <button className="bg-black text-white px-4 py-2 rounded">Добавить</button>
        </div>
      </form>

      <ul className="grid gap-3">
        {events.map((e) => (
          <li key={e.id} className="border rounded p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{e.title}</div>
              <div className="text-xs text-gray-600">/{e.slug}</div>
            </div>
            <form action={deleteEvent.bind(null, e.id)}>
              <button className="text-sm text-red-600">Удалить</button>
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}

// uploader вынесен в отдельный клиентский компонент


