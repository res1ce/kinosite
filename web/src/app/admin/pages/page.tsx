import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import BackButton from "@/components/BackButton";

async function upsertPage(formData: FormData) {
  "use server";
  const slug = String(formData.get("slug") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const content = String(formData.get("content") || "").trim();
  if (!slug || !title) return;
  await prisma.page.upsert({
    where: { slug },
    create: { slug, title, content },
    update: { title, content },
  });
  revalidatePath(`/pages/${slug}`);
  if (slug === "about") revalidatePath("/about");
}

export default async function AdminPagesPage() {
  const pages = await prisma.page.findMany({ orderBy: { slug: "asc" } });
  return (
    <main className="container mx-auto py-6 px-4">
      <div className="mb-4">
        <BackButton />
      </div>
      <h1 className="text-2xl font-bold mb-8">Страницы</h1>
      <form action={upsertPage} className="grid gap-3 border rounded p-4">
        <div className="grid md:grid-cols-2 gap-3">
          <label className="grid gap-1">
            <span className="text-sm">Слаг</span>
            <input className="border rounded px-3 py-2" name="slug" placeholder="about | anti-corruption | prosecutor" required />
          </label>
          <label className="grid gap-1">
            <span className="text-sm">Заголовок</span>
            <input className="border rounded px-3 py-2" name="title" required />
          </label>
        </div>
        <label className="grid gap-1">
          <span className="text-sm">Контент (HTML разрешён)</span>
          <textarea className="border rounded px-3 py-2" name="content" rows={6} />
        </label>
        <div>
          <button className="bg-black text-white px-4 py-2 rounded">Сохранить</button>
        </div>
      </form>
      <ul className="grid gap-3">
        {pages.map((p) => (
          <li key={p.id} className="border rounded p-4">
            <div className="font-medium">{p.title}</div>
            <div className="text-xs text-gray-600">/{p.slug}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}


