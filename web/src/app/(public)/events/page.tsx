import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const revalidate = 60;

export default async function EventsPage() {
  const events = await prisma.event.findMany({ where: { isPublished: true }, orderBy: { date: "desc" } });
  return (
    <main className="container mx-auto px-6 py-10 grid gap-8">
      <h1 className="text-2xl font-semibold">Проведённые мероприятия</h1>
      <ul className="grid md:grid-cols-3 gap-6">
        {events.map((e) => (
          <li key={e.id} className="border rounded overflow-hidden">
            {e.coverImageUrl && (
              <div className="aspect-video bg-cover bg-center" style={{ backgroundImage: `url(${e.coverImageUrl})` }} aria-hidden />
            )}
            <div className="p-4 grid gap-2">
              <h2 className="font-medium text-lg">{e.title}</h2>
              <p className="text-sm text-gray-600 line-clamp-3">{e.shortDescription}</p>
              <Link className="text-sm underline" href={`/events/${e.slug}`}>Подробнее</Link>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}


