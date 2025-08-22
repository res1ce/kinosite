// page.tsx "about"
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function AboutPage() {
  const aboutPage = await prisma.page.findUnique({
    where: { slug: "about" }
  });

  if (!aboutPage?.isPublished) {
    notFound();
  }

  return (
<main>
  <section className="py-20 animate-fadeUp">
    <div className="container mx-auto px-6 max-w-4xl">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          О нас
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Узнайте больше о нашей миссии и работе
        </p>
      </div>

      <div className="rounded-2xl shadow-md bg-white dark:bg-[#111] p-8 md:p-12">
        {aboutPage?.content ? (
          <article
            className="prose prose-lg prose-slate dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: aboutPage.content }}
          />
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center text-lg">
            Информация обновляется...
          </p>
        )}
      </div>
    </div>
  </section>
</main>
  );
}
