import { placeholderNews } from "@/lib/placeholders";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export default async function NewsDetails({ params }: Props) {
  const { slug } = await params;
  const item = placeholderNews.find((n) => n.slug === slug);
  if (!item) return notFound();
  return (
    <main className="container mx-auto px-6 py-10 grid gap-6">
      <h1 className="text-2xl font-semibold">{item.title}</h1>
      <div className="aspect-video rounded bg-cover bg-center" style={{ backgroundImage: `url(${item.coverImageUrl || "/window.svg"})` }} aria-hidden />
      <article className="prose max-w-none" dangerouslySetInnerHTML={{ __html: item.content }} />
    </main>
  );
}


