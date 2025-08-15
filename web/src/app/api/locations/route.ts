import { prisma } from "@/lib/prisma";

export async function GET() {
  const locations = await prisma.location.findMany({ where: { isPartner: true } });
  return Response.json(locations);
}


