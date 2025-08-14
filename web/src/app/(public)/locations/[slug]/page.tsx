import { placeholderLocations } from "@/lib/placeholders";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export default async function LocationDetails({ params }: Props) {
  const { slug } = await params;
  const loc = placeholderLocations.find((l) => l.slug === slug);
  if (!loc) return notFound();
  return (
    <main className="container mx-auto px-6 py-10 grid gap-6">
      <h1 className="text-2xl font-semibold">{loc.name}</h1>
      <div className="aspect-video rounded bg-center bg-cover" style={{ backgroundImage: `url(${loc.logoUrl || "/window.svg"})` }} />
      <article className="prose max-w-none" dangerouslySetInnerHTML={{ __html: loc.content }} />
    </main>
  );
}


