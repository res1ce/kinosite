import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function updateAboutPage(formData: FormData) {
  "use server";
  const content = String(formData.get("content") || "").trim();
  if (!content) return;

  const aboutPage = await prisma.page.upsert({
    where: { slug: "about" },
    create: {
      slug: "about",
      title: "О нас",
      content,
      isPublished: true
    },
    update: { content }
  });

  revalidatePath("/about");
  revalidatePath("/admin/pages");
}

export default async function AdminAboutPage() {
  const aboutPage = await prisma.page.findUnique({
    where: { slug: "about" }
  });

  return (
    <main className="grid gap-8">
      <h1 className="text-xl font-semibold">О нас</h1>
      
      <form action={updateAboutPage} className="grid gap-3">
        <div className="grid gap-1">
          <label className="text-sm">Содержание страницы (HTML разрешён)</label>
          <textarea 
            className="border rounded px-3 py-2" 
            name="content" 
            rows={20} 
            defaultValue={aboutPage?.content}
            required 
          />
        </div>
        <div>
          <button className="bg-black text-white px-4 py-2 rounded">Сохранить</button>
        </div>
      </form>
    </main>
  );
}
