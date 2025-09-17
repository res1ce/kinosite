// page.tsx "Локации slug" 
import { prisma } from '@/lib/prisma'
import { notFound } from "next/navigation";
import LocationDetailsClient from './LocationDetailsClient'

type Props = {
  params: { slug: string }
};

export default async function LocationDetails({ params }: Props) {
  // Исправляем поиск по slug вместо id
  const location = await prisma.location.findUnique({
    where: { 
      slug: params.slug,
      // Можно добавить дополнительные условия если нужно
    }
  });

  if (!location) return notFound();

  // Преобразуем данные для совместимости с клиентским компонентом
  const locationData = {
    ...location,
    galleryUrls: Array.isArray(location.galleryUrls) 
      ? location.galleryUrls as string[]
      : location.galleryUrls ? JSON.parse(location.galleryUrls as string) : null
  };

  return <LocationDetailsClient location={locationData} />;
}