import { prisma } from "@/lib/prisma";

export async function GET() {
  const cinemas = await prisma.cinema.findMany({ where: { isPartner: true } });
  return Response.json(cinemas);
}


