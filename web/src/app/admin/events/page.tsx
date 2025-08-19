import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import EventsClient from "./EventsClient";
import BackButton from "@/components/BackButton";

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
    <main className="container mx-auto py-6 px-4">
      <div className="mb-4">
        <BackButton />
      </div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Управление новостями</h1>
      </div>
      <EventsClient
        events={events}
        createEvent={createEvent}
        updateEvent={updateEvent}
        deleteEvent={deleteEvent}
      />
    </main>
  );
}

// uploader вынесен в отдельный клиентский компонент


