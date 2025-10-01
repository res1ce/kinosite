// app/admin/site/page.tsx
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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

  const regionTitle = String(formData.get("regionTitle") || "").trim();
  const regionDescription = String(formData.get("regionDescription") || "").trim();
  const regionVideoUrl = String(formData.get("regionVideoUrl") || "").trim();

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
      regionTitle: regionTitle || "Забайкальский край",
      regionDescription: regionDescription || "Уникальный регион России с богатой природой и историей",
      regionVideoUrl: regionVideoUrl || "",
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
      regionTitle,
      regionDescription,
      regionVideoUrl,
    },
  });

  // Обновляем кэш/ISR для нужных страниц
  revalidatePath("/");
  revalidatePath("/admin");
}

export const dynamic = "force-dynamic";

export default async function AdminSitePage() {
  const site = await prisma.siteContent.findUnique({ where: { slug: "main" } });

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6E0A6B] to-purple-600 flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#6E0A6B] to-purple-600 bg-clip-text text-transparent">
                Редактор контента
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Управление содержимым главной страницы и контактной информацией
              </p>
            </div>
          </div>
        </div>

        <form action={updateSiteContent} className="space-y-8">
          {/* Hero Section */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Hero секция</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-600"></div>
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Основной текст героя
              </label>
              <textarea
                name="heroText"
                rows={4}
                defaultValue={site?.heroText || ""}
                placeholder="Введите основной текст для hero секции..."
                className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-900/50 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 resize-none hover:border-gray-300 dark:hover:border-gray-500"
              />
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Блоки достижений</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-600"></div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((num) => (
                <div key={num} className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-200 group">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs font-bold flex items-center justify-center group-hover:scale-110 transition-transform">
                      {num}
                    </div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">Блок {num}</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Число</label>
                      <input 
                        name={`feature${num}Number`} 
                        defaultValue={site?.[`feature${num}Number` as keyof typeof site] as string} 
                        placeholder="250+"
                        className="w-full mt-1 rounded-lg border-2 border-gray-200 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-lg font-bold text-center" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Подпись</label>
                      <input 
                        name={`feature${num}Label`} 
                        defaultValue={site?.[`feature${num}Label` as keyof typeof site] as string} 
                        placeholder="Описание достижения"
                        className="w-full mt-1 rounded-lg border-2 border-gray-200 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all" 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Section */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Подвал сайта</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-600"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Описание компании
                </label>
                <input
                  name="footerDescription"
                  defaultValue={site?.footerDescription || ""}
                  placeholder="Краткое описание вашей деятельности"
                  className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-900/50 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                />
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Контактная информация
                </label>
                <textarea
                  name="footerContacts"
                  rows={3}
                  defaultValue={site?.footerContacts}
                  placeholder="Адрес, телефон, email&#10;(каждый с новой строки)"
                  className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-900/50 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 resize-none hover:border-gray-300 dark:hover:border-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Обратная связь</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-600"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  Номер телефона
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <input
                    name="contactPhone"
                    defaultValue={site?.contactPhone || ""}
                    placeholder="+7 (999) 123-45-67"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900/50 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  Email адрес
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    name="contactEmail"
                    type="email"
                    defaultValue={site?.contactEmail}
                    placeholder="info@example.com"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900/50 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Region Video Section */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">О регионе (видео)</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-600"></div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  Заголовок секции
                </label>
                <input
                  name="regionTitle"
                  defaultValue={site?.regionTitle || ""}
                  placeholder="Забайкальский край"
                  className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-900/50 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  Описание региона
                </label>
                <textarea
                  name="regionDescription"
                  rows={5}
                  defaultValue={site?.regionDescription || ""}
                  placeholder="Описание Забайкальского края, его особенности и достопримечательности..."
                  className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-900/50 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 resize-none hover:border-gray-300 dark:hover:border-gray-500"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  URL видео (Rutube embed)
                </label>
                <input
                  name="regionVideoUrl"
                  defaultValue={site?.regionVideoUrl || ""}
                  placeholder="https://rutube.ru/play/embed/..."
                  className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-900/50 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                />
                <p className="text-xs text-gray-500 flex items-center gap-2">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Поддерживаются: Rutube, YouTube, VK Video
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <button
                type="submit"
                className="group relative px-8 py-4 bg-gradient-to-r from-[#6E0A6B] to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                <div className="relative flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Сохранить изменения
                </div>
              </button>
              
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Изменения автоматически применятся на главной странице
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}