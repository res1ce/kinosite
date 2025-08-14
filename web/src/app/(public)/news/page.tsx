import Link from "next/link";
import { placeholderNews } from "@/lib/placeholders";
import { CalendarDays } from "lucide-react";

export const revalidate = 0;

export default async function NewsPage() {
  const news = placeholderNews;
  return (
    <main className="container mx-auto px-6 py-10 grid gap-6">
      <h1 className="text-2xl font-semibold">Новости</h1>
      <ul className="grid md:grid-cols-3 gap-6">
        {news.map((n) => (
          <li key={n.id} className="rounded overflow-hidden card-solid reveal hover-tilt">
            <div className="aspect-video bg-center bg-cover" style={{ backgroundImage: `url(${n.coverImageUrl || "/window.svg"})` }} />
            <div className="p-4 grid gap-2">
              <div className="chip chip-neutral flex items-center gap-2"><CalendarDays size={14} /> {new Date(n.date).toLocaleDateString("ru-RU")}</div>
              <h2 className="font-medium text-lg">{n.title}</h2>
              <p className="text-sm text-gray-600 line-clamp-3">{n.shortDescription}</p>
              <Link className="text-sm underline" href={`/news/${n.slug}`}>Подробнее</Link>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}


