// page.tsx "Новости"
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { prisma } from '@/lib/prisma'

export const revalidate = 0;

export default async function NewsPage() {
  const news = await prisma.event.findMany({
    where: { isPublished: true },
    orderBy: { date: 'desc' }
  });

  return (
    <main className="container mx-auto px-6 py-20 grid gap-8">
      <header className="section-hero">
        <h1 className="section-title">Новости</h1>
        <p className="section-subtitle">События, анонсы и отчёты кинокомиссии</p>
      </header>

<ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
  {news.map((n, i) => (
    <li
      key={n.id}
      className="group animate-fadeUp"
      style={{ animationDelay: `${i * 0.06}s` }}
    >
      <Link
        href={`/news/${n.slug}`}
        className="block overflow-hidden rounded-2xl shadow-md bg-white dark:bg-[#111] hover:shadow-xl transition"
      >
        {/* Картинка */}
        <div className="relative h-56 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            style={{ backgroundImage: `url(${n.coverImageUrl || "/window.svg"})` }}
          />
          {/* Дата */}
          <span className="absolute top-4 left-4 px-3 py-1 text-xs rounded-full bg-[#6E0A6B] text-white flex items-center gap-1 shadow">
            <CalendarDays size={14} />
            {new Date(n.date).toLocaleDateString("ru-RU")}
          </span>
        </div>

        {/* Контент */}
        <div className="p-5 space-y-3">
          <h2 className="font-semibold text-lg leading-snug text-gray-900 dark:text-white group-hover:text-[#6E0A6B] transition-colors">
            {n.title}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
            {n.shortDescription}
          </p>
        </div>
      </Link>
    </li>
  ))}
  {news.length === 0 && (
    <li className="col-span-full text-center text-gray-500 py-16">
      Новости пока не добавлены
    </li>
  )}
</ul>

    </main>
  );
}
