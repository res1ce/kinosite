// page.tsx "Новость slug"
import { notFound } from "next/navigation";
import { prisma } from '@/lib/prisma'
import { CalendarDays, MapPin } from "lucide-react";

type Props = { params: Promise<{ slug: string }> };

export default async function NewsDetails({ params }: Props) {
  const { slug } = await params;

  const item = await prisma.event.findFirst({
    where: { slug, isPublished: true }
  });

  if (!item) return notFound();

  return (
    <main className="grid">
      {/* Hero cover */}
      <div className="relative h-[38vh] min-h-[280px] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: `url(${item.coverImageUrl || "/window.svg"})` }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="container mx-auto px-6 h-full flex items-end pb-8 relative z-10">
          <div className="flex flex-col gap-3 text-white max-w-4xl">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">{item.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-white/90">
              <span className="inline-flex items-center gap-2"><CalendarDays size={16} /> {new Date(item.date).toLocaleDateString("ru-RU")}</span>
              {item.location && <span className="inline-flex items-center gap-2"><MapPin size={16} /> {item.location}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-10">
        <article
          className="prose prose-lg max-w-none prose-slate dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: item.content }}
        />
        {item.galleryUrls && Array.isArray(item.galleryUrls) && item.galleryUrls.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Галерея</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {(item.galleryUrls as string[]).map((url, index) => (
                <div key={index} className="aspect-video rounded-lg bg-cover bg-center shadow-sm" style={{ backgroundImage: `url(${url})` }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
