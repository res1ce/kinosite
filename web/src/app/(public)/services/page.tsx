import { prisma } from '@/lib/prisma';
import ServicesClient from './ServicesClient';

export const revalidate = 60;

export default async function ServicesPage() {
  const rawServices = await prisma.priceItem.findMany({
    orderBy: { order: 'asc' }
  });

  // Парсим features из JSON
  const services = rawServices.map(service => ({
    ...service,
    features: service.features ? JSON.parse(service.features) : []
  }));

  // Получаем контакты для ContactModal
  const siteContent = await prisma.siteContent.findUnique({
    where: { slug: 'main' }
  });

  return <ServicesClient services={services} siteContent={siteContent} />;
}