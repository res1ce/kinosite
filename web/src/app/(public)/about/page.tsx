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
    <main className="container mx-auto py-8 px-4">
      {/* Заголовок */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900">{aboutPage?.title || "О нас"}</h1>
      </div>

      {/* Контент */}
      <div className="max-w-4xl mx-auto">
        {aboutPage?.content ? (
          <article 
            className="prose prose-lg prose-slate mx-auto dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: aboutPage.content }} 
          />
        ) : (
          <p className="text-gray-600 text-center">
            Информация обновляется...
          </p>
        )}
      </div>
    </main>
  );
}
