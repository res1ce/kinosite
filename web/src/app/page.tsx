import { prisma } from "@/lib/prisma";
import HomeClient from "./HomeClient";

export default async function HomePage() {
  const rawSite = await prisma.siteContent.findUnique({
    where: { slug: "main" },
  });

  const site = rawSite ? {
      ...rawSite,
      regionTitle: rawSite.regionTitle ?? undefined,
      regionDescription: rawSite.regionDescription ?? undefined,
      regionVideoUrl: rawSite.regionVideoUrl ?? undefined,
    } : null;

  return <HomeClient site={site} />;
}
