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
    <main className="grid">
      <section className="py-20 bg-gradient-to-r from-[#6E0A6B]/10 to-transparent">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <h2 className="section-title mb-6">О нас</h2>
          {aboutPage?.content ? (
          <article 
            className="prose prose-lg prose-slate mx-auto dark:prose-invert text-lg text-gray-700 dark:text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: aboutPage.content }} 
          />
        ) : (
          <p className="text-gray-600 text-center">
            Информация обновляется...
          </p>
        )}
        </div>
      </section>
    </main>
  );
}
