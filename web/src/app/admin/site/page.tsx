// app/admin/site/page.tsx
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import BackButton from "@/components/BackButton"; // если у вас есть компонент, иначе уберите импорт

async function updateSiteContent(formData: FormData) {
  "use server";
  const heroText = String(formData.get("heroText") || "").trim();

  const f1Number = String(formData.get("feature1Number") || "").trim();
  const f1Label = String(formData.get("feature1Label") || "").trim();

  const f2Number = String(formData.get("feature2Number") || "").trim();
  const f2Label = String(formData.get("feature2Label") || "").trim();

  const f3Number = String(formData.get("feature3Number") || "").trim();
  const f3Label = String(formData.get("feature3Label") || "").trim();

  const footerDescription = String(formData.get("footerDescription") || "").trim();
  const footerContacts = String(formData.get("footerContacts") || "").trim();

  const contactPhone = String(formData.get("contactPhone") || "").trim();
  const contactEmail = String(formData.get("contactEmail") || "").trim();

  // Простая валидация — если пусто, подставим пустые строки
  await prisma.siteContent.upsert({
    where: { slug: "main" },
    create: {
      slug: "main",
      heroText: heroText || "Организуем съёмки, подбираем локации и сопровождаем проекты в регионе.",
      feature1Number: f1Number || "250+",
      feature1Label: f1Label || "Локаций в каталоге",
      feature2Number: f2Number || "50+",
      feature2Label: f2Label || "Партнёрских проектов",
      feature3Number: f3Number || "15 лет",
      feature3Label: f3Label || "поддержки киноиндустрии",
      footerDescription: footerDescription || "Помощь в организации съёмок и продвижении региона.",
      footerContacts: footerContacts || "Чита, Забайкальский край\ninfo@kino.ru",
      contactPhone: contactPhone || "+7 (999) 123-45-67",
      contactEmail: contactEmail || "info@kino.ru",
    },
    update: {
      heroText,
      feature1Number: f1Number,
      feature1Label: f1Label,
      feature2Number: f2Number,
      feature2Label: f2Label,
      feature3Number: f3Number,
      feature3Label: f3Label,
      footerDescription,
      footerContacts,
      contactPhone,
      contactEmail,
    },
  });

  // Обновляем кэш/ISR для нужных страниц
  revalidatePath("/");
  revalidatePath("/admin");
}

export default async function AdminSitePage() {
  const site = await prisma.siteContent.findUnique({ where: { slug: "main" } });

  return (
    <main className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Редактирование контента главной и подвала</h1>
      </div>

      <form
        action={updateSiteContent}
        className="rounded-2xl shadow-sm bg-white dark:bg-[#111] p-6 grid gap-6 max-w-3xl"
      >
        <section className="grid gap-2">
          <h2 className="text-lg font-semibold">Hero</h2>
          <label className="text-sm font-medium">Текст в hero</label>
          <textarea
            name="heroText"
            rows={3}
            defaultValue={site?.heroText}
            className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-[#6E0A6B]/60"
          />
        </section>

        <section className="grid gap-2">
          <h2 className="text-lg font-semibold">Блоки (Features)</h2>

          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Число / 1</label>
              <input name="feature1Number" defaultValue={site?.feature1Number} className="w-full rounded-lg border px-3 py-2" />
            </div>
            <div>
              <label className="text-sm font-medium">Подпись / 1</label>
              <input name="feature1Label" defaultValue={site?.feature1Label} className="w-full rounded-lg border px-3 py-2" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Число / 2</label>
              <input name="feature2Number" defaultValue={site?.feature2Number} className="w-full rounded-lg border px-3 py-2" />
            </div>
            <div>
              <label className="text-sm font-medium">Подпись / 2</label>
              <input name="feature2Label" defaultValue={site?.feature2Label} className="w-full rounded-lg border px-3 py-2" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Число / 3</label>
              <input name="feature3Number" defaultValue={site?.feature3Number} className="w-full rounded-lg border px-3 py-2" />
            </div>
            <div>
              <label className="text-sm font-medium">Подпись / 3</label>
              <input name="feature3Label" defaultValue={site?.feature3Label} className="w-full rounded-lg border px-3 py-2" />
            </div>
          </div>
        </section>

        <section className="grid gap-2">
          <h2 className="text-lg font-semibold">Подвал</h2>
          <label className="text-sm font-medium">Описание (строка)</label>
          <input
            name="footerDescription"
            defaultValue={site?.footerDescription}
            className="w-full rounded-lg border px-3 py-2"
          />
          <label className="text-sm font-medium">Контакты (можно через перенос строки)</label>
          <textarea
            name="footerContacts"
            rows={3}
            defaultValue={site?.footerContacts}
            className="w-full rounded-lg border px-3 py-2"
          />
        </section>

        <section className="grid gap-2">
          <h2 className="text-lg font-semibold">Обратная связь</h2>
          <label className="text-sm font-medium">Номер телефона</label>
          <input
            name="contactPhone"
            defaultValue={site?.contactPhone}
            className="w-full rounded-lg border px-3 py-2"
          />
          <label className="text-sm font-medium">Email для писем</label>
          <input
            name="contactEmail"
            type="email"
            defaultValue={site?.contactEmail}
            className="w-full rounded-lg border px-3 py-2"
          />
        </section>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-[#6E0A6B] text-white hover:brightness-110 active:scale-95 transition"
          >
            Сохранить
          </button>
          <span className="text-sm text-gray-500">Изменения применятся на главной странице.</span>
        </div>
      </form>
    </main>
  );
}
