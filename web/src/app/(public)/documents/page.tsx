import { placeholderPages } from "@/lib/placeholders";

export default async function DocumentsPage() {
  const page = placeholderPages["documents"];
  return (
    <main className="container mx-auto px-6 py-10 grid gap-6">
      <h1 className="text-2xl font-semibold">{page?.title || "Документы"}</h1>
      <article className="prose max-w-none reveal" dangerouslySetInnerHTML={{ __html: page?.content || "" }} />
    </main>
  );
}


