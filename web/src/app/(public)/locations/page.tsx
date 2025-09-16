import { prisma } from "@/lib/prisma";
import LocationsClient from "./LocationsClient";

export default async function LocationsPage() {
  const locations = await prisma.location.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <LocationsClient locations={locations} />;
}
