import { prisma } from "@/lib/prisma";
import NewsClient from "./NewsClient";

export const revalidate = 60;

export default async function NewsPage() {
  const rawEvents = await prisma.event.findMany({
    where: { isPublished: true },
    orderBy: { date: "desc" },
  });

  // Преобразуем данные для совместимости с клиентским компонентом
  const events = rawEvents.map(event => ({
    ...event,
    date: event.date.toISOString(), // Преобразуем Date в string
    createdAt: event.createdAt.toISOString(), // Если нужно
    updatedAt: event.updatedAt.toISOString(), // Если нужно
    galleryUrls: Array.isArray(event.galleryUrls) 
      ? event.galleryUrls as string[]
      : event.galleryUrls 
        ? JSON.parse(event.galleryUrls as string) 
        : null
  }));

  return <NewsClient events={events} />;
}