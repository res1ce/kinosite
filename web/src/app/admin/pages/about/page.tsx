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
          <button type="submit" className="inline-flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> 
                  <>
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                    <polyline points="17 21 17 13 7 13 7 21"/>
                    <polyline points="7 3 7 8 15 8"/>
                  </>
              </svg>
              Сохранить
          </button>
        </div>
      </form>
    </main>
  );
}
