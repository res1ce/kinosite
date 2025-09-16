import { prisma } from "@/lib/prisma";
import NewsClient from "./NewsClient";

export default async function NewsPage() {
  const events = await prisma.event.findMany({
    where: { isPublished: true },
    orderBy: { date: "desc" },
  });

  return <NewsClient events={events} />;
}
