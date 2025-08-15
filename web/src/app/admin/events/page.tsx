import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import EventForm from "@/components/EventForm";

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

async function updateEvent(id: string, formData: FormData) {
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
  
  const event = await prisma.event.update({
    where: { id },
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
  revalidatePath(`/events/${event.slug}`);
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
      <EventForm onSubmit={createEvent} />

      <div className="grid gap-3">
        {events.map((event) => (
          <div key={event.id} className="border rounded-lg overflow-hidden">
            <div className="p-4">
              <div className="flex gap-4">
                {event.coverImageUrl && (
                  <img src={event.coverImageUrl} alt="" className="h-24 w-24 object-cover rounded" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{event.title}</div>
                  <div className="text-sm text-gray-600 mt-1 line-clamp-2">{event.shortDescription}</div>
                  <div className="text-xs text-gray-500 mt-2 space-y-1">
                    <div>URL: /{event.slug}</div>
                    <div>Дата: {new Date(event.date).toLocaleDateString()}</div>
                    {event.location && <div>Место: {event.location}</div>}
                  </div>
                </div>
                <div className="flex gap-2 items-start">
                  <form action={updateEvent.bind(null, event.id)}>
                    <button type="submit" className="text-sm text-blue-600 hover:text-blue-700">
                      Изменить
                    </button>
                  </form>
                  <form action={deleteEvent.bind(null, event.id)}>
                    <button className="text-sm text-red-600 hover:text-red-700">
                      Удалить
                    </button>
                  </form>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 flex gap-2 overflow-auto">
              {event.galleryUrls && Array.isArray(event.galleryUrls) &&
                event.galleryUrls
                  .filter((url): url is string => typeof url === "string")
                  .map((url) => (
                    <img key={url} src={url} alt="" className="h-16 w-16 object-cover rounded flex-shrink-0" />
                  ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

// uploader вынесен в отдельный клиентский компонент


