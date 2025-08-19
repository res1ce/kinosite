import { notFound } from "next/navigation";
import { prisma } from '@/lib/prisma'
import { CalendarDays, MapPin } from "lucide-react";

type Props = { params: Promise<{ slug: string }> };

export default async function NewsDetails({ params }: Props) {
  const { slug } = await params;
  
  const item = await prisma.event.findFirst({
    where: {
      slug: slug,
      isPublished: true
    }
  });

  if (!item) return notFound();

  return (
    <main className="container mx-auto px-6 py-10 grid gap-6">
      <h1 className="text-2xl font-semibold">{item.title}</h1>
      
      <div className="flex gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <CalendarDays size={16} />
          {new Date(item.date).toLocaleDateString("ru-RU")}
        </div>
        {item.location && (
          <div className="flex items-center gap-1">
            <MapPin size={16} />
            {item.location}
          </div>
        )}
      </div>

      {item.coverImageUrl && (
        <div 
          className="aspect-video rounded bg-cover bg-center" 
          style={{ backgroundImage: `url(${item.coverImageUrl})` }} 
          aria-hidden 
        />
      )}

      <article 
        className="prose max-w-none" 
        dangerouslySetInnerHTML={{ __html: item.content }} 
      />

      {item.galleryUrls && (Array.isArray(item.galleryUrls) && item.galleryUrls.length > 0) && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Галерея</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {(item.galleryUrls as string[]).map((url, index) => (
              <div
                key={index}
                className="aspect-video rounded bg-cover bg-center"
                style={{ backgroundImage: `url(${url})` }}
              />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}


