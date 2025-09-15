import { prisma } from "@/lib/prisma";
import HomeClient from "./HomeClient";

export default async function HomePage() {
  const site = await prisma.siteContent.findUnique({
    where: { slug: "main" },
  });

  return <HomeClient site={site} />;
}
