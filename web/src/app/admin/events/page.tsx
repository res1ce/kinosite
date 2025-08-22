import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import EventsClient from "./EventsClient";
import SectionTopbar from "@/components/SectionTopbar";

interface Event {
  id: string; title: string; slug: string;
  shortDescription: string; content: string;
  coverImageUrl: string | null; galleryUrls: string[] | null;
  date: Date; location: string | null;
  createdAt: string | Date; updatedAt: string | Date;
}

async function createEvent(formData: FormData) { "use server";
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
    data: { title, slug, shortDescription, content, coverImageUrl, galleryUrls: galleryUrls ? JSON.parse(galleryUrls) : [], date, location: location || undefined },
  });
  revalidatePath("/events"); revalidatePath(`/events/${slug}`); revalidatePath("/admin/events");
}

async function updateEvent(id: string, formData: FormData) { "use server";
  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const shortDescription = String(formData.get("shortDescription") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const coverImageUrl = String(formData.get("coverImageUrl") || "").trim() || null;
  const galleryUrls = String(formData.get("galleryUrls") || "").trim();
  const date = new Date(String(formData.get("date") || new Date().toISOString()));
  const location = String(formData.get("location") || "").trim() || null;
  if (!title || !slug) return;
  const e = await prisma.event.update({
    where: { id },
    data: { title, slug, shortDescription, content, coverImageUrl, galleryUrls: galleryUrls ? JSON.parse(galleryUrls) : [], date, location: location || undefined },
  });
  revalidatePath("/events"); revalidatePath(`/events/${e.slug}`); revalidatePath("/admin/events");
}

async function deleteEvent(id: string) { "use server";
  const e = await prisma.event.delete({ where: { id } });
  revalidatePath("/events"); revalidatePath(`/events/${e.slug}`); revalidatePath("/admin/events");
}

export default async function AdminEventsPage() {
  const [eventsCount, locationsCount, docsCount] = await Promise.all([
    prisma.event.count(),
    prisma.location.count(),
    prisma.document.count(),
  ]);
    const events = (await prisma.event.findMany({
    orderBy: { createdAt: "desc" },
  })).map(e => ({
    ...e,
    galleryUrls: Array.isArray(e.galleryUrls) ? (e.galleryUrls as string[]) : [],
    date: e.date instanceof Date ? e.date : new Date(e.date),
  }));


  return (
    <main className="grid gap-6">
      <SectionTopbar
        title="Новости"
        counters={[
          { label: "Всего новостей", value: eventsCount },
          { label: "Локаций", value: locationsCount },
          { label: "Документов", value: docsCount },
          { label: "Опубликовано сегодня", value: events.filter(e => new Date(e.createdAt).toDateString() === new Date().toDateString()).length },
        ]}
      />
      <EventsClient
        events={events}
        createEvent={createEvent}
        updateEvent={updateEvent}
        deleteEvent={deleteEvent}
      />
    </main>
  );
}
