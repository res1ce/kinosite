import { prisma } from "@/lib/prisma";

export default async function AntiCorruptionPage() {
  const page = await prisma.page.findUnique({ where: { slug: "anti-corruption" } });
  return (
    <main className="container mx-auto px-6 py-10 grid gap-6">
      <h1 className="text-2xl font-semibold">{page?.title || "Противодействие коррупции"}</h1>
      <article className="prose max-w-none" dangerouslySetInnerHTML={{ __html: page?.content || "" }} />
    </main>
  );
}


