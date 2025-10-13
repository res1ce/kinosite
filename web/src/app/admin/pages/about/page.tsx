// pages/about
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import SingleImageUploader from "@/components/SingleImageUploader";
import TeamMemberCard from "./TeamMemberCard";

async function updateAboutPage(formData: FormData) {
  "use server";
  const content = String(formData.get("content") || "").trim();
  if (!content) return;
  await prisma.page.upsert({
    where: { slug: "about" },
    create: { slug: "about", title: "О нас", content, isPublished: true },
    update: { content },
  });
  revalidatePath("/about"); 
  revalidatePath("/admin/pages");
}

async function addTeamMember(formData: FormData) {
  "use server";
  const name = String(formData.get("name") || "").trim();
  const position = String(formData.get("position") || "").trim();
  const photo = String(formData.get("photo") || "").trim();
  const description = String(formData.get("description") || "").trim();

  if (!name || !position || !description) return;

  // Получаем максимальный order для правильной сортировки
  const lastMember = await prisma.teamMember.findFirst({
    orderBy: { order: 'desc' }
  });
  const newOrder = lastMember ? lastMember.order + 1 : 0;

  await prisma.teamMember.create({
    data: {
      name,
      position,
      photo,
      description,
      order: newOrder
    },
  });
  
  revalidatePath("/admin/about");
}

async function updateTeamMember(formData: FormData) {
  "use server";
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  const position = String(formData.get("position") || "").trim();
  const photo = String(formData.get("photo") || "").trim();
  const description = String(formData.get("description") || "").trim();

  if (!id || !name || !position || !description) return;

  await prisma.teamMember.update({
    where: { id },
    data: { name, position, photo, description },
  });
  
  revalidatePath("/admin/about");
}

async function deleteTeamMember(formData: FormData) {
  "use server";
  const id = String(formData.get("id") || "");
  if (!id) return;

  await prisma.teamMember.delete({
    where: { id },
  });
  
  revalidatePath("/admin/about");
}

async function moveTeamMember(formData: FormData) {
  "use server";
  const id = String(formData.get("id") || "");
  const direction = String(formData.get("direction") || "");
  if (!id || !direction) return;

  const member = await prisma.teamMember.findUnique({ where: { id } });
  if (!member) return;

  if (direction === "up") {
    const prevMember = await prisma.teamMember.findFirst({
      where: { order: { lt: member.order } },
      orderBy: { order: 'desc' }
    });
    if (prevMember) {
      await prisma.$transaction([
        prisma.teamMember.update({
          where: { id: member.id },
          data: { order: prevMember.order }
        }),
        prisma.teamMember.update({
          where: { id: prevMember.id },
          data: { order: member.order }
        })
      ]);
    }
  } else if (direction === "down") {
    const nextMember = await prisma.teamMember.findFirst({
      where: { order: { gt: member.order } },
      orderBy: { order: 'asc' }
    });
    if (nextMember) {
      await prisma.$transaction([
        prisma.teamMember.update({
          where: { id: member.id },
          data: { order: nextMember.order }
        }),
        prisma.teamMember.update({
          where: { id: nextMember.id },
          data: { order: member.order }
        })
      ]);
    }
  }
  
  revalidatePath("/admin/about");
}

export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
  const aboutPage = await prisma.page.findUnique({ where: { slug: "about" } });
  const teamMembers = await prisma.teamMember.findMany({
    orderBy: { order: 'asc' }
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900/20 p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Страница &quot;О нас&quot;
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Редактирование содержимого страницы и управление командой
              </p>
            </div>
          </div>
        </div>

        {/* Content Editor */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">HTML редактор</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-600"></div>
          </div>

          <form action={updateAboutPage} className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Содержание страницы (HTML разрешён)
              </label>
              <div className="relative">
                <textarea
                  name="content" 
                  rows={25} 
                  defaultValue={aboutPage?.content} 
                  required
                  placeholder="Введите HTML содержимое страницы 'О нас'..."
                  className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 px-4 py-4 bg-white dark:bg-gray-900/50 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 resize-none hover:border-gray-300 dark:hover:border-gray-500 font-mono text-sm leading-relaxed"
                />
                <div className="absolute top-4 right-4 text-xs text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded-md">
                  HTML
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Вы можете использовать HTML теги для форматирования текста
              </div>
            </div>

            {/* Preview Section */}
            {aboutPage?.content && (
              <div className="border-t pt-6">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Предварительный просмотр
                </h3>
                <div className="max-h-60 overflow-y-auto rounded-xl border-2 border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 p-4">
                  <div 
                    className="prose dark:prose-invert prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: aboutPage.content }}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-4 border-t">
              <button
                type="submit"
                className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                <div className="relative flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Сохранить страницу
                </div>
              </button>
              
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Изменения будут видны на странице /about
              </div>
            </div>
          </form>
        </div>

        {/* Team Management Section */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Управление командой</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-600"></div>
            <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-medium rounded-full">
              {teamMembers.length} участников
            </span>
          </div>

          {/* Add New Team Member */}
          <div className="mb-8 p-6 bg-gray-50/50 dark:bg-gray-900/20 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Добавить участника команды
            </h3>
            
            <form action={addTeamMember} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Имя и фамилия *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Александр Петров"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900/50 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Должность *
                  </label>
                  <input
                    type="text"
                    name="position"
                    required
                    placeholder="Директор кинокомиссии"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900/50 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Фотография
                  </label>
                  <SingleImageUploader name="photo" variant="teal" />
                </div>
              </div>
              
              <button
                type="submit"
                className="group relative px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <div className="relative flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Добавить участника
                </div>
              </button>
            </form>
          </div>

          {/* Existing Team Members */}
          {teamMembers.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Текущая команда
              </h3>
              
              <div className="grid gap-4">
              {teamMembers.map((member, index) => (
                <TeamMemberCard
                  key={member.id}
                  member={member}
                  index={index}
                  totalMembers={teamMembers.length}
                  moveTeamMember={moveTeamMember}
                  updateTeamMember={updateTeamMember}
                  deleteTeamMember={deleteTeamMember}
                />
              ))}
              </div>
            </div>
          )}

          {teamMembers.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Команда пока не сформирована
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Добавьте первого участника команды, используя форму выше
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}