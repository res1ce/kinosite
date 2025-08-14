// placeholder mode
import { placeholderEvents } from "@/lib/placeholders";
import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";

export const revalidate = 0;

export default async function EventsPage() {
  const events = placeholderEvents;
  return (
    <main className="container mx-auto px-6 py-10 grid gap-8">
      <h1 className="text-2xl font-semibold">Проведённые мероприятия</h1>
      <ul className="grid md:grid-cols-3 gap-6">
        {events.map((e) => (
          <li key={e.id} className="rounded overflow-hidden card-solid reveal hover-tilt">
            <div className="relative group">
              <div className="aspect-video bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.03]" style={{ backgroundImage: `url(${e.coverImageUrl || "/window.svg"})` }} aria-hidden />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="p-4 grid gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="chip chip-neutral"><CalendarDays size={14} /> {new Date(e.date).toLocaleDateString("ru-RU")}</span>
                {e.location && <span className="chip chip-neutral"><MapPin size={14} /> {e.location}</span>}
              </div>
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


