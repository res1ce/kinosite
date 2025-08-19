import { prisma } from '@/lib/prisma'
import { notFound } from "next/navigation";
import LocationDetailsClient from './LocationDetailsClient'

type Props = { params: { slug: string } };

export default async function LocationDetails({ params }: Props) {
  const location = await prisma.location.findUnique({
    where: {
      id: params.slug
    }
  });

  if (!location) {
    return notFound();
  }

  return <LocationDetailsClient location={location} />;
}



