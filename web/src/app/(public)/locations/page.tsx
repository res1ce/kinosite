import { prisma } from '@/lib/prisma'
import LocationsClient from './LocationsClient'

export const revalidate = 60;

export default async function LocationsPage() {
  const rawLocations = await prisma.location.findMany({
    orderBy: { createdAt: 'desc' }
  });

  // Преобразуем данные для совместимости с клиентским компонентом
  const locations = rawLocations.map(location => ({
    ...location,
    galleryUrls: Array.isArray(location.galleryUrls) 
      ? location.galleryUrls as string[]
      : location.galleryUrls 
        ? JSON.parse(location.galleryUrls as string) 
        : null
  }));

  return <LocationsClient locations={locations} />;
}