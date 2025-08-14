import { placeholderEvents } from "@/lib/placeholders";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export default async function EventDetailsPage({ params }: Props) {
  const { slug } = await params;
  const event = placeholderEvents.find((e) => e.slug === slug);
  if (!event) return notFound();
  return (
    <main className="container mx-auto px-6 py-10 grid gap-6">
      <h1 className="text-2xl font-semibold">{event.title}</h1>
      <div className="relative rounded overflow-hidden reveal">
        <div className="aspect-video bg-cover bg-center" style={{ backgroundImage: `url(${event.coverImageUrl || "/window.svg"})` }} aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
      {Array.isArray(event.galleryUrls as any) && (event.galleryUrls as any[]).length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {(event.galleryUrls as any[]).map((u, idx) => (
            <img key={idx} src={u as any} alt="" className="w-full h-28 md:h-36 object-cover rounded" />
          ))}
        </div>
      )}
      <article className="prose max-w-none reveal" dangerouslySetInnerHTML={{ __html: event.content }} />
    </main>
  );
}


