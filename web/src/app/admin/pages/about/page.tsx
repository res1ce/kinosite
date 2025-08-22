import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import BackButton from "@/components/BackButton";

async function updateAboutPage(formData: FormData) {
  "use server";
  const content = String(formData.get("content") || "").trim();
  if (!content) return;
  await prisma.page.upsert({
    where: { slug: "about" },
    create: { slug: "about", title: "О нас", content, isPublished: true },
    update: { content },
  });
  revalidatePath("/about"); revalidatePath("/admin/pages");
}

export default async function AdminAboutPage() {
  const aboutPage = await prisma.page.findUnique({ where: { slug: "about" } });

  return (
    <main className="grid gap-6">
      <div className="flex items-center justify-center">
        <h1 className="text-2xl font-bold">О нас</h1>
      </div>

      <form action={updateAboutPage} className="rounded-2xl shadow-sm bg-white dark:bg-[#111] p-6 grid gap-4">
        <div className="grid gap-1.5">
          <label className="text-sm font-medium">Содержание страницы (HTML разрешён)</label>
          <textarea
            name="content" rows={20} defaultValue={aboutPage?.content} required
            className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-black/20
                       focus:outline-none focus:ring-2 focus:ring-[#6E0A6B]/60"
          />
        </div>
        <div>
          <button type="submit" className="px-4 py-2 rounded-lg bg-[#6E0A6B] text-white hover:brightness-110 active:scale-95 transition">
            Сохранить
          </button>
        </div>
      </form>
    </main>
  );
}
