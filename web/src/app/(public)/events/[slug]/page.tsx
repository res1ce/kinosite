import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export default async function EventDetailsPage({ params }: Props) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({ where: { slug } });
  if (!event || !event.isPublished) return notFound();
  return (
    <main className="container mx-auto px-6 py-10 grid gap-6">
      <h1 className="text-2xl font-semibold">{event.title}</h1>
      {event.coverImageUrl && (
        <div className="aspect-video rounded bg-cover bg-center" style={{ backgroundImage: `url(${event.coverImageUrl})` }} aria-hidden />
      )}
      <article className="prose max-w-none" dangerouslySetInnerHTML={{ __html: event.content }} />
    </main>
  );
}


